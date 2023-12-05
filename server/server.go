package main

import (
	"log"

	_ "github.com/internoapp/pocketblocks/server/migrations"
	"github.com/pocketbase/pocketbase"
)

func main() {
	app := pocketbase.New()

	//Register Hooks
	registerHooks(app)

	//Register Commands
	registerCommands(app)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
