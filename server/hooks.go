package main

import (
	"strings"

	"github.com/gosimple/slug"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func registerHooks(app *pocketbase.PocketBase) {
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

		return nil
	})
}
