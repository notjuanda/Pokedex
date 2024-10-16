const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

// Inicialización de Sequelize
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);

const db = {};

// Guardamos las instancias de Sequelize
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importamos los modelos y aplicamos `freezeTableName: true`
db.Pokemon = require("./pokemon.model")(sequelize, DataTypes);
db.Tipo = require("./tipo.model")(sequelize, DataTypes);
db.PokemonTipo = require("./pokemonTipo.model")(sequelize, DataTypes);
db.Habilidad = require("./habilidad.model")(sequelize, DataTypes);
db.PokemonHabilidad = require("./pokemonHabilidad.model")(sequelize, DataTypes);
db.Evolucion = require("./evolucion.model")(sequelize, DataTypes);

// Relación muchos a muchos entre Pokemon y Tipo
db.Pokemon.belongsToMany(db.Tipo, {
    through: db.PokemonTipo,
    foreignKey: "pokemon_id",
});
db.Tipo.belongsToMany(db.Pokemon, {
    through: db.PokemonTipo,
    foreignKey: "tipo_id",
});

// Relación muchos a muchos entre Pokemon y Habilidad
db.Pokemon.belongsToMany(db.Habilidad, {
    through: db.PokemonHabilidad,
    foreignKey: "pokemon_id",
});
db.Habilidad.belongsToMany(db.Pokemon, {
    through: db.PokemonHabilidad,
    foreignKey: "habilidad_id",
});

// Relación uno a muchos para las evoluciones
db.Pokemon.hasMany(db.Evolucion, { 
    foreignKey: "pokemon_id", 
    as: "Evoluciones" 
});
db.Pokemon.hasMany(db.Evolucion, { 
    foreignKey: "pokemon_evolucionado_id", 
    as: "Preevoluciones" 
});
db.Evolucion.belongsTo(db.Pokemon, { 
    foreignKey: "pokemon_id", 
    as: "PokemonBase" 
});
db.Evolucion.belongsTo(db.Pokemon, { 
    foreignKey: "pokemon_evolucionado_id", 
    as: "PokemonEvolucionado" 
});

module.exports = db;
