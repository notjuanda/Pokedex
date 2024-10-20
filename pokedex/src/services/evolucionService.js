import api from './api';

const validarId = (id) => {
    if (!id || isNaN(id) || id <= 0) {
        throw new Error('ID no válido. Debe ser un número positivo.');
    }
};

export const obtenerLineaEvolutiva = async (pokemon_id) => {
    try {
        console.log('pokemon_id:', pokemon_id);
        validarId(pokemon_id);

        const { data } = await api.get(`/evolucion/${pokemon_id}`);

        if (!data || !Array.isArray(data.evoluciones) || data.evoluciones.length === 0) {
            console.warn('No hay evoluciones registradas para este Pokémon.');
            return [];
        }
        return data.evoluciones;
    } catch (error) {
        console.error('Error al obtener la línea evolutiva:', error);
        throw new Error('No se pudo obtener la línea evolutiva del Pokémon.');
    }
};

export const verificarEvolucionDirecta = async (pokemon_id) => {
    try {
        const { data } = await api.get(`/evolucion/pokemon/${pokemon_id}/evolucionDirecta`);
        return data.tieneEvolucionDirecta;
    } catch (error) {
        console.error('Error al verificar la evolución directa:', error);
        throw new Error('No se pudo verificar la evolución directa del Pokémon.');
    }
};

export const asignarEvolucion = async (pokemon_id, pokemon_evolucionado_id, metodo, nivelEvolucion) => {
    try {
        if (!pokemon_id || !pokemon_evolucionado_id) {
            throw new Error('Se requieren ambos IDs para asignar una evolución.');
        }

        const { data } = await api.post('/evolucion/asignar', {
            pokemon_id,
            pokemon_evolucionado_id,
            metodo,
            nivelEvolucion,
        });

        console.log('Evolución asignada:', data);
        return data;
    } catch (error) {
        console.error('Error al asignar la evolución:', error);
        throw new Error('No se pudo asignar la evolución.');
    }
};

export const eliminarEvolucion = async (pokemon_id, pokemon_evolucionado_id) => {
    try {
        console.log('Intentando eliminar con IDs:', pokemon_id, pokemon_evolucionado_id);
        
        validarId(pokemon_id);
        validarId(pokemon_evolucionado_id);

        const { data } = await api.delete(
            `/evolucion/${pokemon_id}/${pokemon_evolucionado_id}`
        );

        console.log('Evolución eliminada:', data);
        return data;
    } catch (error) {
        console.error('Error al eliminar la evolución:', error);
        throw new Error('No se pudo eliminar la evolución.');
    }
};
