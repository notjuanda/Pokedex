module.exports = app => {
    const pokemonHabilidadController = require("../controllers/pokemonHabilidad.controller.js");
    let router = require("express").Router();

    router.get('/pokemon/:pokemon_id', pokemonHabilidadController.listaHabilidadesDePokemon);
    router.post('/pokemon/:pokemon_id/asignar', pokemonHabilidadController.asignarHabilidadAPokemon);
    router.delete('/pokemon/:pokemon_id/habilidad/:habilidad_id', pokemonHabilidadController.eliminarRelacionPokemonHabilidad);

    app.use('/habilidades', router);
};
