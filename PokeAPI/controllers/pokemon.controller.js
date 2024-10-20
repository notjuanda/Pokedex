const db = require("../models");
const { Op } = require("sequelize");
const Pokemon = db.Pokemon;
const path = require('path');
const fs = require('fs'); 

function calcularRangoStat(baseStat, esHp = false) {
    const calcularMin = (nivel) => {
        if (esHp) {
            return Math.floor(((2 * baseStat) * nivel) / 100 + nivel + 10);
        }
        return Math.floor(((((2 * baseStat) * nivel) / 100) + 5) * 0.9);
    };

    const calcularMax = (nivel) => {
        if (esHp) {
            return Math.floor((((2 * baseStat + 31 + (252 / 4)) * nivel) / 100) + nivel + 10);
        }
        return Math.floor(((((2 * baseStat + 31 + (252 / 4)) * nivel) / 100) + 5) * 1.1);
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
        const pokemones = await Pokemon.findAll({
            order: [['nroPokedex', 'ASC']]
        });
        res.status(200).json(pokemones);
    } catch (error) {
        console.error(`Error en listaPokemones: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al obtener los Pokémon." });
    }
};

exports.listaPokemonPorID = async (req, res) => {
    const { id } = req.params;

    try {
        const pokemon = await Pokemon.findByPk(id);

        if (!pokemon) {
            return res.status(404).json({ msg: "Pokémon no encontrado." });
        }

        res.status(200).json(pokemon);
    } catch (error) {
        console.error(`Error en listaPokemonPorID: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al obtener el Pokémon." });
    }
};

exports.crearPokemon = async (req, res) => {
    try {
        const { nombre, nroPokedex, descripcion, hp, ataque, defensa, spAtaque, spDefensa, velocidad, nivelEvolucion } = req.body;
        const nuevoPokemon = await Pokemon.create({
            nombre,
            nroPokedex,
            descripcion,
            hp,
            ataque,
            defensa,
            spAtaque,
            spDefensa,
            velocidad,
            nivelEvolucion
        }) 
        console.log("Pokemon creado con ID:", nuevoPokemon.id);
        const imagenUrl = await subirImagenPokemon(req, nuevoPokemon.id);
        console.log("URL de imagen devuelta:", imagenUrl);

        if (imagenUrl) {
            await nuevoPokemon.update({ imagen: imagenUrl });
            console.log("Imagen actualizada en el pokemon:", imagenUrl);
        }
        res.status(201).json({
            msg: 'Pokemon creado exitosamente', pokemon: nuevoPokemon 
        });

    } catch (error) {
        console.error(`Error en crearPokemon: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al crear el Pokémon." });
    }
};

exports.editarPokemon = async (req, res) => {
    const { id } = req.params;
    const { nombre, nroPokedex, descripcion, hp, ataque, defensa, spAtaque, spDefensa, velocidad, nivelEvolucion } = req.body;

    try {
        await Pokemon.update(
            {
            nombre,
            nroPokedex,
            descripcion,
            hp,
            ataque,
            defensa,
            spAtaque,
            spDefensa,
            velocidad, 
            nivelEvolucion
            }, {
                where: { id } 
            }
        )

        const imagenUrl = await subirImagenPokemon(req, id);
        if (imagenUrl) {
            await Pokemon.update({ pokemon: imagenUrl }, { where: { id: id } });
        }
        res.json({ msg: 'Pokemon actualizado exitosamente' });

    } catch (error) {
        console.error(`Error en editarPokemon: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al actualizar el Pokémon." });
    }
};

exports.eliminarPokemon = async (req, res) => {
    const { id } = req.params;

    try {
        const pokemon = await Pokemon.findByPk(id);

        if (!pokemon) {
            return res.status(404).json({ msg: "Pokémon no encontrado." });
        }

        if (pokemon.imagen) { 
            const imagePath = path.join(__dirname, '..', 'public', pokemon.imagen);
            if (fs.existsSync(imagePath)) {  
                fs.unlinkSync(imagePath);
            }
        }

        await pokemon.destroy();
        res.status(200).json({ msg: "Pokémon eliminado exitosamente." });
    } catch (error) {
        console.error(`Error en eliminarPokemon: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al eliminar el Pokémon." });
    }
};

exports.obtenerPokemonConRangos = async (req, res) => {
    const { id } = req.params;

    try {
        const pokemon = await Pokemon.findByPk(id);

        if (!pokemon) {
            return res.status(404).json({ msg: "Pokémon no encontrado." });
        }

        const rangos = {
            hp: calcularRangoStat(pokemon.hp, true),
            ataque: calcularRangoStat(pokemon.ataque),
            defensa: calcularRangoStat(pokemon.defensa),
            spAtaque: calcularRangoStat(pokemon.spAtaque),
            spDefensa: calcularRangoStat(pokemon.spDefensa),
            velocidad: calcularRangoStat(pokemon.velocidad)
        };

        res.status(200).json({ ...pokemon.toJSON(), rangos });
    } catch (error) {
        console.error(`Error en obtenerPokemonConRangos: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al obtener el Pokémon con rangos." });
    }
};

const subirImagenPokemon = (req, idPokemon) => {
    return new Promise((resolve, reject) => {
        if (!req.files?.imagen) {
            console.log("No se recibió ninguna imagen."); 
            resolve(null); 
            return;
        }
        const imagen = req.files.imagen;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(imagen.mimetype)) {
            reject({ msg: 'Formato de imagen no válido, solo se permiten JPG, PNG o WEBP' });
            return;
        }
        const imagePath = __dirname + '/../public/images/pokemones/' + idPokemon + '.jpg';
        imagen.mv(imagePath, function (err) {
            if (err) {
                console.error("Error al mover la imagen:", err); 
                reject({ msg: 'Error al subir la imagen', error: err });
            } else {
                const imagenUrl = '/images/pokemones/' + idPokemon + '.jpg';
                console.log("Imagen subida correctamente, URL:", imagenUrl);
                resolve(imagenUrl); 
            }
        });
    });
};
