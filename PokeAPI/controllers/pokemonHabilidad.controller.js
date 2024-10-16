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
            },
        });
        if (!pokemon) return res.status(404).json({ msg: 'Pokémon no encontrado' });
        res.json(pokemon.Habilidads);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las habilidades del Pokémon' });
    }
};

exports.asignarHabilidadAPokemon = async (req, res) => {
    const { pokemon_id } = req.params;
    const { habilidad_id } = req.body;

    try {
        const [pokemon, habilidad] = await Promise.all([
            Pokemon.findByPk(pokemon_id),
            Habilidad.findByPk(habilidad_id),
        ]);

        if (!pokemon) return res.status(404).json({ msg: 'Pokémon no encontrado' });
        if (!habilidad) return res.status(404).json({ msg: 'Habilidad no encontrada' });

        const habilidadesActuales = await pokemon.getHabilidads();
        const yaAsignada = habilidadesActuales.some(h => h.id === habilidad_id);

        if (yaAsignada) {
            return res.status(400).json({ msg: 'Esta habilidad ya está asignada al Pokémon' });
        }

        await pokemon.addHabilidad(habilidad);
        res.json({ msg: 'Habilidad asignada exitosamente al Pokémon' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al asignar la habilidad al Pokémon' });
    }
};

exports.eliminarRelacionPokemonHabilidad = async (req, res) => {
    const { pokemon_id, habilidad_id } = req.params;

    try {
        const pokemon = await Pokemon.findByPk(pokemon_id);
        const habilidad = await Habilidad.findByPk(habilidad_id);

        if (!pokemon || !habilidad) {
            return res.status(404).json({ msg: 'Pokémon o Habilidad no encontrado' });
        }

        await pokemon.removeHabilidad(habilidad);
        res.json({ msg: 'Relación entre Pokémon y Habilidad eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la relación entre Pokémon y Habilidad' });
    }
};
