package daos

import (
	m "github.com/internoapp/pocketblocks/server/models"
	"github.com/pocketbase/dbx"
)

func (dao *Dao) PblSnapshotQuery() *dbx.SelectQuery {
	return dao.ModelQuery(&m.Snapshot{})
}

func (dao *Dao) DeletePblSnapshot(snapshot *m.Snapshot) error {
	return dao.Delete(snapshot)
}

func (dao *Dao) SavePblSnapshot(snapshot *m.Snapshot) error {
	return dao.Save(snapshot)
}
