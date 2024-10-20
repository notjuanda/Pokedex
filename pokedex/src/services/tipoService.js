import api from './api';

// Validación de ID
const validarId = (id) => {
    if (!id || isNaN(id) || id <= 0) {
        throw new Error('ID no válido. Debe ser un número positivo.');
    }
};

// Obtener lista de tipos
export const listaTipos = async () => {
    try {
        const { data } = await api.get('/tipo');
        return data;
    } catch (error) {
        console.error('Error al obtener la lista de tipos:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudo obtener la lista de tipos.'
        );
    }
};

// Obtener tipo por ID
export const listaTiposPorID = async (id) => {
    try {
        validarId(id);
        const { data } = await api.get(`/tipo/${id}`);
        return data;
    } catch (error) {
        console.error('Error al obtener el tipo por ID:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudo obtener el tipo por ID.'
        );
    }
};

// Crear un tipo
export const crearTipo = async (tipoData) => {
    try {
        const { data } = await api.post('/tipo', tipoData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    } catch (error) {
        console.error('Error al crear el Tipo:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudo crear el Tipo.'
        );
    }
};

// Editar un tipo
export const editarTipo = async (id, tipoData) => {
    try {
        validarId(id);
        const { data } = await api.put(`/tipo/${id}`, tipoData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    } catch (error) {
        console.error('Error al editar el Tipo:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudo editar el Tipo.'
        );
    }
};

// Eliminar un tipo
export const eliminarTipo = async (id) => {
    try {
        validarId(id);
        const { data } = await api.delete(`/tipo/${id}`);
        return data;
    } catch (error) {
        console.error('Error al eliminar el tipo:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudo eliminar el tipo.'
        );
    }
};
