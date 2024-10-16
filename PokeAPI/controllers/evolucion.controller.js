const db = require("../models");
const { Op } = require("sequelize");

const Pokemon = db.Pokemon;
const Evolucion = db.Evolucion;

exports.obtenerLineaEvolutiva = async (req, res) => {
    const { pokemon_id } = req.params;
    try {
        const evoluciones = await Evolucion.findAll({
            where: {
                [Op.or]: [
                    { pokemon_id },
                    { pokemon_evolucionado_id: pokemon_id }
                ]
            },
            include: [
                { model: Pokemon, as: 'PokemonBase', attributes: ['id', 'nombre'] },
                { model: Pokemon, as: 'PokemonEvolucionado', attributes: ['id', 'nombre'] }
            ]
        });

        if (evoluciones.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron evoluciones para este Pokémon' });
        }

        res.json(evoluciones);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la línea evolutiva del Pokémon' });
    }
};

exports.asignarEvolucion = async (req, res) => {
    const { pokemon_id, pokemon_evolucionado_id, metodo, nivelEvolucion } = req.body;

    try {
        const [pokemonBase, pokemonEvolucionado] = await Promise.all([
            Pokemon.findByPk(pokemon_id),
            Pokemon.findByPk(pokemon_evolucionado_id)
        ]);

        if (!pokemonBase || !pokemonEvolucionado) {
            return res.status(404).json({ msg: 'Pokémon base o evolución no encontrado' });
        }

        await Evolucion.create({
            pokemon_id,
            pokemon_evolucionado_id,
            metodo,
            nivelEvolucion
        });

        res.json({ msg: 'Evolución asignada exitosamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al asignar la evolución al Pokémon' });
    }
};

exports.eliminarEvolucion = async (req, res) => {
    const { pokemon_id, pokemon_evolucionado_id } = req.params;

    try {
        const evolucion = await Evolucion.findOne({
            where: {
                pokemon_id,
                pokemon_evolucionado_id
            }
        });

        if (!evolucion) {
            return res.status(404).json({ msg: 'Relación de evolución no encontrada' });
        }

        await evolucion.destroy();
        res.json({ msg: 'Evolución eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la evolución del Pokémon' });
    }
};
