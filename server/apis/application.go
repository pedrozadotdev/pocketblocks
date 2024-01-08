package apis

import (
	"net/http"

	"github.com/internoapp/pocketblocks/server/daos"
	"github.com/internoapp/pocketblocks/server/forms"
	"github.com/internoapp/pocketblocks/server/models"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/tools/search"
)

func BindApplicationApi(dao *daos.Dao, g *echo.Group, logMiddleware echo.MiddlewareFunc) {
	api := applicationApi{dao: dao}

	subGroup := g.Group("/applications")
	subGroup.GET("", api.list, apis.RequireAdminOrRecordAuth("users"))
	subGroup.POST("", api.create, apis.RequireAdminAuth(), logMiddleware)
	subGroup.GET("/:slug", api.view, apis.RequireAdminOrRecordAuth("users"))
	subGroup.PATCH("/:slug", api.update, apis.RequireAdminAuth(), logMiddleware)
	subGroup.DELETE("/:slug", api.delete, apis.RequireAdminAuth(), logMiddleware)

}

type applicationApi struct {
	dao *daos.Dao
}

func (api *applicationApi) list(c echo.Context) error {
	fieldResolver := search.NewSimpleFieldResolver(
		"id", "name", "slug", "type", "status", "allUsers", "groups", "users", "appDSL", "editDSL", "folder", "created", "updated",
	)

	applications := []*models.Application{}

	result, err := search.NewProvider(fieldResolver).
		Query(api.dao.PblAppQuery()).
		ParseAndExec(c.QueryParams().Encode(), &applications)

	if err != nil {
		return apis.NewBadRequestError("", err)
	}

	return c.JSON(http.StatusOK, result)

}

func (api *applicationApi) view(c echo.Context) error {
	slug := c.PathParam("slug")
	if slug == "" {
		return apis.NewNotFoundError("", nil)
	}

	app, err := api.dao.FindPblAppBySlug(slug)
	if err != nil || app == nil {
		return apis.NewNotFoundError("", nil)
	}

	return c.JSON(http.StatusOK, app)

}
func (api *applicationApi) create(c echo.Context) error {
	form := forms.NewApplicationUpsert(api.dao, &models.Application{})

	// load request
	if err := c.Bind(form); err != nil {
		return apis.NewBadRequestError("Failed to load the submitted data due to invalid formatting.", err)
	}

	application, err := form.Submit()
	if err != nil {
		return apis.NewBadRequestError("Failed to load the submitted data. Try again later.", err)
	}

	return c.JSON(http.StatusOK, application)
}

func (api *applicationApi) update(c echo.Context) error {
	slug := c.PathParam("slug")
	if slug == "" {
		return apis.NewNotFoundError("", nil)
	}

	application, err := api.dao.FindPblAppBySlug(slug)
	if err != nil || application == nil {
		return apis.NewNotFoundError("", err)
	}

	form := forms.NewApplicationUpsert(api.dao, application)

	// load request
	if err := c.Bind(form); err != nil {
		return apis.NewBadRequestError("Failed to load the submitted data due to invalid formatting.", err)
	}

	applicationUpdated, err := form.Submit()
	if err != nil {
		return apis.NewBadRequestError("Failed to load the submitted data. Try again later.", err)
	}

	return c.JSON(http.StatusOK, applicationUpdated)
}

func (api *applicationApi) delete(c echo.Context) error {
	slug := c.PathParam("slug")
	if slug == "" {
		return apis.NewNotFoundError("", nil)
	}

	application, err := api.dao.FindPblAppBySlug(slug)
	if err != nil || application == nil {
		return apis.NewNotFoundError("", err)
	}

	if err := api.dao.DeletePblApp(application); err != nil {
		return apis.NewBadRequestError("Failed to delete application.", err)
	}

	return c.NoContent(http.StatusNoContent)
}
