package daos

import (
	m "github.com/internoapp/pocketblocks/server/models"
	"github.com/pocketbase/dbx"
)

func (dao *Dao) PblGroupQuery() *dbx.SelectQuery {
	return dao.ModelQuery(&m.Group{})
}

func (dao *Dao) DeletePblGroup(group *m.Group) error {
	return dao.Delete(group)
}

func (dao *Dao) SavePblGroup(group *m.Group) error {
	return dao.Save(group)
}
