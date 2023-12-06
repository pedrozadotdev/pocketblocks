package main

import (
	"os"
	"slices"
	"strings"

	"github.com/gosimple/slug"
	"github.com/internoapp/pocketblocks/server/ui"
	"github.com/labstack/echo/v5/middleware"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/hook"
)

func registerHooks(app *pocketbase.PocketBase) {
	// serves static files from the provided public dir (if exists)
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/pbl/*", apis.StaticDirectoryHandler(os.DirFS("./pbl_public"), false))
		e.Router.GET(
			"/*",
			apis.StaticDirectoryHandler(ui.DistDirFS, true),
			uiCacheControl(),
			middleware.Gzip(),
		)
		return nil
	})

	//Sync pbl_user with user/admin
	app.OnAdminAfterCreateRequest().Add(func(e *core.AdminCreateEvent) error {
		pblUsersCollection, err := app.Dao().FindCollectionByNameOrId("pbl_users")
		if err != nil {
			return err
		}

		user := models.NewRecord(pblUsersCollection)
		user.Set("name", "NONAME")
		user.Set("user_id", e.Admin.Id)
		user.Set("show_tutorial", true)

		if err := app.Dao().SaveRecord(user); err != nil {
			return err
		}
		return nil
	})

	app.OnAdminAfterDeleteRequest().Add(func(e *core.AdminDeleteEvent) error {
		if _, err := app.Dao().FindFirstRecordByData("pbl_users", "user_id", e.Admin.Id); err != nil {
			return err
		}
		return nil
	})

	app.OnRecordAfterCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {
		pblUsersCollection, err := app.Dao().FindCollectionByNameOrId("pbl_users")
		if err != nil {
			return err
		}

		user := models.NewRecord(pblUsersCollection)
		user.Set("name", "NONAME")
		user.Set("user_id", e.Record.Id)
		user.Set("show_tutorial", false)

		if err := app.Dao().SaveRecord(user); err != nil {
			return err
		}
		return nil
	})

	app.OnRecordAfterDeleteRequest("users").Add(func(e *core.RecordDeleteEvent) error {
		if _, err := app.Dao().FindFirstRecordByData("pbl_users", "user_id", e.Record.Id); err != nil {
			return err
		}
		return nil
	})

	app.OnRecordAfterAuthWithOAuth2Request().Add(func(e *core.RecordAuthWithOAuth2Event) error {
		if e.IsNewRecord {
			pblUsersCollection, err := app.Dao().FindCollectionByNameOrId("pbl_users")
			if err != nil {
				return err
			}
			user := models.NewRecord(pblUsersCollection)
			email := e.Record.Email()
			var name string
			if email != "" {
				name = strings.Split(email, "@")[0]
			} else {
				name = "NONAME"
			}
			user.Set("name", name)
			user.Set("user_id", e.Record.Id)
			user.Set("avatar_url", e.OAuth2User.AvatarUrl)
			if err := app.Dao().SaveRecord(user); err != nil {
				return err
			}
		}
		return nil
	})

	//Create/Update app slug
	app.OnRecordBeforeCreateRequest("pbl_applications").Add(func(e *core.RecordCreateEvent) error {
		info := apis.RequestInfo(e.HttpContext)
		if _, ok := info.Data["slug"]; !ok {
			e.Record.Set("slug", slug.Make(e.Record.GetString("name")))
		}
		return nil
	})

	app.OnRecordBeforeUpdateRequest("pbl_applications").Add(func(e *core.RecordUpdateEvent) error {
		currentApp, err := app.Dao().FindRecordById("pbl_applications", e.Record.Id)
		if err != nil {
			return err
		}
		info := apis.RequestInfo(e.HttpContext)
		if _, ok := info.Data["slug"]; !ok && (currentApp.GetString("name") != e.Record.GetString("name")) {
			e.Record.Set("slug", slug.Make(e.Record.GetString("name")))
		}
		return nil
	})

	//Prevent create more than one organization
	app.OnRecordBeforeCreateRequest("pbl_settings").Add(func(e *core.RecordCreateEvent) error {
		if _, err := app.Dao().FindFirstRecordByFilter("pbl_settings", ""); err == nil {
			return apis.NewBadRequestError("Organization already exists!", nil)
		}
		return nil
	})

	//Sync user model with pbl_auth
	app.OnRecordBeforeCreateRequest("pbl_auth").Add(func(e *core.RecordCreateEvent) error {
		if err := validateAuthFields(e.Record); err != nil {
			return err
		}
		if tp := e.Record.GetString("type"); tp == "local" {
			localIdType := e.Record.GetStringSlice("local_id_type")
			var spec string
			if len(localIdType) > 1 {
				spec = "both"
			} else {
				spec = localIdType[0]
			}
			err := changeUserConfigs(app, tp+":"+spec, "")
			if err != nil {
				return err
			}
		} else {
			err := changeUserConfigs(app, "oauth", "")
			if err != nil {
				return err
			}
		}

		return nil
	})

	app.OnRecordBeforeUpdateRequest("pbl_auth").Add(func(e *core.RecordUpdateEvent) error {
		if err := validateAuthFields(e.Record); err != nil {
			return err
		}

		del := ""
		currentAuth, err := app.Dao().FindRecordById("pbl_auth", e.Record.Id)
		if err != nil {
			return err
		}

		if tp := e.Record.GetString("type"); tp == "local" {
			if caTp := currentAuth.GetString("type"); caTp != "local" {
				if _, err := app.Dao().FindFirstRecordByFilter("pbl_auth", "id != "+e.Record.Id+" && type != \"local\""); err != nil {
					del = "oauth"
				}
			}
			localIdType := e.Record.GetStringSlice("local_id_type")
			var spec string
			if len(localIdType) > 1 {
				spec = "both"
			} else {
				spec = localIdType[0]
			}
			err := changeUserConfigs(app, tp+":"+spec, del)
			if err != nil {
				return err
			}
		} else {
			if caTp := currentAuth.GetString("type"); caTp == "local" {
				del = "local"
			}
			err := changeUserConfigs(app, "oauth", del)
			if err != nil {
				return err
			}
		}

		return nil
	})

	app.OnRecordBeforeDeleteRequest("pbl_auth").Add(func(e *core.RecordDeleteEvent) error {
		if tp := e.Record.GetString("type"); tp == "local" {
			err := changeUserConfigs(app, "local:delete", "")
			if err != nil {
				return err
			}
		} else {
			auths, err := app.Dao().FindRecordsByFilter("pbl_auth", "type != \"local\"", "", 2, 0)
			if err != nil {
				apis.NewBadRequestError("You cannot remove more than one auth method at the same time. Try again!", nil)
			}
			if len(auths) == 1 {
				err := changeUserConfigs(app, "oauth:delete", "")
				if err != nil {
					return err
				}
			}
		}
		return nil
	})

	//Prevent anonymous signup with disabled auth type
	app.OnRecordBeforeCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {
		info := apis.RequestInfo(e.HttpContext)
		isAnon := info.Admin == nil && info.AuthRecord == nil
		_, isPasswordSignup := info.Data["password"]
		localAuth, err := app.Dao().FindFirstRecordByData("pbl_auth", "type", "local")
		if err != nil {
			if info.Admin != nil {
				return apis.NewBadRequestError("Please create a pbl_auth local record!", nil)
			}
			return apis.NewBadRequestError("You cannot signup with this provider!", nil)
		}
		if allowSignup := localAuth.GetBool("allow_signup"); isAnon && isPasswordSignup && !allowSignup {
			return apis.NewUnauthorizedError("You cannot signup with this provider!", nil)
		}
		if localIdType := localAuth.GetString("local_id_type"); localIdType == "username" {
			if _, isUsernameSet := info.Data["username"]; !isUsernameSet {
				return apis.NewBadRequestError("Username is required!", nil)
			}
			if _, isEmailSet := info.Data["email"]; isEmailSet {
				return apis.NewBadRequestError("Don't use email when local_id_type is username!", nil)
			}
		}
		return nil
	})

	app.OnRecordBeforeAuthWithOAuth2Request().Add(func(e *core.RecordAuthWithOAuth2Event) error {
		auth, err := app.Dao().FindFirstRecordByData("pbl_auth", "type", e.ProviderName)
		if allowSignup := auth.GetBool("allow_signup"); err != nil || !allowSignup {
			return apis.NewBadRequestError("You cannot signup with this provider!", nil)
		}
		return nil
	})

	// Auto Verified Email Feature
	app.OnRecordAfterCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {
		localAuth, err := app.Dao().FindFirstRecordByData("pbl_auth", "type", "local")
		if err != nil {
			return err
		}
		if localEmailAutoVerified := localAuth.GetBool("local_email_auto_verified"); localEmailAutoVerified {
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
		localAuth, err := app.Dao().FindFirstRecordByData("pbl_auth", "type", "local")
		if err != nil {
			//Ignore
			return nil
		}
		info := apis.RequestInfo(e.HttpContext)
		isAdmin := info.Admin != nil
		_, isUsernameSet := info.Data["username"]
		_, isPasswordSet := info.Data["password"]
		allowUpdate := localAuth.GetStringSlice("local_allow_update")
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
		localAuth, err := app.Dao().FindFirstRecordByData("pbl_auth", "type", "local")
		if err != nil {
			//Ignore
			return nil
		}
		if localAllowUpdate := localAuth.GetStringSlice("local_allow_update"); !slices.Contains(localAllowUpdate, "password") {
			return apis.NewBadRequestError("You cannot change the password. Contact an Administrator!", nil)
		}
		return nil
	})

	app.OnRecordBeforeRequestEmailChangeRequest().Add(func(e *core.RecordRequestEmailChangeEvent) error {
		localAuth, err := app.Dao().FindFirstRecordByData("pbl_auth", "type", "local")
		if err != nil {
			//Ignore
			return nil
		}
		if localAllowUpdate := localAuth.GetStringSlice("local_allow_update"); !slices.Contains(localAllowUpdate, "email") {
			return apis.NewBadRequestError("You cannot update the email!", nil)
		}
		return nil
	})

	//Send back the current email to autologin
	app.OnRecordAfterConfirmEmailChangeRequest().Add(func(e *core.RecordConfirmEmailChangeEvent) error {
		user, err := app.Dao().FindRecordById("users", e.Record.Id)
		if err != nil {
			return err
		}
		email := user.GetString("email")
		e.HttpContext.JSON(200, map[string]any{"email": email})
		return hook.StopPropagation
	})

	app.OnRecordAfterConfirmPasswordResetRequest().Add(func(e *core.RecordConfirmPasswordResetEvent) error {
		user, err := app.Dao().FindRecordById("users", e.Record.Id)
		if err != nil {
			return err
		}
		email := user.GetString("email")
		e.HttpContext.JSON(200, map[string]any{"email": email})
		return hook.StopPropagation
	})
}
