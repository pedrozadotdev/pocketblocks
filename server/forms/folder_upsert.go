package forms

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/internoapp/pocketblocks/server/models"
	"github.com/internoapp/pocketblocks/server/utils"
	v "github.com/pocketbase/pocketbase/forms/validators"
)

// FolderUpsert is a [models.Folder] upsert (create/update) form.
type FolderUpsert struct {
	dao    *daos.Dao
	folder *models.Folder

	Id   string `form:"id" json:"id"`
	Name string `form:"name" json:"name"`
}

// NewFolderUpsert creates a new [FolderUpsert] form with initializer
// config created from the provided [models.Folder] instances
// (for create you could pass a pointer to an empty Folder - `&models.Folder{}`).
//
// If you want to submit the form as part of a transaction,
// you can change the default Dao via [SetDao()].
func NewFolderUpsert(dao *daos.Dao, folder *models.Folder) *FolderUpsert {
	form := &FolderUpsert{
		dao:    dao,
		folder: folder,
	}

	// load defaults
	form.Id = folder.Id
	form.Name = folder.Name

	return form
}

// SetDao replaces the default form Dao instance with the provided one.
func (form *FolderUpsert) SetDao(dao *daos.Dao) {
	form.dao = dao
}

// Validate makes the form validatable by implementing [validation.Validatable] interface.
func (form *FolderUpsert) Validate() error {
	return validation.ValidateStruct(form,
		validation.Field(
			&form.Id,
			validation.When(
				form.folder.IsNew(),
				validation.Length(utils.DefaultIdLength, utils.DefaultIdLength),
				validation.Match(utils.IdRegex),
				validation.By(v.UniqueId(&form.dao.Dao, form.folder.TableName())),
			).Else(validation.In(form.folder.Id)),
		),
		validation.Field(
			&form.Name,
			validation.Required,
		),
	)
}

// Submit validates the form and upserts the form folder model.
func (form *FolderUpsert) Submit() (*models.Folder, error) {
	if err := form.Validate(); err != nil {
		return nil, err
	}

	// custom insertion id can be set only on create
	if form.folder.IsNew() && form.Id != "" {
		form.folder.MarkAsNew()
		form.folder.SetId(form.Id)
	}

	form.folder.Id = form.Id
	form.folder.Name = form.Name

	if err := form.dao.SavePblFolder(form.folder); err != nil {
		return nil, err
	}

	return form.folder, nil
}
