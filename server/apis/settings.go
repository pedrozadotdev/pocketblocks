package apis

import (
	"net/http"
	"slices"

	"github.com/pedrozadotdev/pocketblocks/server/daos"
	"github.com/pedrozadotdev/pocketblocks/server/forms"
	"github.com/pedrozadotdev/pocketblocks/server/utils"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/apis"
)

func BindSettingsApi(dao *daos.Dao, g *echo.Group, logMiddleware echo.MiddlewareFunc) {
	api := settingsApi{dao: dao}

	subGroup := g.Group("/settings")
	subGroup.GET("", api.view)
	subGroup.GET("/users-info", api.usersInfo)
	subGroup.PATCH("", api.update, apis.RequireAdminAuth(), logMiddleware)
	subGroup.DELETE("/delete-admin-tutorial/:id", api.deleteAdminTutorial, apis.RequireAdminAuth(), logMiddleware)

}

type settingsApi struct {
	dao *daos.Dao
}

func (api *settingsApi) view(c echo.Context) error {
	settings, err := api.dao.GetPblSettings().Clone()
	if err != nil {
		return apis.NewBadRequestError("", err)
	}

	info := apis.RequestInfo(c)
	if info.Admin == nil {
		settings.ShowTutorial = []string{}
	}

	return c.JSON(http.StatusOK, settings)

}

func (api *settingsApi) update(c echo.Context) error {
	form := forms.NewSettingsUpsert(api.dao)

	// load request
	if err := c.Bind(form); err != nil {
		return apis.NewBadRequestError("An error occurred while loading the submitted data.", err)
	}

	if err := form.Submit(); err != nil {
		return apis.NewBadRequestError("Failed to load the submitted data. Try again later.", err)
	}

	result, err := api.dao.GetPblSettings().Clone()
	if err != nil {
		return apis.NewApiError(500, "Something went wrong", err)
	}

	return c.JSON(http.StatusOK, result)
}

func (api *settingsApi) deleteAdminTutorial(c echo.Context) error {
	id := c.PathParam("id")
	if id == "" {
		return apis.NewNotFoundError("", nil)
	}
	settings, err := api.dao.GetPblSettings().Clone()
	if err != nil {
		return apis.NewApiError(500, "Something went wrong", err)
	}
	if !slices.Contains(settings.ShowTutorial, id) {
		return apis.NewNotFoundError("", nil)
	}

	if err := api.dao.DeleteAdminFromPblSettingsTutorial(id); err != nil {
		return apis.NewApiError(500, "Something went wrong", err)
	}

	return c.NoContent(http.StatusNoContent)
}

func (api *settingsApi) usersInfo(c echo.Context) error {
	store := api.dao.GetPblStore()
	userFieldUpdate := store.Get(utils.UserFieldUpdateKey).([]string)
	authMethods := store.Get(utils.UserAuthsKey).([]string)
	canUserSignUp := store.Get(utils.CanUserSignUpKey).(bool)
	setupFirstAdmin := store.Get(utils.SetupFirstAdminKey).(bool)
	smtpStatus := store.Get(utils.SmtpStatusKey).(bool)
	localAuthInfo := store.Get(utils.LocalAuthGeneralInfoKey).(utils.LocalAuthGeneralInfo)

	result := struct {
		UserFieldUpdate      []string                   `json:"userFieldUpdate"`
		AuthMethods          []string                   `json:"authMethods"`
		CanUserSignUp        bool                       `json:"canUserSignUp"`
		SetupFirstAdmin      bool                       `json:"setupFirstAdmin"`
		SmtpStatus           bool                       `json:"smtpStatus"`
		LocalAuthGeneralInfo utils.LocalAuthGeneralInfo `json:"localAuthInfo"`
	}{
		userFieldUpdate,
		authMethods,
		canUserSignUp,
		setupFirstAdmin,
		smtpStatus,
		localAuthInfo,
	}

	return c.JSON(http.StatusOK, result)

}
