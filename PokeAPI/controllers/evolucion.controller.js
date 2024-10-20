const db = require("../models");
const { Op } = require("sequelize");

const Pokemon = db.Pokemon;
const Evolucion = db.Evolucion;

exports.obtenerLineaEvolutiva = async (req, res) => {
    const { pokemon_id } = req.params;
    console.log('ID recibido en el backend:', pokemon_id);

    try {
        const obtenerPreEvoluciones = async (id, resultado = []) => {
            const preEvoluciones = await Evolucion.findAll({
                where: { pokemon_evolucionado_id: id },
                include: [
                    { 
                        model: Pokemon, 
                        as: 'PokemonBase', 
                        attributes: ['id', 'nombre', 'nroPokedex', 'imagen', 'descripcion']
                    }
                ]
            });

            for (const preEvolucion of preEvoluciones) {
                const base = preEvolucion.PokemonBase;
                resultado.unshift(base); // Insertar al principio para mantener el orden ascendente
                await obtenerPreEvoluciones(base.id, resultado);
            }

            return resultado;
        };

        const obtenerEvoluciones = async (id, resultado = []) => {
            const evoluciones = await Evolucion.findAll({
                where: { pokemon_id: id },
                include: [
                    { 
                        model: Pokemon, 
                        as: 'PokemonEvolucionado', 
                        attributes: ['id', 'nombre', 'nroPokedex', 'imagen', 'descripcion'] 
                    }
                ]
            });

            for (const evolucion of evoluciones) {
                const evolucionado = evolucion.PokemonEvolucionado;
                resultado.push(evolucionado); // Insertar al final para mantener el orden ascendente
                await obtenerEvoluciones(evolucionado.id, resultado);
            }

            return resultado;
        };

        const pokemonInicial = await Pokemon.findByPk(pokemon_id, {
            attributes: ['id', 'nombre', 'nroPokedex', 'imagen', 'descripcion']
        });

        if (!pokemonInicial) {
            return res.status(404).json({ msg: 'Pokémon no encontrado.' });
        }

        const preEvoluciones = await obtenerPreEvoluciones(pokemon_id);
        const evoluciones = await obtenerEvoluciones(pokemon_id);

        const lineaEvolutiva = [...preEvoluciones, pokemonInicial, ...evoluciones];

        res.status(200).json({ evoluciones: lineaEvolutiva });
    } catch (error) {
        console.error(`Error en obtenerLineaEvolutiva: ${error.message}`, error);
        res.status(500).json({
            msg: 'Error interno del servidor al obtener la línea evolutiva.'
        });
    }
};


exports.asignarEvolucion = async (req, res) => {
    const { pokemon_id, pokemon_evolucionado_id, metodo, nivelEvolucion } = req.body;

    if (!pokemon_id || !pokemon_evolucionado_id) {
        return res.status(400).json({ 
            msg: 'Se requiere pokemon_id y pokemon_evolucionado_id para asignar una evolución.' 
        });
    }

    try {
        const [pokemonBase, pokemonEvolucionado] = await Promise.all([
            Pokemon.findByPk(pokemon_id),
            Pokemon.findByPk(pokemon_evolucionado_id)
        ]);

        if (!pokemonBase) {
            return res.status(404).json({ msg: 'Pokémon base no encontrado.' });
        }

        if (!pokemonEvolucionado) {
            return res.status(404).json({ msg: 'Pokémon evolucionado no encontrado.' });
        }

        await Evolucion.create({
            pokemon_id,
            pokemon_evolucionado_id,
            metodo,
            nivelEvolucion
        });

        res.status(201).json({ msg: 'Evolución asignada exitosamente.' });
    } catch (error) {
        console.error(`Error en asignarEvolucion: ${error.message}`, error);
        res.status(500).json({
            msg: 'Error interno del servidor al asignar la evolución.'
        });
    }
};

exports.eliminarEvolucion = async (req, res) => {
    const { pokemon_id, pokemon_evolucionado_id } = req.params;

    if (!pokemon_id || !pokemon_evolucionado_id) {
        return res.status(400).json({ 
            msg: 'Se requieren pokemon_id y pokemon_evolucionado_id para eliminar la evolución.' 
        });
    }

    try {
        const evolucion = await Evolucion.findOne({
            where: {
                pokemon_id,
                pokemon_evolucionado_id
            }
        });

        if (!evolucion) {
            return res.status(404).json({ msg: 'Relación de evolución no encontrada.' });
        }

        await evolucion.destroy();
        res.status(200).json({ msg: 'Evolución eliminada exitosamente.' });
    } catch (error) {
        console.error(`Error en eliminarEvolucion: ${error.message}`, error);
        res.status(500).json({
            msg: 'Error interno del servidor al eliminar la evolución.'
        });
    }
};
