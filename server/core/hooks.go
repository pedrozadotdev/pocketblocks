package core

import (
	"os"
	"time"

	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/internoapp/pocketblocks/server/ui"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/hook"
)

func uiCacheControl() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Response().Header().Set("Cache-Control", "max-age=1209600, stale-while-revalidate=86400")
			return next(c)
		}
	}
}

func registerHooks(app *pocketbase.PocketBase, publicDir string, queryTimeout int) {
	app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
		app.Dao().ModelQueryTimeout = time.Duration(queryTimeout) * time.Second
		return nil
	})

	// Serves static files from the provided public dir (if exists),
	//
	// Register pbl routes and init pbl settings
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/pbl/*", apis.StaticDirectoryHandler(os.DirFS(publicDir), false))
		e.Router.GET(
			"/*",
			apis.StaticDirectoryHandler(ui.DistDirFS, true),
			uiCacheControl(),
			middleware.Gzip(),
		)
		registerRoutes(app, e.Router)
		if err := daos.New(app.Dao().DB()).RefreshPblSettings(); err != nil {
			return err
		}

		return nil
	})

	//Init Playground(For quick tests)
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		playgroundInit(app)

		return nil
	})

	// Prevent use to change email action URLs
	app.OnSettingsBeforeUpdateRequest().Add(func(e *core.SettingsUpdateEvent) error {
		oldS, newS := e.OldSettings, e.NewSettings
		verificationUrlChanged := oldS.Meta.VerificationTemplate.ActionUrl != newS.Meta.VerificationTemplate.ActionUrl
		passordResetUrlChanged := oldS.Meta.ResetPasswordTemplate.ActionUrl != newS.Meta.ResetPasswordTemplate.ActionUrl
		confirmPasswordUrlChanged := oldS.Meta.ConfirmEmailChangeTemplate.ActionUrl != newS.Meta.ConfirmEmailChangeTemplate.ActionUrl

		if verificationUrlChanged || passordResetUrlChanged || confirmPasswordUrlChanged {
			return apis.NewBadRequestError("Action URLs are configured for PocketBlocks!", nil)
		}
		return nil
	})

	//Add/Remove Admin from Settings.AdminTutorial
	app.OnAdminAfterCreateRequest().Add(func(e *core.AdminCreateEvent) error {
		dao := daos.New(app.Dao().DB())
		settings := dao.GetCurrentPblSettings()

		clone, err := settings.Clone()
		if err != nil {
			return apis.NewApiError(500, "Something went wrong", err)
		}

		clone.AdminTutorial = append(clone.AdminTutorial, e.Admin.Id)
		if err := settings.Merge(clone); err != nil {
			return apis.NewApiError(500, "Something went wrong", err)
		}

		if err := dao.SavePblSettings(settings); err != nil {
			return apis.NewApiError(500, "Something went wrong", err)
		}

		return nil
	})

	app.OnAdminAfterDeleteRequest().Add(func(e *core.AdminDeleteEvent) error {
		dao := daos.New(app.Dao().DB())
		if err := dao.RemoveAdminFromPblSettingsTutorial(e.Admin.Id); err != nil {
			return apis.NewApiError(500, "Something went wrong", err)
		}
		return nil
	})

	// Enable Auto Verified Email feature when SMTP is not configured
	app.OnRecordAfterCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {
		settings := app.Settings()
		if !settings.Smtp.Enabled {
			user, err := app.Dao().FindRecordById("users", e.Record.Id)
			if err != nil {
				return apis.NewApiError(500, "Something went wrong", err)
			}
			user.Set("verified", true)
			if err := app.Dao().SaveRecord(user); err != nil {
				return apis.NewApiError(500, "Something went wrong", err)
			}
		}
		return nil
	})

	//Send back the current email to autologin
	app.OnRecordAfterConfirmEmailChangeRequest("users").Add(func(e *core.RecordConfirmEmailChangeEvent) error {
		user, err := app.Dao().FindRecordById("users", e.Record.Id)
		if err != nil {
			return apis.NewApiError(500, "Something went wrong", err)
		}
		email := user.GetString("email")
		e.HttpContext.JSON(200, map[string]any{"email": email})
		return hook.StopPropagation
	})

	app.OnRecordAfterConfirmPasswordResetRequest("users").Add(func(e *core.RecordConfirmPasswordResetEvent) error {
		user, err := app.Dao().FindRecordById("users", e.Record.Id)
		if err != nil {
			return apis.NewApiError(500, "Something went wrong", err)
		}
		email := user.GetString("email")
		e.HttpContext.JSON(200, map[string]any{"email": email})
		return hook.StopPropagation
	})

	//Prevent users from removing/changing collections/fields needed for PocketBlocks to work properly
	app.OnCollectionBeforeDeleteRequest().Add(func(e *core.CollectionDeleteEvent) error {
		if e.Collection.Id == "_pb_users_auth_" || e.Collection.Id == "_pb_groups_col_" {
			return apis.NewBadRequestError("You cannot remove users/groups collection", nil)
		}
		return nil
	})
	app.OnCollectionBeforeUpdateRequest().Add(func(e *core.CollectionUpdateEvent) error {
		if e.Collection.Id == "_pb_users_auth_" {
			nameField := e.Collection.Schema.GetFieldById("users_name")
			avatarField := e.Collection.Schema.GetFieldById("users_avatar")
			if nameField == nil || avatarField == nil || !nameField.System || !avatarField.System {
				return apis.NewBadRequestError("You cannot remove/edit name and avatar fields", nil)
			}
		} else if e.Collection.Id == "_pb_groups_col_" {
			nameField := e.Collection.Schema.GetFieldById("groups_name")
			usersField := e.Collection.Schema.GetFieldById("groups_users")
			if nameField == nil || usersField == nil || !nameField.System || !usersField.System {
				return apis.NewBadRequestError("You cannot remove/edit name and users fields", nil)
			}
		}

		return nil
	})
}
