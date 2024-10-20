const db = require("../models");
const { Op } = require("sequelize");

const Pokemon = db.Pokemon;
const Tipo = db.Tipo;

// Obtener tipos de un Pokémon
exports.listaTiposDePokemon = async (req, res) => {
    const { pokemon_id } = req.params;

    try {
        const pokemon = await Pokemon.findByPk(pokemon_id, {
            include: {
                model: Tipo,
                through: { attributes: [] },
                attributes: ['id', 'nombre', 'imagen']
            },
        });

        if (!pokemon) {
            return res.status(404).json({ msg: 'Pokémon no encontrado.' });
        }

        res.status(200).json(pokemon.Tipos);
    } catch (error) {
        console.error(`Error en listaTiposDePokemon: ${error.message}`, error);
        res.status(500).json({ msg: 'Error interno al obtener los tipos del Pokémon.' });
    }
};

// Obtener Pokémon por tipo
exports.listaPokemonPorTipo = async (req, res) => {
    const { tipo_id } = req.params;

    try {
        const tipo = await Tipo.findByPk(tipo_id, {
            include: {
                model: Pokemon,
                through: { attributes: [] },
                attributes: ['id', 'nombre', 'nroPokedex']
            },
        });

        if (!tipo) {
            return res.status(404).json({ msg: 'Tipo no encontrado.' });
        }

        res.status(200).json(tipo.Pokemons);
    } catch (error) {
        console.error(`Error en listaPokemonPorTipo: ${error.message}`, error);
        res.status(500).json({ msg: 'Error interno al obtener los Pokémon del tipo.' });
    }
};

// Agregar Pokémon a un tipo
exports.agregarPokemonATipo = async (req, res) => {
    const { pokemon_id, tipo_id } = req.body;

    if (!pokemon_id || !tipo_id) {
        return res.status(400).json({ msg: 'El ID del Pokémon y del tipo son obligatorios.' });
    }

    try {
        const [pokemon, tipo] = await Promise.all([
            Pokemon.findByPk(pokemon_id),
            Tipo.findByPk(tipo_id)
        ]);

        if (!pokemon) return res.status(404).json({ msg: 'Pokémon no encontrado.' });
        if (!tipo) return res.status(404).json({ msg: 'Tipo no encontrado.' });

        const yaAsignado = (await pokemon.getTipos()).some(t => t.id === tipo_id);

        if (yaAsignado) {
            return res.status(400).json({ msg: 'El Pokémon ya tiene asignado este tipo.' });
        }

        await pokemon.addTipo(tipo);
        res.status(201).json({ msg: 'Pokémon agregado exitosamente al tipo.' });
    } catch (error) {
        console.error(`Error en agregarPokemonATipo: ${error.message}`, error);
        res.status(500).json({ msg: 'Error interno al agregar el Pokémon al tipo.' });
    }
};

// Editar tipo del Pokémon
exports.editarPokemonDeTipo = async (req, res) => {
    const { pokemon_id } = req.params;
    const { tipo_id } = req.body;

    if (!tipo_id) {
        return res.status(400).json({ msg: 'El ID del tipo es obligatorio.' });
    }

    try {
        const [pokemon, tipo] = await Promise.all([
            Pokemon.findByPk(pokemon_id),
            Tipo.findByPk(tipo_id)
        ]);

        if (!pokemon) return res.status(404).json({ msg: 'Pokémon no encontrado.' });
        if (!tipo) return res.status(404).json({ msg: 'Tipo no encontrado.' });

        await pokemon.setTipos([tipo]);
        res.status(200).json({ msg: 'Pokémon editado exitosamente al nuevo tipo.' });
    } catch (error) {
        console.error(`Error en editarPokemonDeTipo: ${error.message}`, error);
        res.status(500).json({ msg: 'Error interno al editar el tipo del Pokémon.' });
    }
};

// Eliminar relación entre Pokémon y Tipo
exports.eliminarRelacionPokemonTipo = async (req, res) => {
    const { pokemon_id, tipo_id } = req.params;

    try {
        const [pokemon, tipo] = await Promise.all([
            Pokemon.findByPk(pokemon_id),
            Tipo.findByPk(tipo_id)
        ]);

        if (!pokemon) return res.status(404).json({ msg: 'Pokémon no encontrado.' });
        if (!tipo) return res.status(404).json({ msg: 'Tipo no encontrado.' });

        await pokemon.removeTipo(tipo);
        res.status(200).json({ msg: 'Relación entre Pokémon y Tipo eliminada exitosamente.' });
    } catch (error) {
        console.error(`Error en eliminarRelacionPokemonTipo: ${error.message}`, error);
        res.status(500).json({ msg: 'Error interno al eliminar la relación entre Pokémon y Tipo.' });
    }
};
