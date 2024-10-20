import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const isAdmin = location.pathname.includes('/admin');

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={NavLink} to={isAdmin ? "/admin" : "/"}>
                    {isAdmin ? 'Dashboard De Pokedex' : 'Pokedex'}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link 
                            as={NavLink} 
                            to={isAdmin ? "/admin/" : "/"} 
                            className="nav-link"
                        >
                            Pokemones
                        </Nav.Link>
                        <Nav.Link 
                            as={NavLink} 
                            to={isAdmin ? "/admin/tipos" : "/tipos"} 
                            className="nav-link"
                        >
                            Tipos
                        </Nav.Link>
                        <Nav.Link 
                            as={NavLink} 
                            to={isAdmin ? "/admin/habilidades" : "/habilidades"} 
                            className="nav-link"
                        >
                            Habilidades
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
