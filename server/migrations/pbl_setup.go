package migrations

import (
	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/internoapp/pocketblocks/server/models"
	"github.com/pocketbase/dbx"
	m "github.com/pocketbase/pocketbase/migrations"
	pm "github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/models/schema"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)
		//Set users collection and avatar/name fields to System
		usersCollection, err := dao.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}
		usersCollection.System = true
		usersCollection.Schema.AddField(&schema.SchemaField{
			System:   true,
			Id:       "users_name",
			Type:     schema.FieldTypeText,
			Name:     "name",
			Options:  &schema.TextOptions{},
			Required: true,
		})
		usersCollection.Schema.AddField(&schema.SchemaField{
			System: true,
			Id:     "users_avatar",
			Type:   schema.FieldTypeFile,
			Name:   "avatar",
			Options: &schema.FileOptions{
				MaxSelect: 1,
				MaxSize:   5242880,
				MimeTypes: []string{
					"image/jpeg",
					"image/png",
					"image/svg+xml",
					"image/gif",
					"image/webp",
				},
			},
		})
		if err := dao.SaveCollection(usersCollection); err != nil {
			return err
		}

		//Create groups collection
		groupsCollection := &pm.Collection{}
		groupsCollection.MarkAsNew()
		groupsCollection.Id = "_pb_groups_col_"
		groupsCollection.Name = "groups"
		groupsCollection.Type = pm.CollectionTypeBase
		groupsCollection.System = true
		groupsCollection.ListRule = types.Pointer("users.id ?= @request.auth.id")
		groupsCollection.ViewRule = types.Pointer("users.id ?= @request.auth.id")
		groupsCollection.Schema = schema.NewSchema(
			&schema.SchemaField{
				System:  true,
				Id:      "groups_name",
				Type:    schema.FieldTypeText,
				Name:    "name",
				Options: &schema.TextOptions{},
			},
			&schema.SchemaField{
				System: true,
				Id:     "groups_users",
				Type:   schema.FieldTypeRelation,
				Name:   "users",
				Options: &schema.RelationOptions{
					CollectionId: "_pb_users_auth_",
				},
			},
		)

		if err := dao.SaveCollection(groupsCollection); err != nil {
			return err
		}

		//Create PocketBlocks tables
		if _, tablesErr := db.NewQuery(`
		CREATE TABLE {{_pbl_folders}} (
			[[id]]        TEXT PRIMARY KEY NOT NULL,
			[[name]]      TEXT NOT NULL,
			[[created]]   TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			[[updated]]   TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL
		);

		CREATE TABLE {{_pbl_apps}} (
			[[id]]         TEXT PRIMARY KEY NOT NULL,
			[[name]]       TEXT NOT NULL,
			[[slug]]       TEXT NOT NULL,
			[[type]]       INTEGER NOT NULL,
			[[status]]     TEXT NOT NULL,
			[[public]]     BOOLEAN DEFAULT FALSE NOT NULL,
			[[allUsers]]   BOOLEAN DEFAULT FALSE NOT NULL,
			[[groups]]     JSON DEFAULT "[]" NOT NULL,
			[[users]]      JSON DEFAULT "[]" NOT NULL,
			[[appDSL]]     JSON DEFAULT "{}" NOT NULL,
			[[editDSL]]    JSON DEFAULT "{}" NOT NULL,
			[[folder]]   TEXT,
			[[created]]    TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			[[updated]]    TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			---
			FOREIGN KEY ([[folder]]) REFERENCES {{_pbl_folders}} ([[id]]) ON UPDATE CASCADE ON DELETE CASCADE
		);

		CREATE TABLE {{_pbl_app_snapshots}} (
			[[id]]        TEXT PRIMARY KEY NOT NULL,
			[[app]]     TEXT NOT NULL,
			[[dsl]]       JSON DEFAULT "{}" NOT NULL,
			[[context]]   JSON DEFAULT "{}" NOT NULL,
			[[created]]   TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			[[updated]]   TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			---
			FOREIGN KEY ([[app]]) REFERENCES {{_pbl_apps}} ([[id]]) ON UPDATE CASCADE ON DELETE CASCADE
		);

		CREATE INDEX _pbl_app_snapshots_app_idx ON {{_pbl_app_snapshots}} ([[app]]);
		CREATE UNIQUE INDEX _pbl_apps_unique_slug_idx ON {{_pbl_apps}} ([[slug]]);

		`).Execute(); tablesErr != nil {
			return tablesErr
		}

		//Create PocketBlocks Settings
		defaultSettings := models.NewSettings()
		if err := dao.SavePblSettings(defaultSettings); err != nil {
			return err
		}

		return nil
	}, func(db dbx.Builder) error {
		return nil
	})
}
