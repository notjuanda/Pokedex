import api from './api';

// Validación de ID
const validarId = (id) => {
    if (!id || isNaN(id) || id <= 0) {
        throw new Error('ID no válido. Debe ser un número positivo.');
    }
};

// Crear Pokémon
export const crearPokemon = async (pokemonData) => {
    try {
        const { data } = await api.post('/pokemon', pokemonData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    } catch (error) {
        console.error('Error al crear el Pokémon:', error);
        throw new Error(error.response?.data?.message || 'No se pudo crear el Pokémon.');
    }
};

// Listar todos los Pokémon
export const listaPokemones = async () => {
    try {
        const { data } = await api.get('/pokemon');
        return data;
    } catch (error) {
        console.error('Error al obtener la lista de Pokémon:', error);
        throw new Error('No se pudo obtener la lista de Pokémon.');
    }
};

// Obtener Pokémon por ID
export const listaPokemonPorID = async (id) => {
    try {
        validarId(id);
        const { data } = await api.get(`/pokemon/${id}`);
        return data;
    } catch (error) {
        console.error('Error al obtener el Pokémon:', error);
        throw new Error('No se pudo obtener el Pokémon.');
    }
};

// Editar Pokémon
export const editarPokemon = async (id, pokemonData) => {
    try {
        validarId(id);
        const { data } = await api.put(`/pokemon/${id}`, pokemonData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    } catch (error) {
        console.error('Error al editar el Pokémon:', error);
        throw new Error(error.response?.data?.message || 'No se pudo editar el Pokémon.');
    }
};

// Eliminar Pokémon
export const eliminarPokemon = async (id) => {
    try {
        validarId(id);
        const { data } = await api.delete(`/pokemon/${id}`);
        return data;
    } catch (error) {
        console.error('Error al eliminar el Pokémon:', error);
        throw new Error('No se pudo eliminar el Pokémon.');
    }
};

// Obtener Pokémon con rangos de estadísticas
export const obtenerPokemonConRangos = async (id) => {
    try {
        validarId(id);
        const { data } = await api.get(`/pokemon/${id}/rango`);
        return data;
    } catch (error) {
        console.error('Error al obtener los rangos del Pokémon:', error);
        throw new Error('No se pudieron obtener los rangos del Pokémon.');
    }
};
