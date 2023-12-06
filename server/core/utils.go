package core

import (
	"slices"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/models"
)

func uiCacheControl() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Response().Header().Set("Cache-Control", "max-age=1209600, stale-while-revalidate=86400")
			return next(c)
		}
	}
}

func changeUserConfigs(app *pocketbase.PocketBase, tp string, del string) error {
	usersCollection, err := app.Dao().FindCollectionByNameOrId("users")
	if err != nil {
		return err
	}
	if tp == "local:username" {
		usersCollection.Options.Set("allowEmailAuth", false)
		usersCollection.Options.Set("requireEmail", false)
		usersCollection.Options.Set("allowUsernameAuth", true)
	} else if tp == "local:email" {
		usersCollection.Options.Set("allowUsernameAuth", false)
		usersCollection.Options.Set("allowEmailAuth", true)
		usersCollection.Options.Set("requireEmail", true)
	} else if tp == "local:both" {
		usersCollection.Options.Set("allowUsernameAuth", true)
		usersCollection.Options.Set("allowEmailAuth", true)
		usersCollection.Options.Set("requireEmail", true)
	} else if tp == "local:delete" {
		usersCollection.Options.Set("allowUsernameAuth", false)
		usersCollection.Options.Set("allowEmailAuth", false)
		usersCollection.Options.Set("requireEmail", false)
	} else if tp == "oauth" {
		usersCollection.Options.Set("allowOAuth2Auth", true)
	} else {
		usersCollection.Options.Set("allowUsernameAuth", false)
		usersCollection.Options.Set("allowEmailAuth", false)
		usersCollection.Options.Set("requireEmail", false)
		usersCollection.Options.Set("allowOAuth2Auth", false)
	}

	if del == "oauth" {
		usersCollection.Options.Set("allowOAuth2Auth", false)
	} else if del == "local" {
		usersCollection.Options.Set("allowUsernameAuth", false)
		usersCollection.Options.Set("allowEmailAuth", false)
		usersCollection.Options.Set("requireEmail", false)
	}
	if err := app.Dao().SaveCollection(usersCollection); err != nil {
		return err
	}
	return nil
}

func validateAuthFields(auth *models.Record) error {
	localIdType := auth.GetStringSlice("local_id_type")
	localIdInputMask := auth.GetString("local_id_input_mask")
	localIdLabel := auth.GetString("local_id_label")
	localAllowUpdate := auth.GetStringSlice("local_allow_update")
	autoVerified := auth.GetBool("local_email_auto_verified")

	if tp := auth.GetString("type"); tp == "local" {
		if len(localIdType) == 0 {
			return apis.NewBadRequestError("Select at least one local_id_type!", nil)
		}
		if slices.Contains(localIdType, "email") && autoVerified {
			return apis.NewBadRequestError("local_email_auto_verified cannot be true if local_id_type not includes email!", nil)
		}
		if slices.Contains(localIdType, "username") && localIdInputMask != "" {
			return apis.NewBadRequestError("local_id_input_mask should not be set if local_id_type not includes username!", nil)
		}
		if (slices.Contains(localAllowUpdate, "username") && !slices.Contains(localIdType, "username")) || (slices.Contains(localAllowUpdate, "email") && !slices.Contains(localIdType, "email")) {
			return apis.NewBadRequestError("local_id_allow_update can only be set with selected local_id_type!", nil)
		}
	} else {
		if localIdLabel != "" || localIdInputMask != "" || len(localAllowUpdate) > 0 || len(localIdType) > 0 || autoVerified {
			return apis.NewBadRequestError("local_* fields should be set only in local type mode!", nil)
		}
	}

	return nil
}
