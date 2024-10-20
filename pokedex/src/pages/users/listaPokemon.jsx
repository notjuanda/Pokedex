import { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/listaPokemones.css';
import { listaPokemones, buscarPokemon } from '../../services/pokemonService';
import { listaTiposDePokemon } from '../../services/pokemonTipoService';

const ListaPokemonesUsers = () => {
    const [pokemones, setPokemones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [noResultados, setNoResultados] = useState(false);

    useEffect(() => {
        getPokemones(); // Cargar los Pokémon al inicio
    }, []);

    const getTiposForPokemon = async (pokemon) => {
        try {
            const tipos = await listaTiposDePokemon(pokemon.id);
            return { ...pokemon, Tipos: tipos };
        } catch {
            return { ...pokemon, Tipos: [] }; // En caso de error, devolver sin tipos
        }
    };

    const getPokemones = async () => {
        setLoading(true);
        setError(null);
        setNoResultados(false);

        try {
            const response = await listaPokemones(); // Obtener todos los Pokémon
            const pokemonesWithTipos = await Promise.all(
                response.map((pokemon) => getTiposForPokemon(pokemon))
            );
            setPokemones(pokemonesWithTipos);
        } catch (error) {
            setError('Error al cargar la lista de Pokémon.');
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setNoResultados(false);

        try {
            const resultados = await buscarPokemon(query); // Buscar Pokémon según la query
            if (resultados.length === 0) {
                setNoResultados(true);
            } else {
                const resultadosWithTipos = await Promise.all(
                    resultados.map((pokemon) => getTiposForPokemon(pokemon))
                );
                setPokemones(resultadosWithTipos);
            }
        } catch (error) {
            setError('Ocurrió un error al realizar la búsqueda.');
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (number) => number.toString().padStart(3, '0');

    if (loading) return <Spinner animation="border" />;

    return (
        <div className="pokemones-container">
            <h1>Pokemones</h1>

            <Form className="mb-4" onSubmit={handleBuscar}>
                <Form.Group controlId="buscador">
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre, número o tipo"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                    Buscar
                </Button>
            </Form>

            {noResultados && (
                <Alert variant="warning" className="mt-2">
                    No se encontraron Pokémon que coincidan con la búsqueda.
                </Alert>
            )}

            {error && (
                <Alert variant="danger" className="mt-2">
                    {error}
                </Alert>
            )}

            <Row>
                {pokemones.map((pokemon) => (
                    <Col md={3} key={pokemon.id} className="pokemon-card">
                        <Card className="text-center card-custom">
                            <Card.Img
                                variant="top"
                                src={`http://localhost:3000${pokemon.imagen}`}
                                alt={pokemon.nombre}
                                className="pokemon-imagen"
                            />
                            <Card.Body>
                                <Card.Title className="card-title">
                                    <Link to={`/pokemones/${pokemon.id}`} className="link-title">
                                        {pokemon.nombre}
                                    </Link>
                                </Card.Title>
                                <Card.Text className="nro-pokedex">
                                    Nro Pokedex: {formatNumber(pokemon.nroPokedex)}
                                </Card.Text>
                                <div className="d-flex justify-content-center">
                                    {pokemon.Tipos && pokemon.Tipos.length > 0 ? (
                                        pokemon.Tipos.map((tipo) => (
                                            <div key={tipo.id}>
                                                <img
                                                    src={`http://localhost:3000${tipo.imagen}`}
                                                    alt={tipo.nombre}
                                                    style={{ width: '50px', height: '50px', marginRight: '8px' }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">Este Pokémon no tiene tipos asignados.</p>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ListaPokemonesUsers;
