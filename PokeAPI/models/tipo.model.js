module.exports = (sequelize, DataTypes) => {
    const Tipo = sequelize.define('Tipo', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        imagen : {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Tipo;
};
