import { useEffect, useState } from 'react';
import { Spinner, Alert, Row, Col, Button, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { obtenerPokemonConRangos } from '../../services/pokemonService';
import { listaTiposDePokemon } from '../../services/pokemonTipoService';
import { obtenerLineaEvolutiva } from '../../services/evolucionService';
import { listaHabilidadesDePokemon } from '../../services/pokemonHabilidadService';
import Header from '../../components/header';
import Footer from '../../components/footer';
import '../../styles/pokemonDetail.css';

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

    const renderListGroup = (items, itemName) => {
        if (!Array.isArray(items) || items.length === 0) {
            return <p className="text-muted">Este Pokémon no tiene {itemName} asignadas.</p>;
        }
        return (
            <div className="list-group-horizontal justify-content-center">
                {items.map((item) => (
                    <div key={item.id} className="list-group-item">
                        {item.imagen && (
                            <img
                                src={`http://localhost:3000${item.imagen}`}
                                alt={item.nombre}
                                className="tipo-imagen"
                            />
                        )}
                        {item.nombre}
                    </div>
                ))}
            </div>
        );
    };

    const renderStatsTable = (stats) => {
        return (
            <Table bordered className="stats-table">
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
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
            <Header />
            <div className="pokemon-detail-container">
                <Row>
                    <Col md={4}>
                        <img
                            src={`http://localhost:3000${pokemon.imagen}`}
                            alt={pokemon.nombre}
                            className="pokemon-imagen"
                        />
                        <h2>{pokemon.nombre}</h2>
                        <p>Número de Pokédex: {pokemon.nroPokedex}</p>
                        <p>Descripción: {pokemon.descripcion}</p>
                    </Col>
                    <Col md={8}>
                        <h2>Tipos</h2>
                        {renderListGroup(tipos, 'tipos')}

                        <h2 className="mt-4">Estadísticas</h2>
                        {renderStatsTable(pokemon.rangos)}

                        <h2 className="mt-4">Habilidades</h2>
                        {renderListGroup(habilidades, 'habilidades')}

                        <h2 className="mt-4">Evoluciones</h2>
                        {renderListGroup(evoluciones, 'evoluciones')}
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
