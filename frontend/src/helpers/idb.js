import Dexie from 'dexie';

const LocalDB = {
  dbName: 'LocalDB',
  db: null,

  init(dbName) {
    this.dbName = dbName || 'LocalDB';
    this.db = new Dexie(this.dbName);
    this.db.version(1).stores({
      jsonObjects: '++id',
    });
    return this.openDB();
  },

  openDB() {
    return this.db.open().catch((err) => {
      console.error(`Error al abrir la base de datos: ${err.stack || err}`);
    });
  },

  save(jsonObject) {
    return this.db.jsonObjects
      .add(jsonObject)
      .then(() => {
        return 'Objeto JSON guardado correctamente.';
      })
      .catch((err) => {
        throw new Error(`Error al guardar el objeto JSON: ${err.stack || err}`);
      });
  },

  get(id) {
    
    return  (id
        ? this.db.jsonObjects.where('id').equals(id)
        : this.db.jsonObjects
      )
      .toArray()
      .then((data) => {
        return data;
      })
      .catch((err) => {
        throw new Error(`Error al obtener los objetos JSON: ${err.stack || err}`);
      });
  },
  delete(id) {
    return this.db.jsonObjects
      .delete(id)
      .then(() => {
        return 'Objeto JSON eliminado correctamente.';
      })
      .catch((err) => {
        throw new Error(`Error al eliminar el objeto JSON: ${err.stack || err}`);
      });
  },
  clear(){
    return this.db
    .delete()
    .then(() => {
      return 'Todos los JSON eliminados correctamente.';
    })
    .catch((err) => {
      throw new Error(`Error al eliminar el objeto JSON: ${err.stack || err}`);
    });
  }
};

export default LocalDB;

// usage 
// import LocalDB from './localDB.js';

// // Inicializar la base de datos
// LocalDB.init('MyLocalDB')
//   .then(() => {
//     const ejemploJSON = { nombre: 'Ejemplo', edad: 30, email: 'ejemplo@example.com' };

//     LocalDB.save(ejemploJSON)
//       .then((message) => console.log(message))
//       .catch((error) => console.error(error));

//     LocalDB.get()
//       .then((data) => console.log('Objetos guardados:', data))
//       .catch((error) => console.error(error));
//   })
//   .catch((error) => console.error(error));
