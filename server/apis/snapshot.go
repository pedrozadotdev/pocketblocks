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

func BindSnapshotApi(dao *daos.Dao, g *echo.Group, logMiddleware echo.MiddlewareFunc) {
	api := snapshotApi{dao: dao}

	subGroup := g.Group("/snapshots")
	subGroup.GET("", api.list, apis.RequireAdminAuth())
	subGroup.GET("/:id", api.view, apis.RequireAdminAuth())
	subGroup.POST("", api.create, apis.RequireAdminAuth(), logMiddleware)

}

type snapshotApi struct {
	dao *daos.Dao
}

func (api *snapshotApi) view(c echo.Context) error {
	id := c.PathParam("id")
	if id == "" {
		return apis.NewNotFoundError("", nil)
	}

	snapshot, err := api.dao.FindPblSnapshotById(id)
	if err != nil || snapshot == nil {
		return apis.NewNotFoundError("", nil)
	}

	return c.JSON(http.StatusOK, snapshot)

}

func (api *snapshotApi) list(c echo.Context) error {
	fieldResolver := search.NewSimpleFieldResolver(
		"id", "appId", "dsl", "context", "created", "updated",
	)

	snapshots := []*models.Snapshot{}

	result, err := search.NewProvider(fieldResolver).
		Query(api.dao.PblSnapshotQuery()).
		ParseAndExec(c.QueryParams().Encode(), &snapshots)

	if err != nil {
		return apis.NewBadRequestError("", err)
	}

	return c.JSON(http.StatusOK, result)

}

func (api *snapshotApi) create(c echo.Context) error {
	form := forms.NewSnapshotUpsert(api.dao, &models.Snapshot{})

	// load request
	if err := c.Bind(form); err != nil {
		return apis.NewBadRequestError("Failed to load the submitted data due to invalid formatting.", err)
	}

	snapshot, err := form.Submit()
	if err != nil {
		return apis.NewBadRequestError("Failed to load the submitted data. Try again later.", err)
	}

	return c.JSON(http.StatusOK, snapshot)
}
