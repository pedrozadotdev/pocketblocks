package apis

import (
	"net/http"

	"github.com/pedrozadotdev/pocketblocks/server/daos"
	"github.com/pedrozadotdev/pocketblocks/server/forms"
	"github.com/pedrozadotdev/pocketblocks/server/models"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/tools/search"
	pbModels "github.com/pocketbase/pocketbase/models"
)

func BindApplicationApi(dao *daos.Dao, g *echo.Group, logMiddleware echo.MiddlewareFunc) {
	api := applicationApi{dao: dao}

	subGroup := g.Group("/applications")
	subGroup.GET("", api.list, apis.RequireAdminOrRecordAuth("users"))
	subGroup.POST("", api.create, apis.RequireAdminAuth(), logMiddleware)
	subGroup.GET("/:slug", api.view)
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

	query := api.dao.PblAppQuery()

	info := apis.RequestInfo(c)

	if info.Admin == nil {
		groups, err := api.dao.FindRecordsByFilter(
			"groups",
			"users.id ?= \""+info.AuthRecord.Id+"\"",
			"-created",
			500,
			0,
		)
		if err != nil {
			return apis.NewApiError(500, "Something went wrong", err)
		}

		groupIds := []string{}

		for _, g := range groups {
			groupIds = append(groupIds, g.Id)
		}

		var filterExpr dbx.Expression = dbx.Or(
			dbx.HashExp{"public": true},
			dbx.HashExp{"allUsers": true},
		)

		if len(groupIds) > 0 {
			filterExpr = dbx.Or(
				filterExpr,
				dbx.Like("users", info.AuthRecord.Id),
				dbx.OrLike("groups", groupIds...),
			)
		} else {
			filterExpr = dbx.Or(
				filterExpr,
				dbx.Like("users", info.AuthRecord.Id),
			)
		}
		query = query.AndWhere(filterExpr)
	}

	result, err := search.NewProvider(fieldResolver).
		Query(query).
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

	info := apis.RequestInfo(c)

	// For admins, proceed directly to app lookup
	if info.Admin != nil {
		app, err := api.dao.FindPblAppBySlug(slug, nil)
		if err != nil || app == nil {
			return apis.NewNotFoundError("", nil)
		}
		return c.JSON(http.StatusOK, app)
	}

	// For anonymous users, check if app exists and is public
	if info.AuthRecord == nil {
		app, err := api.dao.FindPblAppBySlug(slug, nil)
		if err != nil || app == nil {
			// Return unauthorized first if not logged in
			return apis.NewUnauthorizedError("You must be signed in to access this app.", nil)
		}
		if app.Public {
			return c.JSON(http.StatusOK, app)
		}
		return apis.NewUnauthorizedError("You must be signed in to access this app.", nil)
	}

	// For logged-in users, check if app exists and user has access
	app, err := api.dao.FindPblAppBySlug(slug, nil)
	if err != nil || app == nil {
		return apis.NewNotFoundError("", nil)
	}

	// Check if user is authorized using the helper
	if !api.userIsAuthorized(app, info) {
		return apis.NewNotFoundError("", nil) //hide the fact that the apps exist
	}

	return c.JSON(http.StatusOK, app)
}

// userIsAuthorized checks if the user is in the app's Users, Groups, if AllUsers is true, or if app is Public
func (api *applicationApi) userIsAuthorized(app *models.Application, info *pbModels.RequestInfo) bool {
	if info.AuthRecord == nil {
		return false
	}

	// Check if app is public
	if app.Public {
		return true
	}

	userId := info.AuthRecord.Id

	// Check if user is in app.Users
	for _, u := range app.Users {
		if u == userId {
			return true
		}
	}

	// Check if app is for all users
	if app.AllUsers {
		return true
	}

	// Check if user is in any allowed group
	if len(app.Groups) > 0 {
		groups, err := api.dao.FindRecordsByFilter(
			"groups",
			"users.id ?= \""+userId+"\"",
			"-created",
			500,
			0,
		)
		if err == nil {
			for _, g := range groups {
				for _, allowedGroup := range app.Groups {
					if g.Id == allowedGroup {
						return true
					}
				}
			}
		}
	}

	return false
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

	application, err := api.dao.FindPblAppBySlug(slug, nil)
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

	settingsClone, err := api.dao.GetPblSettings().Clone()
	if err == nil {
		if settingsClone.HomePageAppSlug == slug {
			settingsClone.HomePageAppSlug = applicationUpdated.Slug
			err := api.dao.GetPblSettings().Merge(settingsClone)
			if err != nil {
				return apis.NewApiError(500, "Error trying to update the Default App. Please update it manually on the Settings Page.", err)
			}
		}
	}

	return c.JSON(http.StatusOK, applicationUpdated)
}

func (api *applicationApi) delete(c echo.Context) error {
	slug := c.PathParam("slug")
	if slug == "" {
		return apis.NewNotFoundError("", nil)
	}

	application, err := api.dao.FindPblAppBySlug(slug, nil)
	if err != nil || application == nil {
		return apis.NewNotFoundError("", err)
	}

	if err := api.dao.DeletePblApp(application); err != nil {
		return apis.NewBadRequestError("Failed to delete application.", err)
	}

	return c.NoContent(http.StatusNoContent)
}
