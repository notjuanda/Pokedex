module.exports = (sequelize, DataTypes) => {
    const Evolucion = sequelize.define('Evolucion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pokemon_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Pokemon', 
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        pokemon_evolucionado_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Pokemon',  
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        metodo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nivelEvolucion: {
            type: DataTypes.INTEGER,
            allowNull: true 
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Evolucion;
};
