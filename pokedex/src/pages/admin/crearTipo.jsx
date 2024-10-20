import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { crearTipo, listaTiposPorID, editarTipo } from '../../services/tipoService';
import { Form, Button, Alert, Image, Col, Row } from 'react-bootstrap';
import Header from '../../components/header';
import Footer from '../../components/footer';
import '../../styles/crearTipo.css';

const CrearEditarTipo = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [ nombre, setNombre ] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenActual, setImagenActual] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        if (id) {
            const obtenerTipo = async () => {
                try {
                    const data = await listaTiposPorID(id);
                    setNombre(data.nombre || '');
                    setImagenActual(data.imagen || '');
                } catch (setError) {
                    setError('Error al cargar los datos del Tipo.');
                }
            };
            obtenerTipo();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tipoData = {
            nombre,
            imagen: imagen || imagenActual,
        };

        try {
            if (id) {
                await editarTipo(id, tipoData);
                console.log('Tipo actualizado exitosamente.', tipoData);
                setSuccessMessage('Tipo actualizado exitosamente.');
            } else {
                await crearTipo(tipoData);
                setSuccessMessage('Tipo creado exitosamente.');
            }
            navigate('/admin/tipos', { replace: true });
            window.location.reload();
        } catch (error) {
            setError(error.message || 'Error al guardar el Tipo.');
        }
    };

    const handleImageChange = (e) => {
        setImagen(e.target.files[0]);
    };

    return (
        <>
            <Header />
            <div className="crear-tipo-container">
                <h1>{id ? 'Editar Tipo' : 'Crear Tipo'}</h1>
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
                        {id ? 'Actualizar Tipo' : 'Crear Tipo'}
                    </Button>
                </Form>
            </div>
            <Footer />
        </>
    );
};

export default CrearEditarTipo;