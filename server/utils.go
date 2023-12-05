package main

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
)

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
	//TODO
	return nil
}
