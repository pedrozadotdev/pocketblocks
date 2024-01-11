package forms

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/internoapp/pocketblocks/server/forms/validators"
	"github.com/internoapp/pocketblocks/server/models"
	"github.com/internoapp/pocketblocks/server/utils"
	v "github.com/pocketbase/pocketbase/forms/validators"
)

// SnapshotUpsert is a [models.Snapshot] upsert (create/update) form.
type SnapshotUpsert struct {
	dao      *daos.Dao
	snapshot *models.Snapshot

	Id      string `form:"id" json:"id"`
	AppId   string `form:"app" json:"app"`
	Dsl     string `form:"dsl" json:"dsl"`
	Context string `form:"context" json:"context"`
}

// NewSnapshotUpsert creates a new [SnapshotUpsert] form with initializer
// config created from the provided [models.Snapshot] instances
// (for create you could pass a pointer to an empty Snapshot - `&models.Snapshot{}`).
//
// If you want to submit the form as part of a transaction,
// you can change the default Dao via [SetDao()].
func NewSnapshotUpsert(dao *daos.Dao, snapshot *models.Snapshot) *SnapshotUpsert {
	form := &SnapshotUpsert{
		dao:      dao,
		snapshot: snapshot,
	}

	// load defaults
	form.Id = snapshot.Id
	form.AppId = snapshot.AppId
	form.Dsl = snapshot.Dsl
	form.Context = snapshot.Context

	return form
}

// SetDao replaces the default form Dao instance with the provided one.
func (form *SnapshotUpsert) SetDao(dao *daos.Dao) {
	form.dao = dao
}

// Validate makes the form validatable by implementing [validation.Validatable] interface.
func (form *SnapshotUpsert) Validate() error {
	return validation.ValidateStruct(form,
		validation.Field(
			&form.Id,
			validation.When(
				form.snapshot.IsNew(),
				validation.Length(utils.DefaultIdLength, utils.DefaultIdLength),
				validation.Match(utils.IdRegex),
				validation.By(v.UniqueId(&form.dao.Dao, form.snapshot.TableName())),
			).Else(validation.In(form.snapshot.Id)),
		),
		validation.Field(
			&form.AppId,
			validation.When(
				form.snapshot.IsNew(),
				validation.Length(utils.DefaultIdLength, utils.DefaultIdLength),
				validation.Match(utils.IdRegex),
				validation.By(validators.ValidField(&form.dao.Dao, "_pbl_apps", "id")),
			).Else(validation.In(form.snapshot.AppId)),
		),
		validation.Field(
			&form.Dsl,
			validation.Required,
			is.JSON,
		),
		validation.Field(
			&form.Context,
			validation.Required,
			is.JSON,
		),
	)
}

// Submit validates the form and upserts the form snapshot model.
func (form *SnapshotUpsert) Submit() (*models.Snapshot, error) {
	if err := form.Validate(); err != nil {
		return nil, err
	}

	// custom insertion id can be set only on create
	if form.snapshot.IsNew() && form.Id != "" {
		form.snapshot.MarkAsNew()
		form.snapshot.SetId(form.Id)
	}

	form.snapshot.Id = form.Id
	form.snapshot.AppId = form.AppId
	form.snapshot.Dsl = form.Dsl
	form.snapshot.Context = form.Context

	if err := form.dao.SavePblSnapshot(form.snapshot); err != nil {
		return nil, err
	}

	return form.snapshot, nil
}
