const db = require("../models");
const { Op } = require("sequelize");

const Pokemon = db.Pokemon;

function calcularRangoStat(baseStat, esHp = false) {
    const calcularMin = (nivel) => {
        if (esHp) {
            return Math.floor(((2 * baseStat) * nivel) / 100 + nivel + 10);
        } else {
            return Math.floor(((((2 * baseStat) * nivel) / 100) + 5) * 0.9);
        }
    };

    const calcularMax = (nivel) => {
        if (esHp) {
            return Math.floor((((2 * baseStat + 31 + (252 / 4)) * nivel) / 100) + nivel + 10);
        } else {
            return Math.floor(((((2 * baseStat + 31 + (252 / 4)) * nivel) / 100) + 5) * 1.1);
        }
    };

    return {
        nivel_50: {
            min: calcularMin(50),
            max: calcularMax(50)
        },
        nivel_100: {
            min: calcularMin(100),
            max: calcularMax(100)
        }
    };
}

exports.listaPokemones = async (req, res) => {
    try {
        const pokemones = await Pokemon.findAll();
        res.json(pokemones);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

exports.listaPokemonPorID = async (req, res) => {
    const { id } = req.params;
    try {
        const pokemon = await Pokemon.findByPk(id);
        if (pokemon) {
            res.json(pokemon);
        } else {
            res.status(404).json({ msg: "Pokémon no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

exports.crearPokemon = async (req, res) => {
    try {
        const pokemon = await Pokemon.create(req.body);
        res.status(201).json(pokemon);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

exports.editarPokemon = async (req, res) => {
    const { id } = req.params;
    try {
        const pokemon = await Pokemon.findByPk(id);
        if (pokemon) {
            await pokemon.update(req.body);
            res.json(pokemon);
        } else {
            res.status(404).json({ msg: "Pokémon no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

exports.eliminarPokemon = async (req, res) => {
    const { id } = req.params;
    try {
        const pokemon = await Pokemon.findByPk(id);
        if (pokemon) {
            await pokemon.destroy();
            res.json({ msg: "Pokémon eliminado exitosamente" });
        } else {
            res.status(404).json({ msg: "Pokémon no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

exports.obtenerPokemonConRangos = async (req, res) => {
    const { id } = req.params;

    try {
        const pokemon = await Pokemon.findByPk(id);

        if (!pokemon) {
            return res.status(404).json({ msg: "Pokémon no encontrado" });
        }

        const rangos = {
            hp: calcularRangoStat(pokemon.hp, true),
            ataque: calcularRangoStat(pokemon.ataque),
            defensa: calcularRangoStat(pokemon.defensa),
            spAtaque: calcularRangoStat(pokemon.spAtaque),
            spDefensa: calcularRangoStat(pokemon.spDefensa),
            velocidad: calcularRangoStat(pokemon.velocidad)
        };

        res.json({
            ...pokemon.toJSON(),
            rangos
        });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el Pokémon" });
    }
};
