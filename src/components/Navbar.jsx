'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

export default function NavbarComponent() {
  const { user, setUser, fetchUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      setUser(null);
      router.push('/');
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} href="/">EventKu by Mikseru</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">Beranda</Nav.Link>
            <Nav.Link as={Link} href="/categories">Kategori</Nav.Link>
            <Nav.Link as={Link} href="/about">Tentang Kami</Nav.Link>
            <Nav.Link as={Link} href="/arsip">Arsip Event</Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            {user ? (
              <>
                <Nav.Link as={Link} href="/addevent">
                  <Button variant="outline-light" className="me-2">Tambah Event</Button>
                </Nav.Link>
                <Button variant="danger" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Nav.Link as={Link} href="/auth">
                <Button variant="outline-light">Login</Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
