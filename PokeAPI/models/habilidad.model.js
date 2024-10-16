module.exports = (sequelize, Sequelize) => {
    const Habilidad = sequelize.define("Habilidad", {
        nombre: {
            type: Sequelize.STRING,
            AllowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
    return Habilidad;
}