module.exports = app => {
    const habilidadController = require("../controllers/habilidad.controller.js");
    let router = require("express").Router();

    router.get('/', habilidadController.listaHabilidades);
    router.get('/:id', habilidadController.listaHabilidadesPorID);
    router.post('/', habilidadController.crearHabilidad);
    router.put('/:id', habilidadController.editarHabilidad);
    router.delete('/:id', habilidadController.eliminarHabilidad);

    app.use('/habilidades', router);
}
