"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/user/context/AuthContext';
import { Navbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
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
      fixed='top'
      className='shadow-sm'
      style={{ backgroundColor: '#431006' }}
    >
      <Container fluid className="px-2 px-lg-4">
        <Navbar.Brand as={Link} href="/user" className="py-0">
          <Image
            src="/assets/muchit.svg"
            alt="Logo"
            width={120}
            height={60}
            className="d-inline-block align-top"
            priority
            style={{ maxWidth: '120px', height: 'auto' }}
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

            {user ? (
              <NavDropdown
                title={`Hai, ${user.name}`}
                id="user-nav-dropdown"
                align="end"
                className="nav-link-custom"
              >
                <NavDropdown.Item as={Link} href="/user/mypage">
                  My Page
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link
                as={Link}
                href="/user/auth"
                className={`nav-link-custom ${isActive('/user/auth') ? 'active-link' : ''}`}
              >
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
