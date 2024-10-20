const { where } = require("sequelize");
const db = require("../models");
const { Tipo } = db;

// Obtener lista de tipos
exports.listaTipos = async (req, res) => {
    try {
        const tipos = await Tipo.findAll();
        res.status(200).json(tipos);
    } catch (error) {
        console.error(`Error en listaTipos: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al obtener los tipos." });
    }
};

// Obtener tipo por ID
exports.listaTiposPorID = async (req, res) => {
    const { id } = req.params;

    try {
        const tipo = await Tipo.findByPk(id);

        if (!tipo) {
            return res.status(404).json({ msg: "Tipo no encontrado." });
        }

        res.status(200).json(tipo);
    } catch (error) {
        console.error(`Error en listaTiposPorID: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al obtener el tipo." });
    }
};

// Crear un tipo
exports.crearTipo = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string') {
        return res.status(400).json({ msg: "El nombre del tipo es obligatorio y debe ser un string." });
    }

    try {
        const tipoExistente = await Tipo.findOne({ where: { nombre } });
        if (tipoExistente) {
            return res.status(400).json({ msg: "El nombre del tipo ya existe." });
        }

        const nuevoTipo = await Tipo.create({ nombre });

        const imagenUrl = await subirImagenTipo(req, nuevoTipo.id);
        if (imagenUrl) {
            await nuevoTipo.update({ imagen: imagenUrl });
        }

        res.status(201).json({
            msg: "Tipo creado exitosamente.",
            tipo: { id: nuevoTipo.id, nombre: nuevoTipo.nombre, imagen: nuevoTipo.imagen },
        });
    } catch (error) {
        console.error(`Error en crearTipo: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al crear el tipo." });
    }
};

// Editar un tipo
exports.editarTipo = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string') {
        return res.status(400).json({ msg: "El nombre del tipo es obligatorio y debe ser un string." });
    }

    try {
        await Tipo.update({ nombre }, { where: { id } });

        const imagenUrl = await subirImagenTipo(req, id);
        if (imagenUrl) {
            await Tipo.update({ imagen: imagenUrl }, { where: { id } });
        }

        res.status(200).json({ msg: "Tipo actualizado exitosamente." });
    } catch (error) {
        console.error(`Error en editarTipo: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al actualizar el tipo." });
    }
};

// Eliminar un tipo
exports.eliminarTipo = async (req, res) => {
    const { id } = req.params;

    try {
        const tipo = await Tipo.findByPk(id);

        if (!tipo) {
            return res.status(404).json({ msg: "Tipo no encontrado." });
        }

        await tipo.destroy();
        res.status(200).json({ msg: "Tipo eliminado exitosamente." });
    } catch (error) {
        console.error(`Error en eliminarTipo: ${error.message}`, error);
        res.status(500).json({ msg: "Error interno al eliminar el tipo." });
    }
};

// Subir imagen del tipo
const subirImagenTipo = (req, idTipo) => {
    return new Promise((resolve, reject) => {
        if (!req.files?.imagen) {
            resolve(null);
            return;
        }

        const imagen = req.files.imagen;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(imagen.mimetype)) {
            reject({ msg: "Formato de imagen no válido." });
            return;
        }

        const imagePath = path.join(__dirname, '..', 'public', 'images', 'tipos', `${idTipo}.jpg`);
        imagen.mv(imagePath, (err) => {
            if (err) {
                reject({ msg: "Error al subir la imagen.", error: err });
            } else {
                resolve(`/images/tipos/${idTipo}.jpg`);
            }
        });
    });
};
