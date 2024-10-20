import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const location = useLocation();

    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <footer className="bg-dark text-light py-3 mt-auto">
            <Container>
                <Row>
                    <Col className="text-center">
                        <p>&copy; {currentYear} {isAdmin ? 'Dashboard de Pokedex' : 'Pokedex App'}.</p>
                        <p>
                            <Link 
                                to={isAdmin ? '/admin/' : '/'} 
                                className="text-light text-decoration-none"
                            >
                                Pokemones
                            </Link> 
                            {' | '}
                            <Link 
                                to={isAdmin ? '/admin/tipos' : '/tipos'} 
                                className="text-light text-decoration-none"
                            >
                                Tipos
                            </Link> 
                            {' | '}
                            <Link 
                                to={isAdmin ? '/admin/habilidades' : '/habilidades'} 
                                className="text-light text-decoration-none"
                            >
                                Habilidades
                            </Link> 
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
