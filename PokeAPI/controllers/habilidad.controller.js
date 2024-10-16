const db = require("../models");
const { Op } = require("sequelize");

exports.listaHabilidades = async (req, res) => {
    try{
        const habilidades = await db.Habilidad.findAll();
        res.json(habilidades);
    }catch(error){
        res.status(500).json({
            msg: "Error en el servidor"
        });
    }
}

exports.listaHabilidadesPorID = async (req, res) => {
    try{
        const habilidad = await db.Habilidad.findByPk(req.params.id);
        if(habilidad){
            res.json(habilidad);
        }else{
            res.status(404).json({
                msg: "Habilidad no encontrada"
            });
        }
    }catch(error){
        res.status(500).json({
            msg: "Error en el servidor"
        });
    }
}

exports.crearHabilidad = async (req, res) => {
    try{
        const habilidad = await db.Habilidad.create({
            nombre: req.body.nombre,
        });
        res.status(201).json(habilidad);
    }catch(error){
        res.status(500).json({
            msg: "Error en el servidor"
        });
    }
}

exports.editarHabilidad = async (req, res) => {
    try{
        const habilidad = await db.Habilidad.findByPk(req.params.id);
        if(habilidad){
            habilidad.nombre = req.body.nombre;
            await habilidad.save();
            res.json(habilidad);
        }else{
            res.status(404).json({
                msg: "Habilidad no encontrada"
            });
        }
    }catch(error){
        res.status(500).json({
            msg: "Error en el servidor"
        });
    }
}

exports.eliminarHabilidad = async (req, res) => {
    try{
        const habilidad = await db.Habilidad.findByPk(req.params.id);
        if(habilidad){
            await habilidad.destroy();
            res.json(habilidad);
        }else{
            res.status(404).json({
                msg: "Habilidad no encontrada"
            });
        }
    }catch(error){
        res.status(500).json({
            msg: "Error en el servidor"
        });
    }
}