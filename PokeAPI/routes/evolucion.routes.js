module.exports = app => {
    const evolucionController = require("../controllers/evolucion.controller.js");
    let router = require("express").Router();

    router.get('/:pokemon_id', evolucionController.obtenerLineaEvolutiva);
    router.post('/asignar', evolucionController.asignarEvolucion);
    router.delete('/:pokemon_id/:pokemon_evolucionado_id', evolucionController.eliminarEvolucion);

    app.use('/evolucion', router);
};
