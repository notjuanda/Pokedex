import { useEffect, useState } from 'react';
import { ListGroup, Spinner, Alert, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { listaTipos } from '../../services/tipoService';
import '../../styles/listaTipos.css';

const ListaTiposUsers = () => {
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    return (
        <>
            <Header />
            <div className="tipos-container">
                <h1>Tipos</h1>
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
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
            <Footer />
        </>
    );
};

export default ListaTiposUsers;
