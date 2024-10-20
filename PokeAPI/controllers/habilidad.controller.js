const db = require("../models");
const { Habilidad } = db;

exports.listaHabilidades = async (req, res) => {
    try {
        const habilidades = await Habilidad.findAll({ attributes: ['id', 'nombre'] });
        res.status(200).json(habilidades);
    } catch (error) {
        console.error(`Error en listaHabilidades: ${error.message}`, error);
        res.status(500).json({
            msg: "Error interno del servidor al obtener las habilidades."
        });
    }
};

exports.listaHabilidadesPorID = async (req, res) => {
    const { id } = req.params;

    try {
        const habilidad = await Habilidad.findByPk(id, { attributes: ['id', 'nombre'] });

        if (!habilidad) {
            return res.status(404).json({ msg: "Habilidad no encontrada." });
        }

        res.status(200).json(habilidad);
    } catch (error) {
        console.error(`Error en listaHabilidadesPorID: ${error.message}`, error);
        res.status(500).json({
            msg: "Error interno del servidor al obtener la habilidad."
        });
    }
};

exports.crearHabilidad = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string') {
        return res.status(400).json({ msg: "El nombre de la habilidad es obligatorio y debe ser un string." });
    }

    try {
        const habilidad = await Habilidad.create({ nombre });

        res.status(201).json({
            msg: "Habilidad creada exitosamente.",
            habilidad: { id: habilidad.id, nombre: habilidad.nombre }
        });
    } catch (error) {
        console.error(`Error en crearHabilidad: ${error.message}`, error);
        res.status(500).json({
            msg: "Error interno del servidor al crear la habilidad."
        });
    }
};

exports.editarHabilidad = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string') {
        return res.status(400).json({ msg: "El nombre de la habilidad es obligatorio y debe ser un string." });
    }

    try {
        const habilidad = await Habilidad.findByPk(id);

        if (!habilidad) {
            return res.status(404).json({ msg: "Habilidad no encontrada." });
        }

        habilidad.nombre = nombre;
        await habilidad.save();

        res.status(200).json({
            msg: "Habilidad actualizada exitosamente.",
            habilidad: { id: habilidad.id, nombre: habilidad.nombre }
        });
    } catch (error) {
        console.error(`Error en editarHabilidad: ${error.message}`, error);
        res.status(500).json({
            msg: "Error interno del servidor al actualizar la habilidad."
        });
    }
};

exports.eliminarHabilidad = async (req, res) => {
    const { id } = req.params;

    try {
        const habilidad = await Habilidad.findByPk(id);

        if (!habilidad) {
            return res.status(404).json({ msg: "Habilidad no encontrada." });
        }

        await habilidad.destroy();
        res.status(200).json({ msg: "Habilidad eliminada exitosamente." });
    } catch (error) {
        console.error(`Error en eliminarHabilidad: ${error.message}`, error);
        res.status(500).json({
            msg: "Error interno del servidor al eliminar la habilidad."
        });
    }
};
