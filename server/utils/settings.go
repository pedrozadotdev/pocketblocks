package utils

import (
	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/resolvers"
	"github.com/pocketbase/pocketbase/tools/search"
)

func GetUserAllowedUpdateFields(dao *daos.Dao, user *models.Record) ([]string, error) {
	userCollection, err := dao.FindCollectionByNameOrId("_pb_users_auth_")
	if err != nil {
		return []string{}, err
	}
	userFields := []string{"username", "email", "password", "avatar", "name"}
	if userCollection.UpdateRule == nil && *userCollection.UpdateRule == "" {
		return userFields, nil
	}
	result := []string{}
	for _, field := range userFields {
		requestInfo := &models.RequestInfo{
			AuthRecord: user,
			Data: user.ReplaceModifers(map[string]any{
				field: GenerateId(),
			}),
		}

		ruleFunc := func(q *dbx.SelectQuery) error {
			resolver := resolvers.NewRecordFieldResolver(&dao.Dao, userCollection, requestInfo, true)
			expr, err := search.FilterData(*userCollection.UpdateRule).BuildExpr(resolver)
			if err != nil {
				return err
			}
			resolver.UpdateQuery(q)
			q.AndWhere(expr)

			return nil
		}
		// fetch record
		record, fetchErr := dao.FindRecordById(userCollection.Id, user.Id, ruleFunc)
		if fetchErr == nil && record != nil {
			result = append(result, field)
		}
	}

	return result, nil
}
