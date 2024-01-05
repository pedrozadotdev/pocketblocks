package models

import (
	m "github.com/pocketbase/pocketbase/models"
)

var (
	_ m.Model = (*Folder)(nil)
)

type Folder struct {
	m.BaseModel

	Name      string `db:"name" json:"name"`
	CreatedBy string `db:"createBy" json:"createBy"`
}

func (m *Folder) TableName() string {
	return "_pbl_folders"
}
