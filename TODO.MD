# TODO:
Esta es una lista de todos para realizar la aplicacion

Esta aplicacion hará lo siguiente:
Se fuerza una misma etructura de carpetas de forma periodica, con filtros varios como tipo y/o nombre de archivo, o fecha
es decir, al seleccionar una carpeta se podrá aplicar un esquema creado por la aplicacion
este esquema se puede editar tras ser seleccionado
este esquema tras ser seleccionado puede aplicarse
al darle a aplicar, se pedirá un directorio

se podra usar de plantilla para un esquema la seleccion de un directorio, pero solo las carpetas

se usará indexDB para guardar los esquemas

## menu
la aplicacion se dividen en menu y editor 
el menu tendrá las siguientes opciones
select schema: en la zona del editor apareceran un listado de esquemas. tras seleccionar uno, se abrira el editor
save schema template
apply schema: se podra aplicar el esquema seleccionado a una carpeta. Se avisara si se tiene un esquema cargado en dicha direccion ( crear funcion notify )

## editor

para editar un esquema, se elaborará la siguiente estructura:

Se podrá crear una carpeta principal y un filtro principal
este elemento tendrá adjunto un div con los botones añadir filtro o añadir carpeta





- permitirá seleccionar una carpeta o crear una estructura de carpetas
- Esta carpeta o estructura se leera de forma interna en JSON con Golang
- 
[ ] Eliminar collapsible y no collapsible
[ ] añadir carpeta a esquema vacio
[ ] Añadir carpeta a carpeta
[ ] eliminar carpeta de esquema vacio y sus hijos
[ ] eliminar carpeta de carpeta y sus hijos
[ ] importar esquema reemplazando el actual
[ ] exportar esquema a un directorio json
[ ] Guardar el esquema en idb
[ ] ver lista de esquemas guardados 
[ ] Cargar y seleccionar esquemas guardados
