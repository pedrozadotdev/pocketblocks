package main

import (
	"log"
	"os"

	"github.com/internoapp/pocketblocks/server/ui"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
    app := pocketbase.New()

    // serves static files from the provided public dir (if exists)
    app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
        e.Router.GET("/pbl/*", apis.StaticDirectoryHandler(os.DirFS("./pbl_public"), false))
        e.Router.GET(
            "/*",
            apis.StaticDirectoryHandler(ui.DistDirFS, true),
            uiCacheControl(),
		    middleware.Gzip(),
        )
        return nil
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}

func uiCacheControl() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
            c.Response().Header().Set("Cache-Control", "max-age=1209600, stale-while-revalidate=86400")
			return next(c)
		}
	}
}