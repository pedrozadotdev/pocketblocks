package daos

import (
	m "github.com/internoapp/pocketblocks/server/models"
	"github.com/pocketbase/dbx"
)

func (dao *Dao) PblAppQuery() *dbx.SelectQuery {
	return dao.ModelQuery(&m.Application{})
}

func (dao *Dao) FindPblAppBySlug(slug string) (*m.Application, error) {
	model := &m.Application{}

	err := dao.PblAppQuery().
		AndWhere(dbx.HashExp{"slug": slug}).
		Limit(1).
		One(model)

	if err != nil {
		return nil, err
	}

	return model, nil
}

func (dao *Dao) DeletePblApp(app *m.Application) error {
	return dao.Delete(app)
}

func (dao *Dao) SavePblApp(app *m.Application) error {
	return dao.Save(app)
}
