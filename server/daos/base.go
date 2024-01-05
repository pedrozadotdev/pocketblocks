package daos

import (
	"github.com/pocketbase/dbx"
	pbDaos "github.com/pocketbase/pocketbase/daos"
)

// Dao is a wrapper over Pocketbase Dao
type Dao struct {
	pbDaos.Dao
}

// New creates a new Dao instance with the provided db builder
// (for both async and sync db operations).
func New(db dbx.Builder) *Dao {
	return &Dao{
		Dao: *pbDaos.New(db),
	}
}
