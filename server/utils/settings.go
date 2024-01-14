package utils

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/resolvers"
	"github.com/pocketbase/pocketbase/tools/search"
)

const UserFieldUpdateKey = "USER_FIELD_UPDATE_KEY"
const UserAuthsKey = "USER_AUTHS_KEY"
const CanUserSignUpKey = "USER_SIGNUP_KEY"
const SetupFirstAdminKey = "SETUP_FIRST_ADMIN_KEY"
const SmtpStatusKey = "SMTP_STATUS_KEY"
const LocalAuthGeneralInfoKey = "LOCAL_AUTH_GENERAL_INFO_KEY"

type LocalAuthGeneralInfo struct {
	MinPasswordLength int  `json:"minPasswordLength"`
	RequireEmail      bool `json:"requireEmail"`
}

// GetUserAllowedUpdateFields return a list with the user field that can be updated
//
// Ex: GetUserAllowedUpdateFields(app)
func GetUserAllowedUpdateFields(app *pocketbase.PocketBase) ([]string, error) {
	result := []string{}
	transError := app.Dao().RunInTransaction(func(txDao *daos.Dao) error {
		tx, ok := txDao.DB().(*dbx.Tx)
		if !ok {
			return errors.New("failed to get transaction db")
		}
		defer tx.Rollback()

		userCollection, err := txDao.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		userFields := []string{"username", "email", "password", "avatar", "name"}
		if userCollection.UpdateRule == nil {
			return nil
		}
		if *userCollection.UpdateRule == "" {
			result = userFields
			return nil
		}

		//Create user to test update rule
		user := models.NewRecord(userCollection)
		if err = txDao.Save(user); err != nil {
			return err
		}

		txResult := []string{}
		for _, field := range userFields {
			requestInfo := &models.RequestInfo{
				AuthRecord: user,
				Data: user.ReplaceModifers(map[string]any{
					field: GenerateId(),
				}),
			}

			ruleFunc := func(q *dbx.SelectQuery) error {
				resolver := resolvers.NewRecordFieldResolver(txDao, userCollection, requestInfo, true)
				expr, err := search.FilterData(*userCollection.UpdateRule).BuildExpr(resolver)
				if err != nil {
					return err
				}
				resolver.UpdateQuery(q)
				q.AndWhere(expr)

				return nil
			}
			// fetch record
			record, fetchErr := txDao.FindRecordById(userCollection.Id, user.Id, ruleFunc)
			if fetchErr == nil && record != nil {
				txResult = append(txResult, field)
			}
		}
		result = txResult
		return nil
	})
	if transError == nil {
		return result, nil
	}
	return nil, transError
}

func GetUserAuthMethods(app *pocketbase.PocketBase) ([]string, error) {
	userCollection, err := app.Dao().FindCollectionByNameOrId("_pb_users_auth_")
	if err != nil {
		return nil, err
	}
	authOptions := userCollection.AuthOptions()

	result := []string{}

	if authOptions.AllowEmailAuth {
		result = append(result, "email")
	}
	if authOptions.AllowUsernameAuth {
		result = append(result, "username")
	}
	if authOptions.AllowOAuth2Auth {
		nameConfigMap := app.Settings().NamedAuthProviderConfigs()
		for name, config := range nameConfigMap {
			if config.Enabled {
				result = append(result, name)
			}
		}
	}

	return result, nil
}

func GetCanUserSignUp(app *pocketbase.PocketBase) (bool, error) {
	userCollection, err := app.Dao().FindCollectionByNameOrId("_pb_users_auth_")
	if err != nil {
		return false, err
	}
	if userCollection.CreateRule == nil {
		return false, nil
	}
	if *userCollection.CreateRule == "" {
		return true, nil
	}

	body := map[string]any{
		"name":            "testusercreaterule",
		"password":        "abcde12345",
		"passwordConfirm": "abcde12345",
		"username":        "testusercreaterule",
	}
	requestInfo := &models.RequestInfo{
		Data: body,
	}
	bodyBuffer := new(bytes.Buffer)
	json.NewEncoder(bodyBuffer).Encode(body)
	request, err := http.NewRequest("POST", "", bodyBuffer)
	if err != nil {
		return false, err
	}
	request.Header = map[string][]string{
		"Content-Type": {"application/json"},
	}

	testRecord := models.NewRecord(userCollection)
	testForm := forms.NewRecordUpsert(app, testRecord)
	testForm.SetFullManageAccess(true)
	if err := testForm.LoadRequest(request, ""); err != nil {
		return false, err
	}

	createRuleFunc := func(q *dbx.SelectQuery) error {
		if *userCollection.CreateRule == "" {
			return nil // no create rule to resolve
		}

		resolver := resolvers.NewRecordFieldResolver(app.Dao(), userCollection, requestInfo, true)
		expr, err := search.FilterData(*userCollection.CreateRule).BuildExpr(resolver)
		if err != nil {
			return err
		}
		resolver.UpdateQuery(q)
		q.AndWhere(expr)
		return nil
	}

	testErr := testForm.DrySubmit(func(txDao *daos.Dao) error {
		foundRecord, err := txDao.FindRecordById(userCollection.Id, testRecord.Id, createRuleFunc)
		if err != nil {
			return fmt.Errorf("DrySubmit create rule failure: %w", err)
		}
		if foundRecord == nil {
			return fmt.Errorf("could not create temporary user")
		}
		return nil
	})

	if testErr != nil {
		return false, nil
	}

	return true, nil
}

func GetLocalAuthGeneralInfo(app *pocketbase.PocketBase) (LocalAuthGeneralInfo, error) {
	userCollection, err := app.Dao().FindCollectionByNameOrId("_pb_users_auth_")
	if err != nil {
		return LocalAuthGeneralInfo{}, err
	}
	return LocalAuthGeneralInfo{
		MinPasswordLength: userCollection.AuthOptions().MinPasswordLength,
		RequireEmail:      userCollection.AuthOptions().RequireEmail,
	}, nil
}
