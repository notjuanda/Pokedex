module.exports = (sequelize, DataTypes) => {
    const PokemonTipo = sequelize.define('PokemonTipo', {
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
        tipo_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Tipo',
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

    return PokemonTipo;
};
