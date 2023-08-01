  class listenVariable {
    // Define la variable que quieres observar
    _schema = [];
    _path= "";
    _filters = [];
    
    // Define un array para almacenar los manejadores de eventos
    _changeHandlers = [];
  
    // Define un método para añadir nuevos manejadores de eventos
    addChangeHandler(callback) {
      this._changeHandlers.push(callback);
    }
  
    // Define un método para establecer el valor de la variable y disparar todos los eventos
      set schema(val) {
        val = this._deleteDuplicatedByPath(val)
        this._schema = val;
        this._changeHandlers.forEach(handler => handler(val,"schema"));
      }
       set path(val) {
        this._path = val;
        this._changeHandlers.forEach(handler => handler(val,"path"));
      }
       set filters(val) {
        this._filters= val;
        this._changeHandlers.forEach(handler => handler(val,"filters"));
      }
        // Define un método para obtener el valor actual de la variable
        get schema() {
            return this._schema;
        }
         get path() {
            return this._path;
        }

         get filters() {
            return this._filters;
        }


    help(val) {
    console.log(
        `el objeto ha de ser como el siguiente : 
        {
            path: "D:/folder_manager/",
            schema: new scheme_item() ,
            filters: [],
        }`
        );
    }
    _deleteDuplicatedByPath(array) {
        const uniqueItems = [];
      
        array.forEach(item => {
          const { Path } = item;
          const isDuplicate = uniqueItems.some(existingItem => existingItem.Path === Path);
      
          if (!isDuplicate) {
            uniqueItems.push(item);
          }else{
            console.log("Items cannot be Duplicated, change new folder's name if exists")
          }
        });
      
        return uniqueItems;
      }
  }
  const current_schema = new listenVariable()
 
  export {
    current_schema,
    listenVariable

  }
  /*
  uso:



  const instance = new listenVariable();

// Añade varios manejadores para el evento "change"
instance.addChangeHandler(newValue => {
  console.log(`Manejador 1: La variable ha cambiado a ${newValue}`);
});
instance.addChangeHandler(newValue => {
  console.log(`Manejador 2: La variable ha cambiado a ${newValue}`);
});
instance.addChangeHandler(newValue => {
  console.log(`Manejador 3: La variable ha cambiado a ${newValue}`);
});

// Cambia el valor de la variable y dispara todos los eventos
instance.value = [42,123];
instance.value = [42,11];
instance.value = [42,11,[11]];
  */