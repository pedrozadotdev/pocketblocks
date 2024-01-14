package core

import (
	"os"
	"slices"
	"time"

	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/internoapp/pocketblocks/server/ui"
	"github.com/internoapp/pocketblocks/server/utils"
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
	// Register pbl routes and init pbl settings/store
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/pbl/*", apis.StaticDirectoryHandler(os.DirFS(publicDir), false))
		e.Router.GET(
			"/*",
			apis.StaticDirectoryHandler(ui.DistDirFS, true),
			uiCacheControl(),
			middleware.Gzip(),
		)
		registerRoutes(app, e.Router)

		dao := daos.New(app.Dao().DB())

		if err := dao.RefreshPblSettings(); err != nil {
			return err
		}

		store := dao.GetPblStore()
		userFieldUpdate, err := utils.GetUserAllowedUpdateFields(app)
		if err != nil {
			return err
		}
		store.Set(utils.UserFieldUpdateKey, userFieldUpdate)

		userAuthMethods, err := utils.GetUserAuthMethods(app)
		if err != nil {
			return err
		}
		store.Set(utils.UserAuthsKey, userAuthMethods)

		canUserSingUp, err := utils.GetCanUserSignUp(app)
		if err != nil {
			return err
		}
		store.Set(utils.CanUserSignUpKey, canUserSingUp)

		totalAdmin, err := dao.TotalAdmins()
		if err != nil {
			return err
		}
		store.Set(utils.SetupFirstAdminKey, totalAdmin == 0)

		settings, _ := app.Settings().Clone()
		store.Set(utils.SmtpStatusKey, settings.Smtp.Enabled)

		localAuthInfo, err := utils.GetLocalAuthGeneralInfo(app)
		if err != nil {
			return err
		}
		store.Set(utils.LocalAuthGeneralInfoKey, localAuthInfo)

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

	//Add/Remove Admin from Settings.AdminTutorial and set SetupFirstAdmin to false
	app.OnAdminAfterCreateRequest().Add(func(e *core.AdminCreateEvent) error {
		dao := daos.New(app.Dao().DB())
		settings := dao.GetPblSettings()

		clone, err := settings.Clone()
		if err != nil {
			return apis.NewApiError(500, "Something went wrong", err)
		}

		clone.ShowTutorial = append(clone.ShowTutorial, e.Admin.Id)
		if err := settings.Merge(clone); err != nil {
			return apis.NewApiError(500, "Something went wrong", err)
		}

		if err := dao.SavePblSettings(settings); err != nil {
			return apis.NewApiError(500, "Something went wrong", err)
		}

		store := dao.GetPblStore()
		if store.Get(utils.SetupFirstAdminKey).(bool) {
			store.Set(utils.SetupFirstAdminKey, false)
		}

		return nil
	})

	app.OnAdminAfterDeleteRequest().Add(func(e *core.AdminDeleteEvent) error {
		dao := daos.New(app.Dao().DB())
		if err := dao.DeleteAdminFromPblSettingsTutorial(e.Admin.Id); err != nil {
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

	//Update store when settings or user collection change
	app.OnSettingsAfterUpdateRequest().Add(func(e *core.SettingsUpdateEvent) error {
		dao := daos.New(app.Dao().DB())
		store := dao.GetPblStore()
		userAuthMethods, err := utils.GetUserAuthMethods(app)
		if err != nil {
			return err
		}
		store.Set(utils.UserAuthsKey, userAuthMethods)

		settings, _ := app.Settings().Clone()
		store.Set(utils.SmtpStatusKey, settings.Smtp.Enabled)

		return nil
	})
	app.OnCollectionAfterUpdateRequest().Add(func(e *core.CollectionUpdateEvent) error {
		if e.Collection.Id == "_pb_users_auth_" {
			dao := daos.New(app.Dao().DB())
			store := dao.GetPblStore()

			userFieldUpdate, err := utils.GetUserAllowedUpdateFields(app)
			if err != nil {
				return err
			}
			store.Set(utils.UserFieldUpdateKey, userFieldUpdate)

			userAuthMethods, err := utils.GetUserAuthMethods(app)
			if err != nil {
				return err
			}
			store.Set(utils.UserAuthsKey, userAuthMethods)

			canUserSingUp, err := utils.GetCanUserSignUp(app)
			if err != nil {
				return err
			}
			store.Set(utils.CanUserSignUpKey, canUserSingUp)

			localAuthInfo, err := utils.GetLocalAuthGeneralInfo(app)
			if err != nil {
				return err
			}
			store.Set(utils.LocalAuthGeneralInfoKey, localAuthInfo)
		}

		return nil
	})

	//Prevent user to edit email/password if users update rule don't allow it
	app.OnRecordBeforeRequestEmailChangeRequest("users").Add(func(e *core.RecordRequestEmailChangeEvent) error {
		dao := daos.New(app.Dao().DB())
		store := dao.GetPblStore()
		updateFields := store.Get(utils.UserFieldUpdateKey).([]string)

		if !slices.Contains(updateFields, "email") {
			return apis.NewForbiddenError("You cannot change the email.", nil)
		}

		return nil
	})
	app.OnRecordBeforeRequestPasswordResetRequest("users").Add(func(e *core.RecordRequestPasswordResetEvent) error {
		dao := daos.New(app.Dao().DB())
		store := dao.GetPblStore()
		updateFields := store.Get(utils.UserFieldUpdateKey).([]string)

		if !slices.Contains(updateFields, "password") {
			return apis.NewForbiddenError("You cannot change the password.", nil)
		}

		return nil
	})
}
