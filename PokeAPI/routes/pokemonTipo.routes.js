module.exports = app => {
    const pokemonTipoController = require("../controllers/pokemonTipo.controller.js");
    let router = require("express").Router();

    router.get('/pokemon/:pokemon_id', pokemonTipoController.listaTiposDePokemon);
    router.get('/:tipo_id/pokemones', pokemonTipoController.listaPokemonPorTipo);
    router.post('/adicionar', pokemonTipoController.agregarPokemonATipo);
    router.put('/editar-tipo/:pokemon_id', pokemonTipoController.editarPokemonDeTipo);
    router.delete('/:pokemon_id/:tipo_id', pokemonTipoController.eliminarRelacionPokemonTipo);
    
    app.use('/tipo', router);
};
