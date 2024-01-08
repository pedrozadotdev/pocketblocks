package daos

import (
	m "github.com/internoapp/pocketblocks/server/models"
	"github.com/pocketbase/dbx"
)

func (dao *Dao) PblFolderQuery() *dbx.SelectQuery {
	return dao.ModelQuery(&m.Folder{})
}

func (dao *Dao) FindPblFolderById(id string) (*m.Folder, error) {
	model := &m.Folder{}

	err := dao.PblFolderQuery().
		AndWhere(dbx.HashExp{"id": id}).
		Limit(1).
		One(model)

	if err != nil {
		return nil, err
	}

	return model, nil
}

func (dao *Dao) DeletePblFolder(folder *m.Folder) error {
	return dao.Delete(folder)
}

func (dao *Dao) SavePblFolder(folder *m.Folder) error {
	return dao.Save(folder)
}
