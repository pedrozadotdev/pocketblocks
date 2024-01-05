package daos

import (
	m "github.com/internoapp/pocketblocks/server/models"
	"github.com/pocketbase/dbx"
)

func (dao *Dao) PblFolderQuery() *dbx.SelectQuery {
	return dao.ModelQuery(&m.Folder{})
}

func (dao *Dao) DeletePblFolder(folder *m.Folder) error {
	return dao.Delete(folder)
}

func (dao *Dao) SavePblFolder(folder *m.Folder) error {
	return dao.Save(folder)
}
