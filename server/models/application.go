package models

import (
	m "github.com/pocketbase/pocketbase/models"
)

var (
	_ m.Model = (*Application)(nil)
)

type Application struct {
	m.BaseModel

	Name      string `db:"name" json:"name"`
	Slug      string `db:"slug" json:"slug"`
	Type      int    `db:"type" json:"type"`
	Status    string `db:"status" json:"status"`
	Public    bool   `db:"public" json:"public"`
	AllUsers  bool   `db:"allUsers" json:"allUsers"`
	CreatedBy string `db:"createBy" json:"createBy"`
	Groups    string `db:"groups" json:"groups"`
	Users     string `db:"users" json:"users"`
	AppDsl    string `db:"appDSL" json:"appDSL"`
	EditDsl   string `db:"EditDSL" json:"EditDSL"`
	FolderId  string `db:"folderId" json:"folderId"`
}

func (m *Application) TableName() string {
	return "_pbl_apps"
}
