import api from './api';

const validarId = (id) => {
    if (!id || isNaN(id) || id <= 0) {
        throw new Error('ID no válido. Debe ser un número positivo.');
    }
};

// Obtener habilidades de un Pokémon
export const listaHabilidadesDePokemon = async (pokemon_id) => {
    try {
        validarId(pokemon_id);
        const { data } = await api.get(`/habilidades/pokemon/${pokemon_id}`);

        if (!data || data.length === 0) {
            console.warn(`No se encontraron habilidades para el Pokémon con ID: ${pokemon_id}.`);
            return [];
        }

        return data;
    } catch (error) {
        console.error('Error al obtener las habilidades del Pokémon:', error);
        throw new Error('No se pudieron obtener las habilidades del Pokémon.');
    }
};

// Asignar habilidad a un Pokémon
export const asignarHabilidadAPokemon = async (pokemon_id, habilidad_id) => {
    try {
        validarId(pokemon_id);
        validarId(habilidad_id);

        const { data } = await api.post(`/habilidades/pokemon/${pokemon_id}/asignar`, {
            habilidad_id,
        });

        return data;
    } catch (error) {
        console.error('Error al asignar la habilidad al Pokémon:', error);
        throw new Error('No se pudo asignar la habilidad al Pokémon.');
    }
};

// Eliminar la relación entre Pokémon y una habilidad
export const eliminarRelacionPokemonHabilidad = async (pokemon_id, habilidad_id) => {
    try {
        validarId(pokemon_id);
        validarId(habilidad_id);

        const { data } = await api.delete(
            `/habilidades/pokemon/${pokemon_id}/habilidad/${habilidad_id}`
        );

        return data;
    } catch (error) {
        console.error('Error al eliminar la relación entre Pokémon y habilidad:', error);
        throw new Error('No se pudo eliminar la relación entre Pokémon y habilidad.');
    }
};
