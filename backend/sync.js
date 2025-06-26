//Correr la sincronizacion con los modelos
const {sequelize} = require ('./models');

sequelize.sync({force:false}) //no borra las tablas si ya existen
.then(()=> {
    console.log("Tablas sincronizadas");
    process.exit();
})
.catch((error) =>{
    console.error("Error al sincronizar las tablas ", error);
    process.exit(1);

})
