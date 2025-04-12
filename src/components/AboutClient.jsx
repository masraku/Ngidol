'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';

export default function AboutClient() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="mb-4 text-center">Tentang EventKu</h1>
          
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <h3 className="mb-3">Siapa Kami</h3>
              <p>
                EventKu adalah platform terdepan untuk menemukan dan mengikuti berbagai event menarik 
                di seluruh Indonesia. Kami berkomitmen untuk menghubungkan penyelenggara event dengan 
                para pengunjung yang mencari pengalaman baru dan menarik.
              </p>
              
              <h3 className="mb-3 mt-4">Visi Kami</h3>
              <p>
                Menjadi platform acara terkemuka yang menghubungkan orang-orang dengan pengalaman 
                yang memperkaya hidup dan menciptakan kenangan tak terlupakan.
              </p>
              
              <h3 className="mb-3 mt-4">Misi Kami</h3>
              <p>
                Kami berkomitmen untuk:
              </p>
              <ul>
                <li>Menyediakan platform yang mudah digunakan untuk menemukan event</li>
                <li>Mendukung penyelenggara acara untuk mempromosikan event mereka</li>
                <li>Memastikan pengalaman terbaik bagi semua pengguna</li>
                <li>Memperluas akses ke berbagai jenis event di seluruh Indonesia</li>
              </ul>
              
              <h3 className="mb-3 mt-4">Hubungi Kami</h3>
              <p>
                Jika Anda memiliki pertanyaan atau ingin bekerja sama dengan kami, silakan hubungi 
                kami di:
              </p>
              <p>
                <strong>Email:</strong> info@eventku.com<br />
                <strong>Telepon:</strong> +62 21 1234567<br />
                <strong>Alamat:</strong> Jl. Sudirman No. 123, Jakarta
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}