package daos

import (
	"database/sql"
	"encoding/json"
	"errors"
	"slices"

	m "github.com/internoapp/pocketblocks/server/models"
)

var pblSettings *m.Settings

// GetCurrentPblSettings return the PblSetting Singleton
func (dao *Dao) GetCurrentPblSettings() *m.Settings {
	return pblSettings
}

// RefreshSettings update the current pblSettings
func (dao *Dao) RefreshPblSettings() error {
	if pblSettings == nil {
		pblSettings = m.NewSettings()
	}

	storedSettings, err := dao.FindPblSettings()
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return err
	}

	// no settings were previously stored
	if storedSettings == nil {
		if err := dao.SavePblSettings(pblSettings); err != nil {
			return err
		}
	}

	pblSettings.Merge(storedSettings)

	return nil
}

// FindPblSettings returns and decode the serialized pbl settings param value.
//
// Returns an error if it fails to decode the stored serialized param value.
func (dao *Dao) FindPblSettings() (*m.Settings, error) {
	param, err := dao.FindParamByKey(m.ParamPblSettings)
	if err != nil {
		return nil, err
	}

	result := m.NewSettings()

	if err := json.Unmarshal(param.Value, result); err != nil {
		return nil, err
	}

	return result, nil
}

// SaveSettings persists the specified PblSettings configuration.
func (dao *Dao) SavePblSettings(newSettings *m.Settings) error {
	if err := dao.SaveParam(m.ParamPblSettings, newSettings); err != nil {
		return err
	}
	return dao.RefreshPblSettings()
}

func (dao *Dao) RemoveAdminFromPblSettingsTutorial(id string) error {
	settings := dao.GetCurrentPblSettings()
	clone, err := settings.Clone()
	if err != nil {
		return err
	}

	if slices.Contains(clone.ShowTutorial, id) {
		newShowTutorial := []string{}

		for _, currentId := range clone.ShowTutorial {
			if currentId != id {
				newShowTutorial = append(newShowTutorial, id)
			}
		}

		clone.ShowTutorial = newShowTutorial
		if err := settings.Merge(clone); err != nil {
			return err
		}

		return dao.SavePblSettings(settings)
	}
	return nil
}
