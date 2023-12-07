package main

import (
	"log"

	"github.com/internoapp/pocketblocks/server/core"
	_ "github.com/internoapp/pocketblocks/server/migrations"
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
