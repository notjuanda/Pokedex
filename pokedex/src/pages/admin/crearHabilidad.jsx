import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { crearHabilidad, listaHabilidadPorID, editarHabilidad } from '../../services/habilidadService';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import Header from '../../components/header';
import Footer from '../../components/footer';
import '../../styles/crearHabilidad.css';

const CrearEditarHabilidad = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [ nombre, setNombre ] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        if (id) {
            const obtenerTipo = async () => {
                try {
                    const data = await listaHabilidadPorID(id);
                    setNombre(data.nombre || '');
                } catch (setError) {
                    setError('Error al cargar los datos de la Habilidad.');
                }
            };
            obtenerTipo();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const habilidadData = {
            nombre,
        };

        try {
            if (id) {
                await editarHabilidad(id, habilidadData);
                console.log('Habilidad actualizada exitosamente.', habilidadData);
                setSuccessMessage('Habilidad actualizada exitosamente.');
            } else {
                await crearHabilidad(habilidadData);
                setSuccessMessage('Habilidad creada exitosamente.');
            }
            navigate('/admin/habilidades', { replace: true });
            window.location.reload();
        } catch (error) {
            setError(error.message || 'Error al guardar la Habilidad.');
        }
    };

    return (
        <>
            <Header />
            <div className="crear-habilidad-container">
                <h1>{id ? 'Editar Habilidad' : 'Crear Habilidad'}</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group controlId="nombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit">
                        {id ? 'Actualizar Habilidad' : 'Crear Habilidad'}
                    </Button>
                </Form>
            </div>
            <Footer />
        </>
    );
};

export default CrearEditarHabilidad;