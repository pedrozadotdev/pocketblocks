package migrations

import (
	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/internoapp/pocketblocks/server/models"
	"github.com/pocketbase/dbx"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)
		//Prevent delete users collection or avatar/name fields
		usersCollection, err := dao.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}
		usersCollection.System = true
		usersCollection.Schema.AddField(&schema.SchemaField{
			System:  true,
			Id:      "users_name",
			Type:    schema.FieldTypeText,
			Name:    "name",
			Options: &schema.TextOptions{},
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

		//Create PocketBlocks tables
		_, tablesErr := db.NewQuery(`
		CREATE TABLE {{_pbl_folders}} (
			[[id]]        TEXT PRIMARY KEY NOT NULL,
			[[name]]      TEXT NOT NULL,
			[[createdBy]] TEXT NOT NULL,
			[[created]]   TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			[[updated]]   TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			---
			FOREIGN KEY ([[createdBy]]) REFERENCES {{_users}} ([[id]]) ON UPDATE CASCADE ON DELETE CASCADE
		);

		CREATE TABLE {{_pbl_groups}} (
			[[id]]         TEXT PRIMARY KEY NOT NULL,
			[[name]]       TEXT NOT NULL,
			[[users]]      JSON DEFAULT "[]" NOT NULL,
			[[created]]    TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			[[updated]]    TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL
		);

		CREATE TABLE {{_pbl_apps}} (
			[[id]]         TEXT PRIMARY KEY NOT NULL,
			[[name]]       TEXT NOT NULL,
			[[slug]]       TEXT NOT NULL,
			[[type]]       INTEGER NOT NULL,
			[[status]]     TEXT NOT NULL,
			[[public]]     BOOLEAN DEFAULT FALSE NOT NULL,
			[[allUsers]]   BOOLEAN DEFAULT FALSE NOT NULL,
			[[createdBy]]  TEXT NOT NULL,
			[[groups]]     JSON DEFAULT "[]" NOT NULL,
			[[users]]      JSON DEFAULT "[]" NOT NULL,
			[[appDSL]]     JSON DEFAULT "{}" NOT NULL,
			[[editDSL]]    JSON DEFAULT "{}" NOT NULL,
			[[folderId]]   TEXT,
			[[created]]    TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			[[updated]]    TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			---
			FOREIGN KEY ([[createdBy]]) REFERENCES {{_users}} ([[id]]) ON UPDATE CASCADE ON DELETE CASCADE,
			FOREIGN KEY ([[folderId]]) REFERENCES {{_pbl_folders}} ([[id]]) ON UPDATE CASCADE ON DELETE CASCADE
		);

		CREATE TABLE {{_pbl_app_snapshots}} (
			[[id]]        TEXT PRIMARY KEY NOT NULL,
			[[appId]]     TEXT NOT NULL,
			[[dsl]]       JSON DEFAULT "{}" NOT NULL,
			[[context]]   JSON DEFAULT "{}" NOT NULL,
			[[createdBy]] TEXT NOT NULL,
			[[created]]   TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			[[updated]]   TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			---
			FOREIGN KEY ([[appId]]) REFERENCES {{_pbl_apps}} ([[id]]) ON UPDATE CASCADE ON DELETE CASCADE
		);

		CREATE INDEX _pbl_app_snapshots_app_idx ON {{_pbl_app_snapshots}} ([[appId]]);
		CREATE UNIQUE INDEX _pbl_apps_unique_slug_idx ON {{_pbl_apps}} ([[slug]]);

		`).Execute()
		if tablesErr != nil {
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
