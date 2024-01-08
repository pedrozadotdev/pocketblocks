package apis

import (
	"net/http"
	"slices"

	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/internoapp/pocketblocks/server/forms"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/apis"
)

func BindSettingsApi(dao *daos.Dao, g *echo.Group, logMiddleware echo.MiddlewareFunc) {
	api := settingsApi{dao: dao}

	subGroup := g.Group("/settings")
	subGroup.GET("", api.view, apis.RequireAdminOrRecordAuth("users"))
	subGroup.PATCH("", api.update, apis.RequireAdminAuth(), logMiddleware)
	subGroup.PATCH("/remove-admin-Tutorial/:id", api.removeAdminTutorial, apis.RequireAdminAuth(), logMiddleware)

}

type settingsApi struct {
	dao *daos.Dao
}

func (api *settingsApi) view(c echo.Context) error {
	settings, err := api.dao.GetCurrentPblSettings().Clone()
	if err != nil {
		return apis.NewBadRequestError("", err)
	}

	info := apis.RequestInfo(c)
	if info.Admin == nil {
		settings.AdminTutorial = []string{}
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

	return c.JSON(http.StatusOK, api.dao.GetCurrentPblSettings())
}

func (api *settingsApi) removeAdminTutorial(c echo.Context) error {
	id := c.PathParam("id")
	if id == "" {
		return apis.NewNotFoundError("", nil)
	}
	settings, err := api.dao.GetCurrentPblSettings().Clone()
	if err != nil {
		return apis.NewApiError(500, "Something went wrong", err)
	}
	if !slices.Contains(settings.AdminTutorial, id) {
		return apis.NewNotFoundError("", nil)
	}

	if err := api.dao.RemoveAdminFromPblSettingsTutorial(id); err != nil {
		return apis.NewApiError(500, "Something went wrong", err)
	}

	return c.NoContent(http.StatusNoContent)
}
