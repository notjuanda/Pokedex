import { useEffect, useState } from 'react';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { agregarPokemonATipo } from '../../services/pokemonTipoService';
import { listaTipos } from '../../services/tipoService';
import '../../styles/agregarPokemonTipo.css';
import Header from '../../components/header';
import Footer from '../../components/footer';


const AgregarPokemonTipo = () => {
    const navigate = useNavigate();
    const { pokemonId } = useParams(); ;

    const [tipos, setTipos] = useState([]); 
    const [tipoSeleccionado, setTipoSeleccionado] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const obtenerTipos = async () => {
            try {
                const tiposDisponibles = await listaTipos();
                setTipos(tiposDisponibles);
            } catch (setError) {
                setError('Error al cargar los tipos.');
            }
        };

        obtenerTipos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tipoSeleccionado) {
            setError('Por favor, selecciona un tipo.');
            return;
        }

        try {
            await agregarPokemonATipo(pokemonId, tipoSeleccionado);
            setSuccessMessage('Tipo agregado exitosamente al Pokémon.');
            navigate(`/admin`);
        } catch (setError) {
            setError('Error al agregar el tipo al Pokémon.');
        }
    };

    return (
        <>
            <Header/>
            <div className="agregar-tipo-container">
                <h1>Agregar Tipo a un Pokémon</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={12} className="mb-3">
                            <Form.Group controlId="tipo">
                                <Form.Label>Selecciona un Tipo</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={tipoSeleccionado}
                                    onChange={(e) => setTipoSeleccionado(e.target.value)}
                                >
                                    <option value="">-- Selecciona un Tipo --</option>
                                    {tipos.map((tipo) => (
                                        <option key={tipo.id} value={tipo.id}>
                                            {tipo.nombre}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit">
                        Agregar Tipo
                    </Button>
                </Form>
            </div>
            <Footer/>
        </>
    );
};

export default AgregarPokemonTipo;
