module.exports = (sequelize, DataTypes) => {
    const PokemonHabilidad = sequelize.define('PokemonHabilidad', {
        pokemon_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Pokemon',
                key: 'id'
            },
            onDelete: 'CASCADE',
            AllowNull: false,
            primaryKey: true
        },
        habilidad_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Habilidad',
                key: 'id'
            },
            onDelete: 'CASCADE',
            AllowNull: false,
            primaryKey: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return PokemonHabilidad;
}