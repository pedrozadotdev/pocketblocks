package validators

import (
	"database/sql"
	"errors"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/tools/list"
)

// Compare checks whether the provided model field exists.
//
// Example:
//
//	validation.Field(&form.Field, validation.By(validators.ValidField(form.dao, tableName, fieldName)))
func ValidField(dao *daos.Dao, tableName string, fieldName string) validation.RuleFunc {
	return func(value any) error {
		v, _ := value.(string)
		if v == "" {
			return nil // nothing to check
		}

		var foundField string

		err := dao.DB().
			Select(fieldName).
			From(tableName).
			Where(dbx.HashExp{fieldName: v}).
			Limit(1).
			Row(&foundField)

		if (err != nil && errors.Is(err, sql.ErrNoRows)) || foundField == "" {
			return validation.NewError("validation_invalid_field", "The model field is invalid or not exists.")
		}

		return nil
	}
}

// Compare checks whether the provided model field slice exist.
//
// Example:
//
//	validation.Field(&form.Field, validation.By(validators.ValidMultiRelation(form.dao, tableName)))
func ValidMultiRelation(dao *daos.Dao, tableName string) validation.RuleFunc {
	return func(value any) error {
		var ids []string
		switch val := value.(type) {
		case []string:
			ids = val
		default:
			return nil // nothing to check
		}

		if len(ids) == 0 {
			return nil // nothing to check
		}

		var total int
		err := dao.DB().
			Select("count(*)").
			From(tableName).
			AndWhere(dbx.In("id", list.ToInterfaceSlice(ids)...)).
			Row(&total)

		if err != nil && total != len(ids) {
			return validation.NewError("validation_invalid_relation_id", "Failed to find all relation records with the provided ids")
		}

		return nil
	}
}

// Compare checks whether the provided slug exists.
//
// Example:
//
//	validation.Field(&form.Slug, validation.By(validators.UniqueSlug(form.dao, tableName, currentId)))
func UniqueSlug(dao *daos.Dao, tableName string, currentId string) validation.RuleFunc {
	return func(value any) error {
		v, _ := value.(string)
		if v == "" {
			return nil // nothing to check
		}

		var foundSlug string

		query := dao.DB().
			Select("slug").
			From(tableName).
			Where(dbx.HashExp{"slug": v})

		if currentId != "" {
			query = query.AndWhere(dbx.Not(dbx.HashExp{"id": currentId}))
		}

		err := query.Limit(1).Row(&foundSlug)

		if (err != nil && !errors.Is(err, sql.ErrNoRows)) || foundSlug != "" {
			return validation.NewError("validation_invalid_slug", "The model slug is invalid or already exists.")
		}

		return nil
	}
}
