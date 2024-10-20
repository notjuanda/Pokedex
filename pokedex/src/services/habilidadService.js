import api from './api';

const validarId = (id) => {
    if (!id || isNaN(id) || id <= 0) {
        throw new Error('ID no válido. Debe ser un número positivo.');
    }
};

// Obtener todas las habilidades
export const listaHabilidades = async () => {
    try {
        const { data } = await api.get('/habilidades');
        return data;
    } catch (error) {
        console.error('Error al obtener la lista de habilidades:', error);
        throw new Error('No se pudo obtener la lista de habilidades.');
    }
};

// Obtener una habilidad por ID
export const listaHabilidadPorID = async (id) => {
    try {
        validarId(id);
        const { data } = await api.get(`/habilidades/${id}`);
        return data;
    } catch (error) {
        console.error('Error al obtener la habilidad:', error);
        throw new Error('No se pudo obtener la habilidad.');
    }
};

// Crear una nueva habilidad
export const crearHabilidad = async (habilidadData) => {
    try {
        const { data } = await api.post('/habilidades', habilidadData, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error) {
        console.error('Error al crear la habilidad:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudo crear la habilidad.'
        );
    }
};

// Editar una habilidad por ID
export const editarHabilidad = async (id, habilidadData) => {
    try {
        validarId(id);
        const { data } = await api.put(`/habilidades/${id}`, habilidadData, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error) {
        console.error('Error al editar la habilidad:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudo editar la habilidad.'
        );
    }
};

// Eliminar una habilidad por ID
export const eliminarHabilidad = async (id) => {
    try {
        validarId(id);
        const { data } = await api.delete(`/habilidades/${id}`);
        return data;
    } catch (error) {
        console.error('Error al eliminar la habilidad:', error);
        throw new Error('No se pudo eliminar la habilidad.');
    }
};
