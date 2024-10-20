import { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/listaPokemones.css';
import { listaPokemones, buscarPokemon } from '../../services/pokemonService';
import { listaTiposDePokemon } from '../../services/pokemonTipoService';

const ListaPokemonesUsers = () => {
    const [pokemones, setPokemones] = useState([]);
    const [allPokemones, setAllPokemones] = useState([]); // Almacena todos los Pokémon
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState(''); // Estado para el término de búsqueda
    const [noResultados, setNoResultados] = useState(false); // Estado para manejar resultados vacíos

    useEffect(() => {
        getPokemones(); // Obtener los Pokémon al cargar la página
    }, []);

    const getPokemones = async () => {
        setLoading(true);
        setError(null);
        setNoResultados(false); // Restablecer estado de resultados vacíos
        try {
            const response = await listaPokemones();
            console.log(response);
            const pokemonesWithTipos = await Promise.all(
                response.map(async (pokemon) => {
                    const tipos = await listaTiposDePokemon(pokemon.id);
                    return { ...pokemon, tipos };
                })
            );
            setPokemones(pokemonesWithTipos);
            setAllPokemones(pokemonesWithTipos); // Guardar todos los Pokémon
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setNoResultados(false); // Restablecer estado de resultados vacíos

        try {
            const resultados = await buscarPokemon(query);
            console.log(resultados);
            if (resultados.length === 0) {
                setNoResultados(true);
                setPokemones(allPokemones);
            } else {
                setPokemones(resultados);
            }
        } catch (error) {
            setError('Ocurrió un error al realizar la búsqueda.');
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (number) => number.toString().padStart(3, '0');

    return (
        <>
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
                        Error: {error}
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
                                        {pokemon.tipos && pokemon.tipos.length > 0 ? (
                                            pokemon.tipos.map((tipo) => (
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
        </>
    );
};

export default ListaPokemonesUsers;
