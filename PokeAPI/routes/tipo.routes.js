module.exports = (app) => {
    const tipoController = require("../controllers/tipo.controller.js");
    const router = require("express").Router();

    router.get('/', tipoController.listaTipos);
    router.get('/:id', tipoController.listaTiposPorID);
    router.post('/', tipoController.crearTipo);
    router.put('/:id', tipoController.editarTipo);
    router.delete('/:id', tipoController.eliminarTipo);

    app.use('/tipo', router);
};
