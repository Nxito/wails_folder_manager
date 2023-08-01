package main

// Debido a un bug, las funciones exportadas en app.go no se exportan correctamente al guardar.
// Hay que apagar wails.dev y volver a arrancar
import (
	"context"
	"encoding/json"
	"fmt"

	// "io/ioutil"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

/*
Notas de este archivo por nxito

LAs funciones con (a *App) serán exportadas como un export en js

notense las estructuras de datos de go : strings , mapas ( []map[string]interface{} ), ctx contexto...

Una cosa muy importante es el runtime de WAils para tareas de escritorio que js tiene vetado por defecto, como OpenDirectoryDialog. js no permite seleccionar carpetas pero wails  en go si

Hay funciones exportadas al main js que se pueden llamar directamente, otras con windows.runtime y otras  window.go.main.App


*/
// App struct
type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// func (a *App) shutdown(ctx context.Context) {
// }

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s!", name)
}

// Greet returns a greeting for the given name
func (a *App) ReadDirectory(dir string) (string, error) {
	var fileInfos []map[string]interface{}

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		fileInfo := map[string]interface{}{
			"Name":    info.Name(),
			"Size":    info.Size(),
			"Mode":    info.Mode(),
			"ModTime": info.ModTime().String(),
			"IsDir":   info.IsDir(),
			"Path":    filepath.Join(path),
		}

		fileInfos = append(fileInfos, fileInfo)

		return nil
	})

	if err != nil {
		return "nil", err
	}

	// return fileInfos, nil
	jsonData, err := json.MarshalIndent(fileInfos, "", "    ")
	if err != nil {
		return "nil", err
	}

	return fmt.Sprintln(string(jsonData)), nil
}

func (a *App) Confirm() {
	selection, err := runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:    runtime.QuestionDialog,
		Title:   "CONFIRM ?",
		Message: "Ejemplo de confirm con Wails, Funciona?",
	})
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(selection)
}

// CRUD struct
type CRUD struct {
	// ctx context.Context
}

func NewCRUD() *CRUD {
	return &CRUD{}
}

func (a *CRUD) Create_folder(dir string) string {

	// // Crear una carpeta
	// err := os.Mkdir(dir, 0755)
	// if err != nil {
	// 	fmt.Println("Error al crear la carpeta:", err)
	// 	return ""
	// }
	// fmt.Println("Carpeta creada correctamente.")

	// Crear una carpeta y sus subcarpetas recursivamente
	rutaCarpeta := dir
	err := os.MkdirAll(rutaCarpeta, 0755)
	if err != nil {
		fmt.Println("Error al crear la carpeta:", err)
		return " "
	}
	fmt.Println("Carpeta y subcarpetas creadas correctamente.")
	return dir
}
func (a *CRUD) Read_folder(n int, m int) int {
	return n + m
}
func (a *CRUD) OverWrite_folder(n int, m int) int {
	return n + m
}
func (a *CRUD) Delete_folder(n int, m int) int {
	return n + m
}

func (a *CRUD) Create_file(n int, m int) int {
	return n + m
}
func (a *CRUD) Read_file(n int, m int) int {
	return n + m
}
func (a *CRUD) OverWrite_file(n int, m int) int {
	return n + m
}
func (a *CRUD) Delete_file(n int, m int) int {
	return n + m
}
func (a *App) OpenDirectory() string {
	selection, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		DefaultDirectory: ".\\",
		Title:            "Selecciona carpeta",
		//LosFiltros solo valdrian si se seleccionan archivos
		// Filters: []runtime.FileFilter{
		// 	{
		// 		DisplayName: "Images (*.png;*.jpg)",
		// 		Pattern:     "*.png;*.jpg",
		// 	}, {
		// 		DisplayName: "Videos (*.mov;*.mp4)",
		// 		Pattern:     "*.mov;*.mp4",
		// 	},
		// },
		// Filters: "Are you sure you want to delete these records?",
		CanCreateDirectories: true,
		// ShowHiddenFiles:      true,
	})
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(selection)
	runtime.EventsEmit(a.ctx, "directorySelected", selection)
	return selection
}
