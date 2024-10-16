const db = require("../models");
const { Op } = require("sequelize");

const Pokemon = db.Pokemon;
const Tipo = db.Tipo;

exports.listaTiposDePokemon = async (req, res) => {
    const { pokemon_id } = req.params;
    try {
        const pokemon = await Pokemon.findByPk(pokemon_id, {
            include: {
                model: Tipo,
                through: { attributes: [] },
            },
        });
        if (!pokemon) return res.status(404).json({ msg: 'Pokémon no encontrado' });
        res.json(pokemon.Tipos);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los tipos del Pokémon' });
    }
};

exports.listaPokemonPorTipo = async (req, res) => {
    const { tipo_id } = req.params;
    try {
        const tipo = await Tipo.findByPk(tipo_id, {
            include: {
                model: Pokemon,
                through: { attributes: [] },
            },
        });
        if (!tipo) return res.status(404).json({ msg: 'Tipo no encontrado' });
        res.json(tipo.Pokemons);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los Pokémon del tipo' });
    }
};

exports.agregarPokemonATipo = async (req, res) => {
    const { pokemon_id, tipo_id } = req.body;
    try {
        const pokemon = await Pokemon.findByPk(pokemon_id);
        const tipo = await Tipo.findByPk(tipo_id);

        if (!pokemon || !tipo) {
            return res.status(404).json({ msg: 'Pokémon o Tipo no encontrado' });
        }

        await pokemon.addTipo(tipo);
        res.json({ msg: 'Pokémon agregado al tipo exitosamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al agregar el Pokémon al tipo' });
    }
};

exports.editarPokemonDeTipo = async (req, res) => {
    const { pokemon_id } = req.params;
    const { tipo_id } = req.body;
    try {
        const pokemon = await Pokemon.findByPk(pokemon_id);
        const tipo = await Tipo.findByPk(tipo_id);

        if (!pokemon || !tipo) {
            return res.status(404).json({ msg: 'Pokémon o Tipo no encontrado' });
        }

        await pokemon.setTipos([tipo]);
        res.json({ msg: 'Pokémon editado del tipo exitosamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al editar el Pokémon del tipo' });
    }
};

exports.eliminarRelacionPokemonTipo = async (req, res) => {
    const { pokemon_id, tipo_id } = req.params;

    try {
        const pokemon = await Pokemon.findByPk(pokemon_id);
        const tipo = await Tipo.findByPk(tipo_id);

        if (!pokemon || !tipo) {
            return res.status(404).json({ msg: 'Pokémon o Tipo no encontrado' });
        }

        await pokemon.removeTipo(tipo);
        res.json({ msg: 'Relación entre Pokémon y Tipo eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la relación entre Pokémon y Tipo' });
    }
};

