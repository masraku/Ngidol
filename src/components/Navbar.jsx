'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/user/context/AuthContext';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Image from 'next/image';

export default function NavbarComponent() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      setUser(null);
      router.push('/user');
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <Navbar
      variant='dark'
      expand="lg"
      sticky='top'
      className='shadow-sm'
      style={{ backgroundColor: '#431006' }}
    >
      <Container>
        <Navbar.Brand as={Link} href="/user">
          <Image
            src="/assets/logo.svg"
            alt="Logo"
            width={250}
            height={125}
            className="d-inline-block align-top me-2"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={Link}
              href="/user"
              className={`nav-link-custom ${isActive('/user') ? 'active-link' : ''}`}
            >
              Beranda
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/user/chant"
              className={`nav-link-custom ${isActive('/user/chant') ? 'active-link' : ''}`}
            >
              Chant
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/user/about"
              className={`nav-link-custom ${isActive('/user/about') ? 'active-link' : ''}`}
            >
              Tentang Kami
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/user/arsip"
              className={`nav-link-custom ${isActive('/user/arsip') ? 'active-link' : ''}`}
            >
              Arsip Event
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/user/idol"
              className={`nav-link-custom ${isActive('/user/idol') ? 'active-link' : ''}`}
            >
              Idoru
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/user/auth"
              className={`nav-link-custom ${isActive('/user/auth') ? 'active-link' : ''}`}
            >
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}