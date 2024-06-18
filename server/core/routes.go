package core

import (
	"github.com/pedrozadotdev/pocketblocks/server/apis"
	"github.com/pedrozadotdev/pocketblocks/server/daos"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	a "github.com/pocketbase/pocketbase/apis"
)

func registerRoutes(app *pocketbase.PocketBase, e *echo.Echo) {
	group := e.Group("/api/pbl")
	dao := daos.New(app.Dao().DB())
	logMiddleware := a.ActivityLogger(app.App)

	apis.BindSnapshotApi(dao, group, logMiddleware)
	apis.BindFolderApi(dao, group, logMiddleware)
	apis.BindSettingsApi(dao, group, logMiddleware)
	apis.BindApplicationApi(dao, group, logMiddleware)
}
