import "./style.css";
import "./app.css";
import LocalDB from "./helpers/idb";
LocalDB.init("SchemasLocalDB");
import fl from "./helpers/folder_list";
import $ from "jquery";
import logo from "./assets/images/logo-universal.png";
import { Greet, ReadDirectory, Confirm } from "../wailsjs/go/main/App";
import { current_schema } from "./utils/eventvariables";

runtime.EventsOn("test", () => {
  console.log("test");
});

window.runtime.WindowSetTitle("Folder Manager");



$("#app").html(`
    <section class="container">
    <div class="menu">
      <ul>
       <li id="display_schemas" class="button">Display all schemas</li>
       <li id="create_schema" class="button">Create new schema</li>
      <li id="save_schema  "class="button">Save schema</li>
        <div class="divisor"> </div>
        <li class="button">Apply</li>
      </ul>
    </div>

    <div class="content">
    <div class="current_dir">No directory opened or schema selected</div>
    <div class="scheme_actions"> 
      <span class="scheme_actions-add button"><i class="fa-solid fa-folder-plus"></i> Add a folder </span>
      </div>
    <div class="schema_content"> 
      
    
    </div>
    </div>
  
  </section> 

`);

const main_screen_bg_logo = `<div class="main_screen_bg_logo fa-solid fa-folder-open  ">Folder Manager</div>`
$("body").prepend(main_screen_bg_logo)
$(".scheme_actions").hide()
$('.menu').one('click',function(){
  $( ".main_screen_bg_logo" ).fadeTo( 1000 , 0.2, function() {
    // Animation complete.
  });
});

/*
// Setup the greet function
window.greet = function () {
  let name = nameElement.value;
  if (name === "") return;
  try {
    Greet(name)
      .then((result) => {
        resultElement.innerText = result;
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};



window.confirmDialog = function (item) {
  try {
    Confirm(item)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};
*/
window.readdir = function (item) {
  try {
    return ReadDirectory(item)
      .then((result) => {
        // console.log(result)
        // document.getElementById("result_folder").innerText = " Su Estructura es \n" + result;
        return result;
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};

//Obtengo el Evento creado en app.go usando el runtime.EventsEmit(a.ctx, "directorySelected", selection)
//asi cuando llame de cualquier forma a la funcion GO, obtengo asincronamente la info
runtime.EventsOn("directorySelected", async (result) => {
  $(".scheme_actions").show();
  console.log("Selected directory:", result);
  current_schema.path = result
  current_schema.schema= JSON.parse(await readdir(result))//then variable updates and forces event


});

//event that onchange this variable, it updates with the DOM
current_schema.addChangeHandler(function(newValue ,key) {
  if(key !="schema"){return}
  console.log(key);
  console.log(`Manejador 1 en la key ${key}: La variable ha cambiado a ${newValue}`);
  fl.create(current_schema.path, newValue); 
  

});

$("#save_schema").on("click", function () {
  let item = ".schema_content"
  // console.log(fl.createObjectFromList(item))
  const ejemploJSON = {
    path: "D:/Anxo/Código/GitHub/wails_folder_manager/",
    schema: fl.createObjectFromList(item)
  ,
    filters: [],
  };

  LocalDB.save(ejemploJSON)
    .then((message) => console.log(message))
    .catch((error) => console.error(error));

  LocalDB.get()
    .then((data) => console.log("Objetos guardados:", data))
    .catch((error) => console.error(error));
});


$("#display_schemas").on("click", function () {
  LocalDB.get()
    .then((data) => {

      fl.displaySchemas(data)
      console.log("Objetos guardados:", data)
    
    })
    .catch((error) => console.error(error));

})

$("#create_schema").on("click", function () {
  current_schema.schema = []
  $(".current_dir").empty()
  $(".schema_content").empty()
  $(".scheme_actions").show();
  // fl.create("", []); 

})



/*this must work with the main json */
//   const scheme_folder_template = `
//   <li class="folder">
//     <i class="fa-solid fa-folder-open folder-icon "></i>
//     new folder
//   </li>`

//   $(".scheme_actions-add ").on("click", function (event) {
//     event.stopPropagation();
//     // $('.schema_content li').removeClass('selected');
//     let selected = $(".schema_content > ul .selected")
//     if(selected.length == 0){
//       $(".schema_content   ul").length == 0 ?  $(".schema_content").append("<ul></ul>"):"";
//       $(".schema_content > ul").append(scheme_folder_template)
//     }else{
//       selected.find("> ul")??selected.append("<ul></ul>")
//       selected.find("> ul").append(scheme_folder_template)
//    }
//     console.log({selected:$(this)})

// });

$(".scheme_actions-add ").on("click", function (event) {
  event.stopPropagation();
  const name = ".schema_content"
  let item = fl.createObjectFromList(name)
  let selected = fl.checkSelected(name)
  let schema = current_schema.schema 
  schema.push(new fl.scheme_item("new folder", current_schema.path ))
  current_schema.schema = schema;
  // $('.schema_content li').removeClass('selected');
  // let selected = $(".schema_content > ul .selected")
  // if($(selected).hasClass(name.replace(".",""))){
  //   $(".schema_content   ul").length == 0 ?  $(".schema_content").html("<ul></ul>"):"";

  //   // $(".schema_content > ul").append(scheme_folder_template)
  //   item.push(new fl.scheme_item("new folder", "/new folder"))
 
  //   fl.create("",item);
 
  console.log({selected:$(this)})

});


/*  $(".scheme_actions-add ").on("click", function (event) {
    event.stopPropagation();
    const name = ".schema_content"
    let item = fl.createObjectFromList(name)
    let selected = fl.checkSelected(name)
    // $('.schema_content li').removeClass('selected');
    // let selected = $(".schema_content > ul .selected")
    if($(selected).hasClass(name.replace(".",""))){
      $(".schema_content   ul").length == 0 ?  $(".schema_content").html("<ul></ul>"):"";

      // $(".schema_content > ul").append(scheme_folder_template)
      item.push(new fl.scheme_item("new folder", "/new folder"))

      // const ejemploJSON = {
      //   path: "D:/Anxo/Código/GitHub/wails_folder_manager/",
      //   schema: item
       
      // ,
      //   filters: [],
      // };
      fl.create("",item);
    }else{
      selected.find("> ul")??selected.append("<ul></ul>")
      selected.find("> ul").append(scheme_folder_template)
   }
    console.log({selected:$(this)})

});*/
