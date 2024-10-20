import { useEffect, useState } from 'react';
import { Spinner, Alert, Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { obtenerPokemonConRangos } from '../../services/pokemonService';
import { listaTiposDePokemon, eliminarRelacionPokemonTipo } from '../../services/pokemonTipoService';
import { obtenerLineaEvolutiva, asignarEvolucion, eliminarEvolucion, verificarEvolucionDirecta } from '../../services/evolucionService';
import { listaHabilidadesDePokemon, asignarHabilidadAPokemon, eliminarRelacionPokemonHabilidad } from '../../services/pokemonHabilidadService';
import { listaPokemones } from '../../services/pokemonService';
import { listaHabilidades } from '../../services/habilidadService';
import Header from '../../components/header';
import Footer from '../../components/footer';

const PokemonDetail = () => {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [tipos, setTipos] = useState([]);
    const [evoluciones, setEvoluciones] = useState([]);
    const [evolucionesNew, setEvolucionesNew] = useState([]);

    const [habilidades, setHabilidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [allPokemones, setAllPokemones] = useState([]);
    const [allHabilidades, setAllHabilidades] = useState([]);
    const [newEvolucionId, setNewEvolucionId] = useState('');
    const [newHabilidadId, setNewHabilidadId] = useState('');
    const [showEvolucionModal, setShowEvolucionModal] = useState(false);
    const [showHabilidadModal, setShowHabilidadModal] = useState(false);

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

                const allPokemonesData = await listaPokemones();
                setAllPokemones(allPokemonesData.filter(p => p.id !== parseInt(id)));

                const allHabilidadesData = await listaHabilidades();
                setAllHabilidades(
                    allHabilidadesData.filter(
                        (h) => !habilidadesData.some((hab) => hab.id === h.id)
                    )
                );
            } catch (error) {
                setError('Error al cargar los datos del Pokémon.', error);
            } finally {
                setLoading(false);
            }
        };

        getPokemonDetails();
    }, [id]);

    const handleAsignarEvolucion = async () => {
        try {
            const tieneEvolucionDirecta = await verificarEvolucionDirecta(id);
            if (tieneEvolucionDirecta) {
                alert('Este Pokémon ya tiene una evolución asignada. No puede tener más de una.');
                return;
            }
            await asignarEvolucion(id, newEvolucionId);
            const nuevasEvoluciones = await obtenerLineaEvolutiva(id);
            setEvoluciones(nuevasEvoluciones);
            setShowEvolucionModal(false);
        } catch (error) {
            console.error('Error al asignar la evolución:', error);
            alert('Error al asignar la evolución. Verifica los datos e intenta nuevamente.');
        }
    };     

    const handleAsignarHabilidad = async () => {
        try {
            const habilidadesData = await listaHabilidadesDePokemon(id);
            const habilidadYaAsignada = habilidadesData.some(
                (habilidad) => habilidad.id === parseInt(newHabilidadId)
            );
            if (habilidadYaAsignada) {
                alert('Esta habilidad ya está asignada a este Pokémon.');
                return; 
            }
            await asignarHabilidadAPokemon(id, newHabilidadId);
            const nuevasHabilidades = await listaHabilidadesDePokemon(id);
            setHabilidades(nuevasHabilidades);
            setShowHabilidadModal(false);
        } catch (error) {
            alert('Error al asignar la habilidad.', error);
        }
    };
    
    const handleEliminarEvolucion = async (idEliminar) => {
        try {
            const pokemonActualId = id; 
            const evoluciones = await obtenerLineaEvolutiva(pokemonActualId);
            setEvolucionesNew(evoluciones);
            console.log('[LOG] Evoluciones extraídas:', evolucionesNew);
            if (!Array.isArray(evoluciones) || evoluciones.length === 0) {
                alert('No se encontró la línea evolutiva.');
                return;
            }
            const ids = evoluciones.map(evo => evo.id);
            console.log('[LOG] IDs extraídos:', ids);
            const [id1, id2, id3] = ids;
            let pokemonId1, pokemonId2;
            if (pokemonActualId == id1 && idEliminar == id2) {
                pokemonId1 = id1;
                pokemonId2 = id2;
            } else if (pokemonActualId == id1 && idEliminar == id3) {
                pokemonId1 = id2;
                pokemonId2 = id3;
            } else if (pokemonActualId == id2 && idEliminar == id1) {
                pokemonId1 = id1;
                pokemonId2 = id2;
            } else if (pokemonActualId == id2 && idEliminar == id3) {
                pokemonId1 = id2;
                pokemonId2 = id3;
            } else if (pokemonActualId == id3 && idEliminar == id2) {
                pokemonId1 = id2;
                pokemonId2 = id3;
            } else if (pokemonActualId == id3 && idEliminar == id1) {
                pokemonId1 = id1;
                pokemonId2 = id2;
            } else {
                alert('No se encontró ninguna relación válida para eliminar.');
                return;
            }
            await eliminarEvolucion(pokemonId1, pokemonId2);
            const nuevasEvoluciones = await obtenerLineaEvolutiva(pokemonActualId);
        setEvolucionesNew(nuevasEvoluciones);
        alert('Evolución eliminada exitosamente.');

    } catch (error) {
        alert('Error al eliminar la evolución. Verifica los datos e intenta nuevamente.', error);
        }
    };
    
    
    const handleEliminarHabilidad = async (habilidadId) => {
        try {
            await eliminarRelacionPokemonHabilidad(id, habilidadId);
            const habilidadesData = await listaHabilidadesDePokemon(id);
            setHabilidades(habilidadesData);
            window.location.reload();
        } catch (error) {
            alert('Error al eliminar la habilidad.', error);
        }
    };

    const handleEliminarTipo = async (tipoId) => {
        try {
            await eliminarRelacionPokemonTipo(id, tipoId);
            const tiposData = await listaTiposDePokemon(id);
            setTipos(tiposData);
            window.location.reload();
        } catch (error) {
            alert('Error al eliminar el tipo.', error);
        }
    }

    const renderHabilidades = () => (
        <div className="d-flex flex-wrap justify-content-center">
            {habilidades.length > 0 ? (
                habilidades.map((habilidad) => (
                    <div key={habilidad.id} className="m-2 text-center">
                        <p>{habilidad.nombre}</p>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => handleEliminarHabilidad(habilidad.id)}
                        >
                            Eliminar Habilidad
                        </Button>
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
                            to={`/admin/pokemones/${evolucion.id}`} 
                            className="d-block mb-2"
                        >
                            <img
                                src={`http://localhost:3000${evolucion.imagen}`}
                                alt={evolucion.nombre}
                                onError={(e) => (e.target.src = '/images/default-image.png')}
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <p>{evolucion.nombre}</p>
                        </Link>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => handleEliminarEvolucion(evolucion.id)}
                        >
                            Eliminar Evolución
                        </Button>
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
                        <p>
                            {pokemon.nivelEvolucion && pokemon.nivelEvolucion > 1
                                ? `Este Pokémon evoluciona al nivel ${pokemon.nivelEvolucion}`
                                : ''}
                        </p>
                    </Col>

                    <Col md={8}>
                        <h2>Tipos</h2>
                        <div className="d-flex flex-wrap justify-content-center">
                            {tipos.map((tipo) => (
                                <div key={tipo.id} className="m-2 text-center">
                                    <img 
                                        src={`http://localhost:3000${tipo.imagen}`}
                                        alt={tipo.nombre} 
                                        style={{ width: '50px', height: '50px', marginRight: '8px' }} 
                                    />
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        className="mt-2"
                                        onClick={() => handleEliminarTipo(tipo.id)}>
                                        Eliminar Tipo
                                    </Button>
                                </div>
                                
                            ))}
                        </div>

                        <h2 className="mt-4">Estadísticas</h2>
                        {renderStatsTable(pokemon.rangos)}

                        <h2 className="mt-4">Habilidades</h2>
                        {renderHabilidades()}
                        <Button variant="primary" className="mt-2" onClick={() => setShowHabilidadModal(true)}>
                            Asignar Habilidad
                        </Button>

                        <h2 className="mt-4">Evoluciones</h2>
                        {renderEvoluciones()}
                        <Button variant="primary" className="mt-2" onClick={() => setShowEvolucionModal(true)}>
                            Asignar Evolución
                        </Button>
                    </Col>
                </Row>
                <Button variant="dark" as={Link} to="/pokemones" className="mt-3">
                    Volver a la lista
                </Button>
            </div>
            <Footer />

            <Modal show={showEvolucionModal} onHide={() => setShowEvolucionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Asignar Evolución</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Selecciona un Pokémon</Form.Label>
                        <Form.Select onChange={(e) => setNewEvolucionId(e.target.value)}>
                            <option value="">Selecciona</option>
                            {allPokemones
                        .filter((poke) => !evoluciones.some((evo) => evo.id === poke.id))
                        .map((poke) => (
                            <option key={poke.id} value={poke.id}>
                                {poke.nombre}
                            </option>
                        ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEvolucionModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAsignarEvolucion}>
                        Asignar Evolución
                    </Button>
                    </Modal.Footer>
        </Modal>

        <Modal show={showHabilidadModal} onHide={() => setShowHabilidadModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Asignar Habilidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Selecciona una Habilidad</Form.Label>
                    <Form.Select onChange={(e) => setNewHabilidadId(e.target.value)}>
                        <option value="">Selecciona</option>
                        {allHabilidades.map((habilidad) => (
                            <option key={habilidad.id} value={habilidad.id}>
                                {habilidad.nombre}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowHabilidadModal(false)}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleAsignarHabilidad}>
                    Asignar Habilidad
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
};

export default PokemonDetail;

