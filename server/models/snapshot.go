package models

import (
	m "github.com/pocketbase/pocketbase/models"
)

var (
	_ m.Model = (*Snapshot)(nil)
)

type Snapshot struct {
	m.BaseModel

	AppId   string `db:"app" json:"app"`
	Dsl     string `db:"dsl" json:"dsl"`
	Context string `db:"context" json:"context"`
}

func (m *Snapshot) TableName() string {
	return "_pbl_app_snapshots"
}
