module.exports = (sequelize, DataTypes) => {
    const Pokemon = sequelize.define('Pokemon', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nroPokedex: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING,
        },
        descripcion:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ataque: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        defensa: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spAtaque: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spDefensa: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        velocidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true  
    });

    return Pokemon;
};
