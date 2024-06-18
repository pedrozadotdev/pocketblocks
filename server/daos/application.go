package daos

import (
	m "github.com/pedrozadotdev/pocketblocks/server/models"
	"github.com/pocketbase/dbx"
)

func (dao *Dao) PblAppQuery() *dbx.SelectQuery {
	return dao.ModelQuery(&m.Application{})
}

func (dao *Dao) FindPblAppBySlug(slug string, filterExpr dbx.Expression) (*m.Application, error) {
	model := &m.Application{}

	query := dao.PblAppQuery().AndWhere(dbx.HashExp{"slug": slug})

	if filterExpr != nil {
		query = query.AndWhere(filterExpr)
	}

	err := query.Limit(1).One(model)

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
