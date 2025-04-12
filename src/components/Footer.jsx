'use client';

import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>EventKu</h5>
            <p className="text-muted">
              Platform terdepan untuk menemukan dan mengikuti berbagai event menarik 
              di seluruh Indonesia.
            </p>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5>Navigasi</h5>
            <ul className="list-unstyled">
              <li><Link href="/" className="text-decoration-none text-muted">Beranda</Link></li>
              <li><Link href="/categories" className="text-decoration-none text-muted">Kategori</Link></li>
              <li><Link href="/about" className="text-decoration-none text-muted">Tentang Kami</Link></li>
            </ul>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5>Hubungi Kami</h5>
            <ul className="list-unstyled text-muted">
              <li>Email: info@eventku.com</li>
              <li>Telepon: +62 21 1234567</li>
              <li>Alamat: Jl. Sudirman No. 123, Jakarta</li>
            </ul>
          </Col>
          <Col md={2}>
            <h5>Ikuti Kami</h5>
            <div className="d-flex gap-2">
              <Link href="#" className="text-decoration-none text-muted">FB</Link>
              <Link href="#" className="text-decoration-none text-muted me-2">IG</Link>
              <Link href="#" className="text-decoration-none text-muted">TW</Link>
            </div>
          </Col>
        </Row>
        <hr />
        <div className="text-center text-muted">
          <small>&copy; {new Date().getFullYear()} EventKu. All rights reserved.</small>
        </div>
      </Container>
    </footer>
  );
}