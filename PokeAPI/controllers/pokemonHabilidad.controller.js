const db = require("../models");
const { Op } = require("sequelize");

const Pokemon = db.Pokemon;
const Habilidad = db.Habilidad;

exports.listaHabilidadesDePokemon = async (req, res) => {
    const { pokemon_id } = req.params;

    try {
        const pokemon = await Pokemon.findByPk(pokemon_id, {
            include: {
                model: Habilidad,
                through: { attributes: [] },
                attributes: ['id', 'nombre']
            },
        });

        if (!pokemon) {
            return res.status(404).json({ msg: "Pokémon no encontrado." });
        }

        res.status(200).json(pokemon.Habilidads);
    } catch (error) {
        console.error(`Error en listaHabilidadesDePokemon: ${error.message}`, error);
        res.status(500).json({
            msg: "Error interno al obtener las habilidades del Pokémon."
        });
    }
};

exports.asignarHabilidadAPokemon = async (req, res) => {
    const { pokemon_id } = req.params;
    const { habilidad_id } = req.body;

    if (!habilidad_id) {
        return res.status(400).json({ msg: "El ID de la habilidad es obligatorio." });
    }

    try {
        const [pokemon, habilidad] = await Promise.all([
            Pokemon.findByPk(pokemon_id),
            Habilidad.findByPk(habilidad_id)
        ]);

        if (!pokemon) return res.status(404).json({ msg: "Pokémon no encontrado." });
        if (!habilidad) return res.status(404).json({ msg: "Habilidad no encontrada." });

        const habilidadesActuales = await pokemon.getHabilidads({ attributes: ['id'] });
        const yaAsignada = habilidadesActuales.some(h => h.id === habilidad_id);

        if (yaAsignada) {
            return res.status(400).json({ msg: "Esta habilidad ya está asignada al Pokémon." });
        }

        await pokemon.addHabilidad(habilidad);
        res.status(201).json({ msg: "Habilidad asignada exitosamente al Pokémon." });
    } catch (error) {
        console.error(`Error en asignarHabilidadAPokemon: ${error.message}`, error);
        res.status(500).json({
            msg: "Error interno al asignar la habilidad al Pokémon."
        });
    }
};

exports.eliminarRelacionPokemonHabilidad = async (req, res) => {
    const { pokemon_id, habilidad_id } = req.params;

    try {
        const [pokemon, habilidad] = await Promise.all([
            Pokemon.findByPk(pokemon_id),
            Habilidad.findByPk(habilidad_id)
        ]);

        if (!pokemon) return res.status(404).json({ msg: "Pokémon no encontrado." });
        if (!habilidad) return res.status(404).json({ msg: "Habilidad no encontrada." });

        await pokemon.removeHabilidad(habilidad);
        res.status(200).json({ msg: "Relación eliminada exitosamente." });
    } catch (error) {
        console.error(`Error en eliminarRelacionPokemonHabilidad: ${error.message}`, error);
        res.status(500).json({
            msg: "Error interno al eliminar la relación entre Pokémon y Habilidad."
        });
    }
};
