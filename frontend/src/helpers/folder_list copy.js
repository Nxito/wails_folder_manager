import $ from "jquery";
import LocalDB from "./idb";

const fl = {
  match: function (o1, o2) {
    return Object.keys(o1).every((k) => k in o2);
  },
  generateNested: function (array) {
    let nestedPaths = {};

    array.forEach((item) => {
      const parts = item.Path.replace(/\\/g, "/").split("/");

      parts.forEach((part) => {
        if (part == "") {
          return;
        }
        if (!nestedPaths[part]) {
          nestedPaths[part] = {};
        }
        // nestedPaths = nestedPaths[part];
      });
    });
    function getNestedObjectsByPath(obj, path) {
      const keys = path.split("/").filter((key) => key !== ""); // Eliminamos el primer elemento vacío y dividimos la ruta en partes

      let result = { ...obj };

      for (const key of keys) {
        if (result.hasOwnProperty(key)) {
          result = result[key];
        } else {
          result = {};
          break;
        }
      }

      return result;
    }
    nestedPaths = getNestedObjectsByPath(
      nestedPaths,

      $(".current_dir :last-child").text().replace(/\\/g, "/")
    );
    function buildHTMLList(nestedPaths) {
      let html = "<ul>";

      for (const key in nestedPaths) {
        if (Object.prototype.hasOwnProperty.call(nestedPaths, key)) {
          const isDir = Object.keys(nestedPaths[key]).length > 0;
          const iconClass = isDir ? "folder-icon" : "file-icon";
          html += `<li${isDir ? ' class="folder"' : ' class="file"'}  
          ><i class="fa-solid fa-folder-open ${iconClass} "></i>${key}${buildHTMLList(
            nestedPaths[key]
          )}</li>`;
        }
      }

      html += "</ul>";
      return html;
    }

    return buildHTMLList(nestedPaths);
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
        $(this).find(">:first-child").toggleClass("fa-folder-open fa-folder");
      });
    });

    $(".schema_content li ").on("click", function (event) {
      event.stopPropagation();
      $(".schema_content li").removeClass("selected");
      $(this).addClass("selected");
      console.log({ selected: $(this) });
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
        <span class="schemas_list-load"><i class="fa-solid fa-pencil"></i></span>
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

    $(".schemas_list-remove").on("click", function () {
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
        let text = $(listElement[e])
          .contents()
          .filter(function () {
            return this.nodeType === 3; // Filtrar solo nodos de tipo texto
          })
          .text()
          .trim();
        item.push({
          IsDir: true,
          ModTime: new Date(),
          Name: text,
          Path: parent ? `${parent}/${text}` : text,
          Size: 0,
        });

        item.push(
          createObjectFromListNested(
            $(listElement[e]).find(" > ul").find(" > li.folder"),
            text
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
};

export default fl;
