const db = require("../models");
const { Op } = require("sequelize"); 

exports.listaTipos = async (req, res) => {
    try{
        const tipos = await db.Tipo.findAll();
        res.json(tipos);
    }catch(error){
        res.status(500).json({
            msg: "Error en el servidor"
        });
    }
}

exports.listaTiposPorID = async (req, res) => {
    try{
        const tipo = await db.Tipo.findByPk(req.params.id);
        if(tipo){
            res.json(tipo);
        }else{
            res.status(404).json({
                msg: "Tipo no encontrado"
            });
        }
    }catch(error){
        res.status(500).json({
            msg: "Error en el servidor"
        });
    }
}

exports.crearTipo = async (req, res) => {
    try{
        const tipo = await db.Tipo.create({
            nombre: req.body.nombre
        });
        res.status(201).json(tipo);
    }catch(error){
        res.status(500).json({
            msg: "Error en el servidor"
        });
    }
}

exports.editarTipo = async (req, res) => {
    try{
        const tipo = await db.Tipo.findByPk(req.params.id);
        if(tipo){
            tipo.nombre = req.body.nombre;
            await tipo.save();
            res.json(tipo);
        }else{
            res.status(404).json({
                msg: "Tipo no encontrado"
            });
        }
    }catch(error){
        res.status(500).json({
            msg: "Error en el servidor"
        });
    }
}

exports.eliminarTipo = async (req, res) => {
    try{
        const tipo = await db.Tipo.findByPk(req.params.id);
        if(tipo){
            await tipo.destroy();
            res.json({
                msg: "Tipo eliminado"
            });
        }else{
            res.status(404).json({
                msg: "Tipo no encontrado"
            });
        }
    }catch(error){
        res.status(500).json({
            msg: "Error en el servidor"
        });
    }
}