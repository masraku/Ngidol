'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Image from 'next/image';

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
    <Navbar
      variant='dark'
      expand="lg"
      sticky='top'
      className='shadow-sm'
      style={{ backgroundColor: '#431006' }}>
      <Container>
        <Navbar.Brand as={Link} href="/">
          <Image src="/assets/logo.svg" alt="Logo" width={250} height={125} className="d-inline-block align-top me-2" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} href="/" className="nav-link-custom">Beranda</Nav.Link>
            <Nav.Link as={Link} href="/chant" className="nav-link-custom">Chant</Nav.Link>
            <Nav.Link as={Link} href="/about" className="nav-link-custom">Tentang Kami</Nav.Link>
            <Nav.Link as={Link} href="/arsip" className="nav-link-custom">Arsip Event</Nav.Link>

            {user ? (
              <>
                <Nav.Link as={Link} href="/addevent" className="nav-link-custom">Tambah Event</Nav.Link>
                <Nav.Link onClick={handleLogout} className="nav-link-custom" style={{ cursor: 'pointer' }}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} href="/auth" className="nav-link-custom">Login</Nav.Link>
            )}
          </Nav>

        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}
