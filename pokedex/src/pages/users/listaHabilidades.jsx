import { useEffect, useState } from 'react';
import { listaHabilidades } from '../../services/habilidadService';
import { ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import '../../styles/listaHabilidades.css';

const ListaHabilidadesUsers = () => {
    const [habilidades, setHabilidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;
    return (
        <>
            <Header />
            <div className="habilidad-container">
                <h1>Habilidades</h1>
                <ListGroup>
                    {habilidades.map((habilidad) => (
                        <ListGroup.Item key={habilidad.id} className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <Link to={`/tipo/${habilidad.id}`} className="link-title">
                                    {habilidad.nombre}
                                </Link>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
            <Footer />
        </>
    );
};

export default ListaHabilidadesUsers;