import { useEffect, useState } from 'react';
import { Form, Button, Alert, Image, Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/crearPokemon.css';
import { crearPokemon, listaPokemonPorID, editarPokemon } from '../../services/pokemonService';
import Header from '../../components/header';
import Footer from '../../components/footer';

const CrearEditarPokemon = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [nombre, setNombre] = useState('');
    const [nroPokedex, setNroPokedex] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [hp, setHp] = useState('');
    const [ataque, setAtaque] = useState('');
    const [defensa, setDefensa] = useState('');
    const [spAtaque, setSpAtaque] = useState('');
    const [spDefensa, setSpDefensa] = useState('');
    const [velocidad, setVelocidad] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenActual, setImagenActual] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (id) {
            const obtenerPokemon = async () => {
                try {
                    const data = await listaPokemonPorID(id);
                    setNombre(data.nombre || '');
                    setNroPokedex(data.nroPokedex || '');
                    setDescripcion(data.descripcion || '');
                    setHp(data.hp || '');
                    setAtaque(data.ataque || '');
                    setDefensa(data.defensa || '');
                    setSpAtaque(data.spAtaque || '');
                    setSpDefensa(data.spDefensa || '');
                    setVelocidad(data.velocidad || '');
                    setImagenActual(data.imagen || '');
                } catch (setError) {
                    setError('Error al cargar los datos del Pokémon.');
                }
            };
            obtenerPokemon();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const pokemonData = {
            nombre,
            nroPokedex,
            descripcion,
            hp: hp,
            ataque: ataque,
            defensa: defensa,
            spAtaque: spAtaque,
            spDefensa: spDefensa,
            velocidad : velocidad ,
            imagen: imagen || imagenActual,
        };

        try {
            if (id) {
                await editarPokemon(id, pokemonData);
                console.log('Pokemon actualizado exitosamente.', pokemonData);
                setSuccessMessage('Pokémon actualizado exitosamente.');
            } else {
                await crearPokemon(pokemonData);
                setSuccessMessage('Pokémon creado exitosamente.');
            }
            navigate('/admin', { replace: true });
            window.location.reload();
        } catch (error) {
            setError(error.message || 'Error al guardar el Pokémon.');
        }
    };

    const handleImageChange = (e) => {
        setImagen(e.target.files[0]);
    };

    return (
        <>
            <Header />
            <div className="crear-pokemon-container">
                <h1>{id ? 'Editar Pokémon' : 'Crear Pokémon'}</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Group controlId="nombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group controlId="nroPokedex">
                                <Form.Label>Número de Pokedex</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={nroPokedex}
                                    onChange={(e) => setNroPokedex(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12} className="mb-3">
                            <Form.Group controlId="descripcion">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4} className="mb-3">
                            <Form.Group controlId="hp">
                                <Form.Label>HP</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={hp}
                                    onChange={(e) => setHp(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4} className="mb-3">
                            <Form.Group controlId="ataque">
                                <Form.Label>Ataque</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={ataque}
                                    onChange={(e) => setAtaque(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4} className="mb-3">
                            <Form.Group controlId="defensa">
                                <Form.Label>Defensa</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={defensa}
                                    onChange={(e) => setDefensa(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4} className="mb-3">
                            <Form.Group controlId="spAtaque">
                                <Form.Label>Ataque Especial</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={spAtaque}
                                    onChange={(e) => setSpAtaque(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4} className="mb-3">
                            <Form.Group controlId="spDefensa">
                                <Form.Label>Defensa Especial</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={spDefensa}
                                    onChange={(e) => setSpDefensa(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4} className="mb-3">
                            <Form.Group controlId="velocidad">
                                <Form.Label>Velocidad</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={velocidad}
                                    onChange={(e) => setVelocidad(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12} className="mb-3">
                            <Form.Group controlId="imagen">
                                <Form.Label>Seleccionar Imagen</Form.Label>
                                <Form.Control type="file" onChange={handleImageChange} />
                            </Form.Group>
                            {imagenActual && (
                                <div>
                                    <Form.Label>Imagen Actual</Form.Label>
                                    <Image
                                        src={`http://localhost:3000${imagenActual}`}
                                        alt="Imagen actual"
                                        thumbnail
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit">
                        {id ? 'Actualizar Pokémon' : 'Crear Pokémon'}
                    </Button>
                </Form>
            </div>
            <Footer />
        </>
    );
};

export default CrearEditarPokemon;
