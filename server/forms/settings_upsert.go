package forms

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/internoapp/pocketblocks/server/forms/validators"
	"github.com/internoapp/pocketblocks/server/models"
	"github.com/internoapp/pocketblocks/server/utils"
)

// SettingsUpsert is a [models.Settings] upsert (create/update) form.
type SettingsUpsert struct {
	dao *daos.Dao
	*models.Settings
}

// NewSettingsUpsert creates a new [SettingsUpsert] form with initializer
// config created from the provided [models.Settings] instances
// (for create you could pass a pointer to an empty Settings - `&models.Settings{}`).
//
// If you want to submit the form as part of a transaction,
// you can change the default Dao via [SetDao()].
func NewSettingsUpsert(dao *daos.Dao) *SettingsUpsert {
	form := &SettingsUpsert{
		dao: dao,
	}

	// load the application settings into the form
	form.Settings, _ = dao.GetCurrentPblSettings().Clone()

	return form
}

// SetDao replaces the default form Dao instance with the provided one.
func (form *SettingsUpsert) SetDao(dao *daos.Dao) {
	form.dao = dao
}

// Validate makes the form validatable by implementing [validation.Validatable] interface.
func (form *SettingsUpsert) Validate() error {
	return form.Settings.Validate(
		validation.Length(utils.DefaultIdLength, utils.DefaultIdLength),
		validation.Match(utils.IdRegex),
		validation.By(validators.ValidField(&form.dao.Dao, "_pbl_apps", "slug")),
	)
}

// Submit validates the form and upserts the form settings model.
func (form *SettingsUpsert) Submit() error {
	if err := form.Validate(); err != nil {
		return err
	}

	if err := form.dao.SavePblSettings(form.Settings); err != nil {
		return err
	}

	return nil
}
