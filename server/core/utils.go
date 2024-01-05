package core

import (
	"github.com/labstack/echo/v5"
)

func uiCacheControl() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Response().Header().Set("Cache-Control", "max-age=1209600, stale-while-revalidate=86400")
			return next(c)
		}
	}
}
