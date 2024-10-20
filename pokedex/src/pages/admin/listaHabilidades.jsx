import { useEffect, useState } from 'react';
import { eliminarHabilidad, listaHabilidades } from '../../services/habilidadService';
import { ListGroup, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import '../../styles/listaHabilidades.css';

const ListaHabilidades = () => {
    const [habilidades, setHabilidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const getHabilidades = async () => {
            try {
                const response = await listaHabilidades();
                setHabilidades(response);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        getHabilidades();
    }, []);

    const handleEliminar = async (id) => {
        try {
            await eliminarHabilidad(id);
            setHabilidades(habilidades.filter((habilidad) => habilidad.id !== id));
            setSuccessMessage('Habilidad eliminado con éxito.');
        } catch {
            setError('Error al eliminar el tipo.');
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;
    return (
        <>
            <Header />
            <div className="habilidad-container">
                <h1>Habilidades</h1>
                <Button
                    variant="success"
                    as={Link}
                    to="/admin/habilidad/crear"
                    className="mb-3"
                >
                    Agregar Habilidad
                </Button>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <ListGroup>
                    {habilidades.map((habilidad) => (
                        <ListGroup.Item key={habilidad.id} className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <Link to={`/tipo/${habilidad.id}`} className="link-title">
                                    {habilidad.nombre}
                                </Link>
                            </div>
                            <div className="button-group">
                                <Button
                                    variant="success"
                                    as={Link}
                                    to={`/admin/habilidad/editar/${habilidad.id}`}
                                    className="me-2"
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleEliminar(habilidad.id)}
                                    className="me-2"
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
            <Footer />
        </>
    );
};

export default ListaHabilidades;