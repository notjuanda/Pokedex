import api from './api';

// Validación de ID
const validarId = (id) => {
    if (!id || isNaN(id) || id <= 0) {
        throw new Error('ID no válido. Debe ser un número positivo.');
    }
};

// Obtener tipos de un Pokémon
export const listaTiposDePokemon = async (pokemon_id) => {
    try {
        validarId(pokemon_id);
        const { data } = await api.get(`/tipo/pokemon/${pokemon_id}`);
        return data;
    } catch (error) {
        console.error('Error al obtener los tipos del Pokémon:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudieron obtener los tipos del Pokémon.'
        );
    }
};

// Obtener Pokémon por tipo
export const listaPokemonPorTipo = async (tipo_id) => {
    try {
        validarId(tipo_id);
        const { data } = await api.get(`/tipo/${tipo_id}/pokemones`);
        return data;
    } catch (error) {
        console.error('Error al obtener los Pokémon del tipo:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudieron obtener los Pokémon del tipo.'
        );
    }
};

// Agregar Pokémon a un tipo
export const agregarPokemonATipo = async (pokemon_id, tipo_id) => {
    try {
        validarId(pokemon_id);
        validarId(tipo_id);
        const { data } = await api.post('/tipo/adicionar', { pokemon_id, tipo_id });
        return data;
    } catch (error) {
        console.error('Error al agregar el Pokémon al tipo:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudo agregar el Pokémon al tipo.'
        );
    }
};

// Editar tipo de un Pokémon
export const editarPokemonDeTipo = async (pokemon_id, tipo_id) => {
    try {
        validarId(pokemon_id);
        validarId(tipo_id);
        const { data } = await api.put(`/tipo/editar-tipo/${pokemon_id}`, { tipo_id });
        return data;
    } catch (error) {
        console.error('Error al editar el tipo del Pokémon:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudo editar el tipo del Pokémon.'
        );
    }
};

// Eliminar relación entre Pokémon y tipo
export const eliminarRelacionPokemonTipo = async (pokemon_id, tipo_id) => {
    try {
        validarId(pokemon_id);
        validarId(tipo_id);
        const { data } = await api.delete(`/tipo/${pokemon_id}/${tipo_id}`);
        return data;
    } catch (error) {
        console.error('Error al eliminar la relación entre Pokémon y Tipo:', error);
        throw new Error(
            error.response?.data?.msg || 'No se pudo eliminar la relación entre Pokémon y Tipo.'
        );
    }
};
