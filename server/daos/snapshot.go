package daos

import (
	m "github.com/pedrozadotdev/pocketblocks/server/models"
	"github.com/pocketbase/dbx"
)

func (dao *Dao) PblSnapshotQuery() *dbx.SelectQuery {
	return dao.ModelQuery(&m.Snapshot{})
}

func (dao *Dao) FindPblSnapshotById(id string) (*m.Snapshot, error) {
	model := &m.Snapshot{}

	err := dao.PblSnapshotQuery().
		AndWhere(dbx.HashExp{"id": id}).
		Limit(1).
		One(model)

	if err != nil {
		return nil, err
	}

	return model, nil
}

func (dao *Dao) DeletePblSnapshot(snapshot *m.Snapshot) error {
	return dao.Delete(snapshot)
}

func (dao *Dao) SavePblSnapshot(snapshot *m.Snapshot) error {
	return dao.Save(snapshot)
}
