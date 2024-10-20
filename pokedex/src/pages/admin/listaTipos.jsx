import { useEffect, useState } from 'react';
import { ListGroup, Spinner, Alert, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { listaTipos, eliminarTipo } from '../../services/tipoService';
import '../../styles/listaTipos.css';

const ListaTipos = () => {
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const getTipos = async () => {
            try {
                const response = await listaTipos();
                setTipos(response);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        getTipos();
    }, []);

    const handleEliminar = async (id) => {
        try {
            await eliminarTipo(id);
            setTipos(tipos.filter((tipo) => tipo.id !== id));
            setSuccessMessage('Tipo eliminado con éxito.');
        } catch {
            setError('Error al eliminar el tipo.');
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    return (
        <>
            <Header />
            <div className="tipos-container">
                <h1>Tipos</h1>
                <Button
                    variant="success"
                    as={Link}
                    to="/admin/tipo/crear"
                    className="mb-3"
                >
                    Agregar Tipo
                </Button>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <ListGroup>
                    {tipos.map((tipo) => (
                        <ListGroup.Item key={tipo.id} className="d-flex align-items-center">
                            <Image
                                src={`http://localhost:3000${tipo.imagen}`}
                                alt={tipo.nombre}
                                roundedCircle
                                style={{ width: '50px', height: '50px', marginRight: '15px' }}
                            />
                            <div className="flex-grow-1">
                                <Link to={`/tipo/${tipo.id}`} className="link-title">
                                    {tipo.nombre}
                                </Link>
                            </div>
                            <div className="button-group">
                                <Button
                                    variant="success"
                                    as={Link}
                                    to={`/admin/tipo/editar/${tipo.id}`}
                                    className="me-2"
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleEliminar(tipo.id)}
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

export default ListaTipos;
