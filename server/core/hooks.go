package core

import (
	"os"
	"slices"

	// "slices"
	// "strings"
	"time"

	// "github.com/gosimple/slug"
	"github.com/internoapp/pocketblocks/server/ui"
	"github.com/labstack/echo/v5/middleware"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"

	// "github.com/pocketbase/pocketbase/models"
	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/pocketbase/pocketbase/tools/hook"
)

func registerHooks(app *pocketbase.PocketBase, publicDir string, queryTimeout int) {
	app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
		app.Dao().ModelQueryTimeout = time.Duration(queryTimeout) * time.Second
		return nil
	})

	// serves static files from the provided public dir (if exists) and register pbl routes
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/pbl/*", apis.StaticDirectoryHandler(os.DirFS(publicDir), false))
		e.Router.GET(
			"/*",
			apis.StaticDirectoryHandler(ui.DistDirFS, true),
			uiCacheControl(),
			middleware.Gzip(),
		)
		registerRoutes(e)
		return nil
	})

	// Prevent use to change email action URLs
	app.OnSettingsBeforeUpdateRequest().Add(func(e *core.SettingsUpdateEvent) error {
		oldS, newS := e.OldSettings, e.NewSettings
		verificationUrlChanged := oldS.Meta.VerificationTemplate.ActionUrl != newS.Meta.VerificationTemplate.ActionUrl
		passordResetUrlChanged := oldS.Meta.ResetPasswordTemplate.ActionUrl != newS.Meta.ResetPasswordTemplate.ActionUrl
		confirmPasswordUrlChanged := oldS.Meta.ConfirmEmailChangeTemplate.ActionUrl != newS.Meta.ConfirmEmailChangeTemplate.ActionUrl

		if verificationUrlChanged || passordResetUrlChanged || confirmPasswordUrlChanged {
			return apis.NewBadRequestError("You cannot change the Action URLs!", nil)
		}
		return nil
	})

	//Add/Remove Admin from Settings.AdminTutorial
	app.OnAdminAfterCreateRequest().Add(func(e *core.AdminCreateEvent) error {
		dao := daos.New(app.Dao().DB())
		settings, err := dao.FindPblSettings()
		if err != nil {
			return err
		}

		clone, err := settings.Clone()
		if err != nil {
			return err
		}

		clone.AdminTutorial = append(clone.AdminTutorial, e.Admin.Id)
		if err := settings.Merge(clone); err != nil {
			return err
		}

		return dao.SavePblSettings(settings)
	})

	app.OnAdminAfterDeleteRequest().Add(func(e *core.AdminDeleteEvent) error {
		dao := daos.New(app.Dao().DB())
		settings, err := dao.FindPblSettings()
		if err != nil {
			return err
		}

		clone, err := settings.Clone()
		if err != nil {
			return err
		}

		if slices.Contains(clone.AdminTutorial, e.Admin.Id) {
			newAdminTutorial := []string{}

			for _, id := range clone.AdminTutorial {
				if id != e.Admin.Id {
					newAdminTutorial = append(newAdminTutorial, id)
				}
			}

			clone.AdminTutorial = newAdminTutorial
			if err := settings.Merge(clone); err != nil {
				return err
			}

			return dao.SavePblSettings(settings)
		}
		return nil
	})

	//Prevent anonymous signup with disabled auth type
	app.OnRecordBeforeCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {
		info := apis.RequestInfo(e.HttpContext)
		isAnon := info.Admin == nil && info.AuthRecord == nil
		_, isPasswordSignup := info.Data["password"]

		dao := daos.New(app.Dao().DB())
		settings, err := dao.FindPblSettings()

		if err != nil {
			return apis.NewBadRequestError("Organization not found!", nil)
		}
		if isAnon && isPasswordSignup && !settings.Auths.Local.AllowSignup {
			return apis.NewUnauthorizedError("You cannot signup with this provider!", nil)
		}
		return nil
	})

	app.OnRecordBeforeAuthWithOAuth2Request().Add(func(e *core.RecordAuthWithOAuth2Event) error {
		dao := daos.New(app.Dao().DB())
		settings, err := dao.FindPblSettings()
		if err != nil {
			return apis.NewBadRequestError("Organization not found!", nil)
		}
		if oauth := settings.GetOauthByAuthName(e.ProviderName); !oauth.AllowSignup {
			return apis.NewBadRequestError("You cannot signup with this provider!", nil)
		}
		return nil
	})

	// Auto Verified Email Feature
	app.OnRecordAfterCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {
		dao := daos.New(app.Dao().DB())
		settings, err := dao.FindPblSettings()
		if err != nil {
			return apis.NewBadRequestError("Organization not found!", nil)
		}
		if settings.Auths.Local.EmailAutoverified {
			user, err := app.Dao().FindRecordById("users", e.Record.Id)
			if err != nil {
				return err
			}
			user.Set("verified", true)
			app.Dao().SaveRecord(user)
		}
		return nil
	})

	// Prevent update username/email/password if not enabled
	app.OnRecordBeforeUpdateRequest("users").Add(func(e *core.RecordUpdateEvent) error {
		dao := daos.New(app.Dao().DB())
		settings, err := dao.FindPblSettings()
		if err != nil {
			return apis.NewBadRequestError("Organization not found!", nil)
		}
		info := apis.RequestInfo(e.HttpContext)
		isAdmin := info.Admin != nil
		_, isUsernameSet := info.Data["username"]
		_, isPasswordSet := info.Data["password"]
		allowUpdate := settings.Auths.Local.AllowUpdate
		if !isAdmin {
			if isUsernameSet && slices.Contains(allowUpdate, "username") {
				return apis.NewBadRequestError("You cannot update the username!", nil)
			}
			if isPasswordSet && !slices.Contains(allowUpdate, "password") {
				return apis.NewBadRequestError("You cannot update the password!", nil)
			}
		}
		return nil
	})

	app.OnRecordBeforeRequestPasswordResetRequest().Add(func(e *core.RecordRequestPasswordResetEvent) error {
		dao := daos.New(app.Dao().DB())
		settings, err := dao.FindPblSettings()
		if err != nil {
			return apis.NewBadRequestError("Organization not found!", nil)
		}
		if !slices.Contains(settings.Auths.Local.AllowUpdate, "password") {
			return apis.NewBadRequestError("You cannot change the password. Contact an Administrator!", nil)
		}
		return nil
	})

	app.OnRecordBeforeRequestEmailChangeRequest().Add(func(e *core.RecordRequestEmailChangeEvent) error {
		dao := daos.New(app.Dao().DB())
		settings, err := dao.FindPblSettings()
		if err != nil {
			return apis.NewBadRequestError("Organization not found!", nil)
		}
		if !slices.Contains(settings.Auths.Local.AllowUpdate, "email") {
			return apis.NewBadRequestError("You cannot update the email!", nil)
		}
		return nil
	})

	//Send back the current email to autologin
	app.OnRecordAfterConfirmEmailChangeRequest("users").Add(func(e *core.RecordConfirmEmailChangeEvent) error {
		user, err := app.Dao().FindRecordById("users", e.Record.Id)
		if err != nil {
			return err
		}
		email := user.GetString("email")
		e.HttpContext.JSON(200, map[string]any{"email": email})
		return hook.StopPropagation
	})

	app.OnRecordAfterConfirmPasswordResetRequest("users").Add(func(e *core.RecordConfirmPasswordResetEvent) error {
		user, err := app.Dao().FindRecordById("users", e.Record.Id)
		if err != nil {
			return err
		}
		email := user.GetString("email")
		e.HttpContext.JSON(200, map[string]any{"email": email})
		return hook.StopPropagation
	})
}
