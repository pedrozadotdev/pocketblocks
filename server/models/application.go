package models

import (
	"github.com/guregu/null"
	m "github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/list"
)

var (
	_ m.Model = (*Application)(nil)
)

type Application struct {
	m.BaseModel

	Name      string      `db:"name" json:"name"`
	Slug      string      `db:"slug" json:"slug"`
	Type      int         `db:"type" json:"type"`
	Status    string      `db:"status" json:"status"`
	Public    bool        `db:"public" json:"public"`
	AllUsers  bool        `db:"allUsers" json:"allUsers"`
	RawGroups string      `db:"groups" json:"-"`
	RawUsers  string      `db:"users" json:"-"`
	Groups    []string    `db:"-" json:"groups"`
	Users     []string    `db:"-" json:"users"`
	AppDsl    string      `db:"appDSL" json:"appDSL"`
	EditDsl   string      `db:"editDSL" json:"editDSL"`
	FolderId  null.String `db:"folder" json:"folder"`
}

func (m *Application) TableName() string {
	return "_pbl_apps"
}

func (m *Application) PostScan() error {
	if err := m.BaseModel.PostScan(); err != nil {
		return err
	}

	m.Groups = list.ToUniqueStringSlice(m.RawGroups)
	m.Users = list.ToUniqueStringSlice(m.RawUsers)
	return nil
}
