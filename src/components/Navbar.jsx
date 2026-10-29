"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/user/context/AuthContext';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import Image from 'next/image';

export default function NavbarComponent() {
  const auth = useAuth() || {};
  const { user, setUser } = auth;
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      setUser?.(null);
      router.push('/user');
    }
  };

  const isActive = (path, exact = false) => (
    exact ? pathname === path : pathname === path || pathname.startsWith(`${path}/`)
  );

  return (
    <Navbar
      variant="light"
      expand="lg"
      sticky="top"
      collapseOnSelect
      className="community-navbar"
    >
      <Container fluid className="community-navbar__inner">
        <Navbar.Brand as={Link} href="/user" className="community-brand">
          <Image
            src="/assets/muchit.svg"
            alt="Muchitsujo"
            width={78}
            height={36}
            priority
          />
          <span>Community</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="community-navbar-nav" />
        <Navbar.Collapse id="community-navbar-nav">
          <Nav className="ms-auto align-items-lg-center community-nav-links">
            <Nav.Link
              as={Link}
              href="/user"
              className={`nav-link-custom ${isActive('/user', true) ? 'active-link' : ''}`}
            >
              Beranda
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/user#jadwal"
              className="nav-link-custom"
            >
              Jadwal
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/user#kegiatan"
              className="nav-link-custom"
            >
              Kegiatan
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
              Tentang
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
                className="community-user-menu"
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
                className={`community-login-link ${isActive('/user/auth') ? 'active-link' : ''}`}
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
