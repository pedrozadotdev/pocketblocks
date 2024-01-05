package models

import (
	m "github.com/pocketbase/pocketbase/models"
)

var (
	_ m.Model = (*Snapshot)(nil)
)

type Snapshot struct {
	m.BaseModel

	AppId     string `db:"appId" json:"appId"`
	Dsl       string `db:"dsl" json:"dsl"`
	Context   string `db:"context" json:"context"`
	CreatedBy string `db:"createBy" json:"createBy"`
}

func (m *Snapshot) TableName() string {
	return "_pbl_app_snapshots"
}
