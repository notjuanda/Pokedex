import { useEffect, useState } from 'react';
import { Spinner, Alert, Row, Col, Button, Table} from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { obtenerPokemonConRangos } from '../../services/pokemonService';
import { listaTiposDePokemon } from '../../services/pokemonTipoService';
import { obtenerLineaEvolutiva } from '../../services/evolucionService';
import { listaHabilidadesDePokemon } from '../../services/pokemonHabilidadService';
import Header from '../../components/header';
import Footer from '../../components/footer';

const PokemonDetailUsers = () => {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [tipos, setTipos] = useState([]);
    const [evoluciones, setEvoluciones] = useState([]);
    const [habilidades, setHabilidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPokemonDetails = async () => {
            try {
                const pokemonData = await obtenerPokemonConRangos(id);
                setPokemon(pokemonData);

                const tiposData = await listaTiposDePokemon(id);
                setTipos(tiposData);

                const evolucionesData = await obtenerLineaEvolutiva(id);
                setEvoluciones(evolucionesData);

                const habilidadesData = await listaHabilidadesDePokemon(id);
                setHabilidades(habilidadesData);

            } catch (error) {
                setError('Error al cargar los datos del Pokémon.', error);
            } finally {
                setLoading(false);
            }
        };

        getPokemonDetails();
    }, [id]);

    const renderHabilidades = () => (
        <div className="d-flex flex-wrap justify-content-center">
            {habilidades.length > 0 ? (
                habilidades.map((habilidad) => (
                    <div key={habilidad.id} className="m-2 text-center">
                        <p>{habilidad.nombre}</p>
                    </div>
                ))
            ) : (
                <p className="text-muted">Este Pokémon no tiene habilidades asignadas.</p>
            )}
        </div>
    );    

    const renderEvoluciones = () => (
        <div className="d-flex flex-wrap justify-content-center">
            {evoluciones.length > 0 ? (
                evoluciones.map((evolucion) => (
                    <div key={evolucion.id} className="m-2 text-center">
                        <Link 
                            to={`/pokemones/${evolucion.id}`} 
                            className="d-block mb-2"
                        >
                            <img
                                src={`http://localhost:3000${evolucion.imagen}`}
                                alt={evolucion.nombre}
                                onError={(e) => (e.target.src = '/images/default-image.png')}
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <p>{evolucion.nombre}</p>
                            <p>{evolucion.nivelEvolucion}</p>
                        </Link>
                    </div>
                ))
            ) : (
                <p className="text-muted">Este Pokémon no tiene evoluciones registradas.</p>
            )}
        </div>
    );    
    
    const renderStatsTable = (stats) => (
        <Table bordered responsive>
            <thead>
                <tr>
                    <th>Stat</th>
                    <th>Base</th>
                    <th>En Lv. 50</th>
                    <th>En Lv. 100</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(stats).map(([stat, data]) => (
                    <tr key={stat}>
                        <td>{stat}</td>
                        <td>{pokemon[stat]}</td>
                        <td>{`${data.nivel_50.min} - ${data.nivel_50.max}`}</td>
                        <td>{`${data.nivel_100.min} - ${data.nivel_100.max}`}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
            <Header />
            <div className="container mt-4">
                <Row>
                    <Col md={4}>
                        <img
                            src={`http://localhost:3000${pokemon.imagen}`}
                            alt={pokemon.nombre}
                            className="img-fluid mb-3"
                        />
                        <h2>{pokemon.nombre}</h2>
                        <p>Número de Pokédex: {pokemon.nroPokedex}</p>
                        <p>Descripción: {pokemon.descripcion}</p>
                    </Col>
                    <Col md={8}>
                        <h2>Tipos</h2>
                        <div className="d-flex flex-wrap justify-content-center">
                            {tipos.map((tipo) => (
                                <div key={tipo.id} className="m-2 text-center">
                                    <p>{tipo.nombre}</p>
                                </div>
                            ))}
                        </div>
                        <h2 className="mt-4">Estadísticas</h2>
                        {renderStatsTable(pokemon.rangos)}
                        <h2 className="mt-4">Habilidades</h2>
                        {renderHabilidades()}
                        <h2 className="mt-4">Evoluciones</h2>
                        {renderEvoluciones()}
                    </Col>
                </Row>
                <Button variant="dark" as={Link} to="/pokemones" className="mt-3">
                    Volver a la lista
                </Button>
            </div>
            <Footer />
    </>
    );
};

export default PokemonDetailUsers;

