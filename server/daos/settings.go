package daos

import (
	"encoding/json"

	m "github.com/internoapp/pocketblocks/server/models"
)

// FindSettings returns and decode the serialized pbl settings param value.
//
// Returns an error if it fails to decode the stored serialized param value.
func (dao *Dao) FindPblSettings() (*m.Settings, error) {
	param, err := dao.FindParamByKey(m.ParamPblSettings)
	if err != nil {
		return nil, err
	}

	result := m.NewSettings()

	// try first without decryption
	if err := json.Unmarshal(param.Value, result); err != nil {
		return nil, err
	}

	return result, nil
}

// SaveSettings persists the specified pbl settings configuration.
func (dao *Dao) SavePblSettings(newSettings *m.Settings) error {
	return dao.SaveParam(m.ParamPblSettings, newSettings)
}
