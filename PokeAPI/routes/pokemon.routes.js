module.exports = app => {
    const pokemonController = require("../controllers/pokemon.controller.js");
    let router = require("express").Router();

    router.get('/', pokemonController.listaPokemones);
    router.get('/:id', pokemonController.listaPokemonPorID);
    router.post('/', pokemonController.crearPokemon);
    router.put('/:id', pokemonController.editarPokemon);
    router.delete('/:id', pokemonController.eliminarPokemon);
    router.get('/:id/rango', pokemonController.obtenerPokemonConRangos);
    router.get('/buscar/pokemon', pokemonController.buscarPokemon);

    app.use('/pokemon', router);
};
