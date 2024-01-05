package models

import (
	m "github.com/pocketbase/pocketbase/models"
)

var (
	_ m.Model = (*Group)(nil)
)

type Group struct {
	m.BaseModel

	Name  string `db:"name" json:"name"`
	Users string `db:"users" json:"users"`
}

func (m *Group) TableName() string {
	return "_pbl_groups"
}
