'use client';

import Link from 'next/link';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

export default function NavbarComponent() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} href="/">Event Mikseru</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">Beranda</Nav.Link>
            <Nav.Link as={Link} href="/categories">Kategori</Nav.Link>
            <Nav.Link as={Link} href="/about">Tentang Kami</Nav.Link>
            <Nav.Link as={Link} href="/arsip">Arsip Event</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} href="/addevent">
              <Button variant="outline-light">Tambah Event</Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}