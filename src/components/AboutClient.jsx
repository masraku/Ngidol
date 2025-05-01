'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';

export default function AboutClient() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="mb-4 text-center">Muchitsujo</h1>
          
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <h3 className="mb-3">Web apa sih ini?</h3>
              <p>
                Muchitsujo Event adalah platform terdepan untuk menemukan dan mengikuti berbagai event Chika Idol maupun Idol Major seperti JKT48 yang menarik 
                di JaBoDeTaBek. Team kami berkomitmen untuk menghubungkan penyelenggara event dengan 
                para pengunjung yang mencari pengalaman baru dan menarik.
              </p>
              
              <h3 className="mb-3 mt-4">Siapa kami?</h3>
              <p>
                kami adalah sekelompok anak-anak penggemar skena idol major maupun lokal yang ingin mengisi masa muda dengan hal-hal positif.
                Kami percaya bahwa event-event ini tidak hanya memberikan hiburan, tetapi juga
                kesempatan untuk bertemu orang-orang baru, belajar, dan tumbuh bersama dalam komunitas yang penuh semangat.
                ikuti kami di
                <a href="https://www.instagram.com/muchitsujo_/" target="_blank" rel="noopener noreferrer">Muchitsujo</a>
              </p>
              
              
              <h3 className="mb-3 mt-4">Hubungi Kami</h3>
              <p>
                Jika Anda memiliki pertanyaan atau ingin bekerja sama dengan kami, silakan hubungi 
                kami di:
              </p>
              <p>
                <strong>Email:</strong> laksmanarakho@gmail.com<br />
                <strong>Alamat:</strong> WPK, Kantin Kuningan, 12, RT.12/RW.1, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12950
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}