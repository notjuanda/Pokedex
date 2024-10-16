module.exports = (sequelize, DataTypes) => {
    const Tipo = sequelize.define('Tipo', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Tipo;
};
