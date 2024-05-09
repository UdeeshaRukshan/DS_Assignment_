import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="d-flex justify-content-between">
                <Navbar.Brand href="/" className="mr-auto">SkillHub</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="float-end">
                    <Nav className="ml-auto mx-auto">
                        <Nav.Link href="/signup" className="text-light">Signup</Nav.Link>
                        <Nav.Link href="/login" className="text-light">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
