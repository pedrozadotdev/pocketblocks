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

func BindFolderApi(dao *daos.Dao, g *echo.Group, logMiddleware echo.MiddlewareFunc) {
	api := folderApi{dao: dao}

	subGroup := g.Group("/folders")
	subGroup.GET("", api.list, apis.RequireAdminOrRecordAuth("users"))
	subGroup.POST("", api.create, apis.RequireAdminAuth(), logMiddleware)
	subGroup.PATCH("/:id", api.update, apis.RequireAdminAuth(), logMiddleware)
	subGroup.DELETE("/:id", api.delete, apis.RequireAdminAuth(), logMiddleware)

}

type folderApi struct {
	dao *daos.Dao
}

func (api *folderApi) list(c echo.Context) error {
	fieldResolver := search.NewSimpleFieldResolver(
		"id", "name", "created", "updated",
	)

	folders := []*models.Folder{}

	result, err := search.NewProvider(fieldResolver).
		Query(api.dao.PblFolderQuery()).
		ParseAndExec(c.QueryParams().Encode(), &folders)

	if err != nil {
		return apis.NewBadRequestError("", err)
	}

	return c.JSON(http.StatusOK, result)

}

func (api *folderApi) create(c echo.Context) error {
	form := forms.NewFolderUpsert(api.dao, &models.Folder{})

	// load request
	if err := c.Bind(form); err != nil {
		return apis.NewBadRequestError("Failed to load the submitted data due to invalid formatting.", err)
	}

	folder, err := form.Submit()
	if err != nil {
		return apis.NewBadRequestError("Failed to load the submitted data. Try again later.", err)
	}

	return c.JSON(http.StatusOK, folder)
}

func (api *folderApi) update(c echo.Context) error {
	id := c.PathParam("id")
	if id == "" {
		return apis.NewNotFoundError("", nil)
	}

	folder, err := api.dao.FindPblFolderById(id)
	if err != nil || folder == nil {
		return apis.NewNotFoundError("", err)
	}

	form := forms.NewFolderUpsert(api.dao, folder)

	// load request
	if err := c.Bind(form); err != nil {
		return apis.NewBadRequestError("Failed to load the submitted data due to invalid formatting.", err)
	}

	folderUpdated, err := form.Submit()
	if err != nil {
		return apis.NewBadRequestError("Failed to load the submitted data. Try again later.", err)
	}

	return c.JSON(http.StatusOK, folderUpdated)
}

func (api *folderApi) delete(c echo.Context) error {
	id := c.PathParam("id")
	if id == "" {
		return apis.NewNotFoundError("", nil)
	}

	folder, err := api.dao.FindPblFolderById(id)
	if err != nil || folder == nil {
		return apis.NewNotFoundError("", err)
	}

	if isEmpty, err := api.dao.PblFolderIsEmpty(id); err != nil && !isEmpty {
		return apis.NewBadRequestError("Folder is not empty.", err)
	}

	if err := api.dao.DeletePblFolder(folder); err != nil {
		return apis.NewBadRequestError("Failed to delete folder.", err)
	}

	return c.NoContent(http.StatusNoContent)
}
