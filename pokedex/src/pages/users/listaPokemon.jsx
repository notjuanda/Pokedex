import { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/listaPokemones.css';
import { listaPokemones } from '../../services/pokemonService';
import { listaTiposDePokemon } from '../../services/pokemonTipoService'; 

const ListaPokemonesUsers = () => {
    const [pokemones, setPokemones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    const formatNumber = (number) => {
        return number.toString().padStart(3, '0');
    };

    return (
        <>
            <div className="pokemones-container">
                <h1>Pokemones</h1>
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
