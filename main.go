package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"

	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"

	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure

	app := NewApp()
	crud := NewCRUD()

	AppMenu := menu.NewMenu()
	FileMenu := AppMenu.AddSubmenu("File")
	FileMenu.AddText("Open Directory", keys.CmdOrCtrl("o"), func(_ *menu.CallbackData) {
		app.OpenDirectory()

	})

	FileMenu.AddText("Import Schema", keys.CmdOrCtrl("i"), func(_ *menu.CallbackData) {

	})

	FileMenu.AddText("Export Schema", keys.CmdOrCtrl("e"), func(_ *menu.CallbackData) {

	})
	FileMenu.AddSeparator()
	FileMenu.AddText("Quit", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
		runtime.Quit(app.ctx)
	})
	// EditMenu := AppMenu.AddSubmenu("Edit")
	// EditMenu.AddText("Properties (quit)", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
	// 	runtime.Quit(app.ctx)
	// })

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "test",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Menu:             AppMenu, // add a menu
		Bind: []interface{}{
			app,
			crud,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
