package main

import (
	"log"

	"github.com/pedrozadotdev/pocketblocks/server/core"
	_ "github.com/pedrozadotdev/pocketblocks/server/migrations"
	"github.com/pocketbase/pocketbase"
)

func main() {
	app := pocketbase.New()

	//Register Commands
	core.RegisterCommands(app)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
