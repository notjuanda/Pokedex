import { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/listaPokemones.css';
import { eliminarPokemon, listaPokemones } from '../../services/pokemonService';
import { listaTiposDePokemon } from '../../services/pokemonTipoService'; 
import Header from '../../components/header';
import Footer from '../../components/footer';

const ListaPokemones = () => {
    const [pokemones, setPokemones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const getPokemones = async () => {
            try {
                const response = await listaPokemones();
                const pokemonesWithTipos = await Promise.all(
                    response.map(async (pokemon) => {
                        const tipos = await listaTiposDePokemon(pokemon.id);
                        
                        return { ...pokemon, tipos };
                    })
                );
                setPokemones(pokemonesWithTipos);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getPokemones();
    }, []);

    const handleEliminar = async (id) => {
        try {
            await eliminarPokemon(id);
            setPokemones(pokemones.filter((pokemon) => pokemon.id !== id));
            setSuccessMessage('Pokémon eliminado con éxito.');
        } catch {
            setError('Error al eliminar el Pokémon.');
        }
    };

    const formatNumber = (number) => number.toString().padStart(4, '0');

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    return (
        <>
            <Header />
            <div className="pokemones-container">
                <h1>Pokemones</h1>
                <Button
                    variant="success"
                    as={Link}
                    to="/admin/pokemon/crear"
                    className="mb-3"
                >
                    Agregar Pokémon
                </Button>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
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
                                        <Link to={`/admin/pokemones/${pokemon.id}`} className="link-title">
                                            {pokemon.nombre}
                                        </Link>
                                    </Card.Title>
                                    <Card.Text className="nro-pokedex">
                                        #{formatNumber(pokemon.nroPokedex)}
                                    </Card.Text>
                                    <div className="d-flex justify-content-center">
                                        {pokemon.tipos.length > 0 ? (
                                            pokemon.tipos.map((tipo) => (
                                                <div
                                                    key={tipo.id}
                                                >
                                                    <img 
                                                        src={`http://localhost:3000${tipo.imagen}`}
                                                        alt={tipo.nombre} 
                                                        style={{ width: '50px', height: '50px', marginRight: '8px' }} 
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted">
                                                Este Pokémon no tiene tipos asignados.
                                            </p>
                                        )}
                                    </div>
                                    <div className="buttons mt-3">
                                        <Button
                                            variant="success"
                                            as={Link}
                                            to={`/admin/pokemon/editar/${pokemon.id}`}
                                            className="me-2"
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            as={Link}
                                            to={`/admin/adicionar/${pokemon.id}`}
                                            variant = "dark"
                                        >
                                            Asignar tipo
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleEliminar(pokemon.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
            <Footer />
        </>
    );
};

export default ListaPokemones;
