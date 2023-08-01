import $ from "jquery";
import LocalDB from "./idb";
import { current_schema } from "../utils/eventvariables";
const fl = {
  match: function (o1, o2) {
    return Object.keys(o1).every((k) => k in o2);
  },
  generateNested: (items, parentPath) => {
    const folders = {};
    parentPath = $(".current_dir :last-child").text().replace(/\\/g, "/");
    // Agrupar los elementos por ruta
    items.forEach((item) => {
      const path = item.Path.replace(/\\/g, "/").replace(parentPath, "");
      const parts = path.split("/");

      let currentFolder = folders;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!currentFolder[part]) {
          currentFolder[part] = {};
        }
        currentFolder = currentFolder[part];
      }
    });

    // Función recursiva para construir la lista HTML
    const buildList = (folder) => {
      const keys = Object.keys(folder);
      if (keys.length === 0) {
        return "";
      }

      let html = "<ul>";
      keys.forEach((key) => {
        const isDir = !key.includes(".");
        if(!isDir){return}
        const iconClass = isDir ? "folder-icon" : "file-icon";
        const subfolder = folder[key];
        html += `
        
          <li ${isDir ? ' class="folder"' : ' class="file"'}>
             <span>
              <i class="fa-solid fa-folder-open ${iconClass} "></i>
              <span class="folder_name">${key}</span>
              <input type="text" class ="hidden folder_name-input" placeholder="Edit" value="${key}">  </input>
              </span>
            
            <span class="folder_actions">
              <span class="button folder_actions-rename ">
                <i class="fa-solid fa-pencil"></i>
              </span>
              <span class="button folder_actions-add">
              <i class="fa-solid fa-folder-plus"></i>
            </span> 
              <span class="button folder_actions-delete">
                <i class="fa-solid fa-trash"></i>
              </span>

              <span class="button folder_actions-filters">
                <i class="fa-solid fa-filter"></i>
              </span> 
            </span>
            ${buildList(subfolder)}
          </li>`;
      });
      html += "</ul>";
      return html;
    };
    return buildList(folders[""] ? folders[""] : folders);
  },

  /*Lee el directorio especificado , crea un elemento dom  del directorio, y crea los elementos a partir del elemento leido*/
  create: async function (folder_dir, jsondir) {
    // folder_dir = folder_dir.replace(/\\/g, "/");
    if (!jsondir) {
      jsondir = await readdir(folder_dir);
      jsondir = JSON.parse(jsondir);
      // jsondir.forEach(
      //   (e) => (e.Path = e.Path.replace(/\\/g, "/").replace(folder_dir, ""))
      // );
      console.log({ folder_dir, jsondir });
    } else {
      if (jsondir.find((e) => e.Path == "")) {
        jsondir.forEach((e) => (e.Path = folder_dir + e.Path));
      }

      //TODO: match if(fl.match(jsondir,{}))
    }

    $(".current_dir").html(`<span>...</span><span>${folder_dir}</span>`);

    // $(".schema_content").html(this.generateNested(jsondir));
    if (jsondir.length == 0) {
      $(".schema_content").html(
        "Looks that this schema is empty, try to add some folders"
      );
      return;
    }
    $(".schema_content").html(fl.generateNested(jsondir));

    // $(".schema_content")
    //   .append("<div class='schema_content-data'><div>")
    //   .find(".schema_content-data")
    //   .hide()
    //   .attr("data", JSON.stringify(jsondir));

    $(".schema_content li").each(function () {
      $(this).parent().removeClass("selected");
      $(this).on("dblclick", function (event) {
        event.stopPropagation();
        $(this).find(">:first-child i").toggleClass("fa-folder-open fa-folder");
        $(this).find("> ul").toggleClass("hidden");
      });
    });

    $(".schema_content li ").on("click", function (event) {
      event.stopPropagation();
      $(".schema_content li").removeClass("selected");
      $(this).addClass("selected");
      console.log({ selected: $(this) });
    });
    //al clickar rename, el nombre de la carpeta se volver aun input, que al submit, se renombrará la carpeta visualmente y en current_schema
    $(".folder_actions-rename").on("click", function (event) {
      event.stopPropagation();
       if($(this).closest(".selected").length == 0){return}
       //activo el modo input
       $(this).closest(".selected").find("> span  .folder_name").hide()
       $(this).closest(".selected").find("> span  .folder_name-input").removeClass("hidden")
        //al dar enter, cambio el valor y escondo el input nuevamnete
       $(this).closest(".selected").find("> span  .folder_name-input").keypress(function (e) {
        if (e.which == 13) {
          $(this).closest(".selected").find("> span  .folder_name").text($(this).val())
          $(this).closest(".selected").find("> span  .folder_name-input").addClass("hidden")
          $(this).closest(".selected").find("> span  .folder_name").show()

          //de paso, cambiaré el valor en el schema
          console.log(fl.createObjectFromList(".schema_content"))
          current_schema.schema = fl.createObjectFromList(".schema_content")
          return false;  
        }
      });
 
    });
 //al clickar add,se crea una nueva la carpeta visualmente  y en current_schema

    $(".folder_actions-add").on("click", function (event) {
      event.stopPropagation();
      if($(this).closest(".selected").length == 0){return}
      $(this).closest(".selected").push()
      console.log(fl.createObjectFromList(".schema_content"))
      current_schema.schema = fl.createObjectFromList(".schema_content")
      return false;  
        
      });
    //al clickar delete,se elimina la carpeta visualmente de forma anidada y forzada , asi como y en current_schema

    $(".folder_actions-delete").on("click", function (event) {
      event.stopPropagation();
       if($(this).closest(".selected").length == 0){return}
       //TODO: POPUP QUE AVISE PARA BORRAR
       $(this).closest(".selected").remove() 
          console.log(fl.createObjectFromList(".schema_content"))
          current_schema.schema = fl.createObjectFromList(".schema_content")
          return false;  
        
      });

      
     
    
  },
  displaySchemas: function (idbdata) {
    const flcreate = this.create;
    $(".schema_content").empty();
    $(".scheme_actions").hide();

    $(".current_dir").text("List of saved Schemas");

    idbdata.forEach((e) => {
      let item = `<div class='schemas_list' data-id ="${e.id}" data-path ="${e.path}">
        <span class="schemas_list-path"> ◽ ${e.path} </span>
        <span class="schemas_list-load"><i class="fa-solid fa-pen"></i></span>
        <span class="schemas_list-remove"><i class="fa-solid fa-trash"></i> </span>
      <div>`;
      console.log(idbdata, item);
      $(".schema_content").append(item);
    });

    $(".schemas_list-load").on("click", function () {
      $(".scheme_actions").show();
      console.log(this);
      const path = this.parentElement.dataset.path;
      const id = this.parentElement.dataset.id;
      LocalDB.get(Number(id))
        .then((data) => {
          flcreate(data[0].path, data[0].schema);
          console.log("Objetos guardados:", data);
        })
        .catch((error) => console.error(error));

      // fl.create(result);
    });

    $(".schemas_list-remove").on("click", function () {fs
      console.log(this);
      const path = this.parentElement.dataset.path;
      const id = this.parentElement.dataset.id;
      LocalDB.delete(Number(id))
        .then((data) => {
          $(`.schemas_list[data-id="${id}"]`).remove();
          console.log("Objetos guardados:", data);
        })
        .catch((error) => console.error(error));
    });
  },
  createObjectFromList: function (element = "#folder-list") {
    const main = $(element).find(" > ul").find(" > li.folder");
    var item = [];
    function createObjectFromListNested(listElement, parent = "") {
      listElement.each((e) => {
        // let text = $(listElement[e])
        //   .contents()
        //   .filter(function () {
        //     return this.nodeType === 3; // Filtrar solo nodos de tipo texto
        //   })
        //   .text()
        //   .trim();
        let text = $(listElement[e]).find(">:first-child  .folder_name").text()
        let path = parent ? `${parent}/${text}` : text;
        item.push({
          IsDir: true,
          ModTime: new Date(),
          Name: text,
          Path: path,
          Size: 0,
        });

        item.push(
          createObjectFromListNested(
            $(listElement[e]).find(" > ul").find(" > li.folder"),
            path,
          )
        );
      });
    }
    item.push(createObjectFromListNested(main));
    return item.filter((e) => e);
  },
  checkSelected: function (element = "#folder-list") {
    const selected = $(element).find(" > ul").find(".selected");
    if (selected.length > 0) {
      return selected;
    } else {
      return $(element);
    }
  },
  scheme_item: class {
    constructor(Name, Path) {
      this.IsDir = true;
      this.ModTime = new Date();
      this.Name = Name;
      this.Path = Path ? (Path + "/" + Name).replace("//", "/") : Name;
      this.Size = 0;
    }
  },
  sortJSONByPath: function (data) {
    const compareByPath = (pathA, pathB) => {
      const segmentsA = pathA.split("/");
      const segmentsB = pathB.split("/");

      const minLength = Math.min(segmentsA.length, segmentsB.length);

      for (let i = 0; i < minLength; i++) {
        const segmentComparison = segmentsA[i].localeCompare(segmentsB[i]);

        if (segmentComparison !== 0) {
          return segmentComparison;
        }
      }

      return segmentsA.length - segmentsB.length;
    };
    data.items.sort((a, b) => compareByPath(a.path, b.path));
    return data; //usage :  const sortedData = sortJSONByPath(data);
  },
  findParentElements: (data) => {
    const isParentElement = (element) => {
      const path = element.path;
      return !path.includes("/");
    };
    return data.items.filter(isParentElement);
  },
  folderTemplate : function (isDir) {
    // TODO: hacer que el template de las carpetas estea aqui y no en buildList
    return `
    
    `
  }
};

export default fl;
