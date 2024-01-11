package forms

import (
	"strings"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
	"github.com/gosimple/slug"
	"github.com/guregu/null"
	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/internoapp/pocketblocks/server/forms/validators"
	"github.com/internoapp/pocketblocks/server/models"
	"github.com/internoapp/pocketblocks/server/utils"
	v "github.com/pocketbase/pocketbase/forms/validators"
)

// ApplicationUpsert is a [models.Application] upsert (create/update) form.
type ApplicationUpsert struct {
	dao         *daos.Dao
	application *models.Application

	Id       string   `form:"id" json:"id"`
	Name     string   `form:"name" json:"name"`
	Slug     string   `form:"slug" json:"slug"`
	Type     int      `form:"type" json:"type"`
	Status   string   `form:"status" json:"status"`
	Public   bool     `form:"public" json:"public"`
	AllUsers bool     `form:"allUsers" json:"allUsers"`
	Groups   []string `form:"groups" json:"groups"`
	Users    []string `form:"users" json:"users"`
	AppDsl   string   `form:"appDSL" json:"appDSL"`
	EditDsl  string   `form:"editDSL" json:"editDSL"`
	FolderId string   `form:"folder" json:"folder"`
}

// NewApplicationUpsert creates a new [ApplicationUpsert] form with initializer
// config created from the provided [models.Application] instances
// (for create you could pass a pointer to an empty Application - `&models.Application{}`).
//
// If you want to submit the form as part of a transaction,
// you can change the default Dao via [SetDao()].
func NewApplicationUpsert(dao *daos.Dao, application *models.Application) *ApplicationUpsert {
	form := &ApplicationUpsert{
		dao:         dao,
		application: application,
	}

	// load defaults
	form.Id = application.Id
	form.Name = application.Name
	form.Slug = application.Slug
	form.Type = application.Type
	form.Status = application.Status
	form.Public = application.Public
	form.AllUsers = application.AllUsers
	form.Groups = application.Groups
	form.Users = application.Users
	form.AppDsl = application.AppDsl
	form.EditDsl = application.EditDsl
	form.FolderId = application.FolderId.String

	return form
}

// SetDao replaces the default form Dao instance with the provided one.
func (form *ApplicationUpsert) SetDao(dao *daos.Dao) {
	form.dao = dao
}

// Validate makes the form validatable by implementing [validation.Validatable] interface.
func (form *ApplicationUpsert) Validate() error {
	return validation.ValidateStruct(form,
		validation.Field(
			&form.Id,
			validation.When(
				form.application.IsNew(),
				validation.Length(utils.DefaultIdLength, utils.DefaultIdLength),
				validation.Match(utils.IdRegex),
				validation.By(v.UniqueId(&form.dao.Dao, form.application.TableName())),
			).Else(validation.In(form.application.Id)),
		),
		validation.Field(&form.Name, validation.Required),
		validation.Field(&form.Slug,
			validation.Match(utils.SlugRegex),
			validation.By(validators.UniqueSlug(&form.dao.Dao, "_pbl_apps", form.Id)),
		),
		validation.Field(&form.Type, validation.Min(1), validation.Max(6)),
		validation.Field(&form.Status, validation.In("NORMAL", "RECYCLED")),
		validation.Field(&form.Groups, validation.Each(
			validation.Length(utils.DefaultIdLength, utils.DefaultIdLength),
			validation.Match(utils.IdRegex),
		),
			validation.By(validators.ValidMultiRelation(&form.dao.Dao, "groups")),
		),
		validation.Field(&form.Users, validation.Each(
			validation.Length(utils.DefaultIdLength, utils.DefaultIdLength),
			validation.Match(utils.IdRegex),
		),
			validation.By(validators.ValidMultiRelation(&form.dao.Dao, "users")),
		),
		validation.Field(&form.AppDsl, validation.Required, is.JSON),
		validation.Field(&form.EditDsl, is.JSON),
		validation.Field(&form.FolderId,
			validation.Length(utils.DefaultIdLength, utils.DefaultIdLength),
			validation.Match(utils.IdRegex),
			validation.By(validators.ValidField(&form.dao.Dao, "_pbl_folders", "id")),
		),
	)
}

// Submit validates the form and upserts the form application model.
func (form *ApplicationUpsert) Submit() (*models.Application, error) {
	if err := form.Validate(); err != nil {
		return nil, err
	}

	// custom insertion id can be set only on create
	if form.application.IsNew() && form.Id != "" {
		form.application.MarkAsNew()
		form.application.SetId(form.Id)
	}

	form.application.Id = form.Id
	form.application.Name = form.Name
	form.application.Type = form.Type
	form.application.Status = form.Status
	form.application.Public = form.Public
	form.application.AllUsers = form.AllUsers
	form.application.RawGroups = "[" + strings.Join(form.Groups, ",") + "]"
	form.application.RawUsers = "[" + strings.Join(form.Users, ",") + "]"
	form.application.AppDsl = form.AppDsl
	form.application.EditDsl = form.EditDsl

	if form.FolderId == "" {
		form.application.FolderId = null.NewString("", false)
	} else {
		form.application.FolderId = null.NewString(form.FolderId, true)
	}

	if form.Slug != "" {
		form.application.Slug = form.Slug
	} else {
		form.application.Slug = slug.Make(form.Name)
	}

	if err := form.dao.SavePblApp(form.application); err != nil {
		return nil, err
	}

	return form.application, nil
}
