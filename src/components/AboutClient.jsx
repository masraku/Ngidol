"use client";
import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import '@/style/About.css';

const galleryImages = [
  {
    id: 1,
    src: "/assets/1.jpg",
    alt: "Event JKT48 Performance",
    caption: "JKT48 Live Performance"
  },
  {
    id: 2,
    src: "/assets/2.jpg",
    alt: "Chika Idol Event",
    caption: "Chika Idol Meet & Greet"
  },
  {
    id: 3,
    src: "/assets/3.jpg",
    alt: "Community Gathering",
    caption: "Community Gathering"
  },
  {
    id: 4,
    src: "/assets/4.jpeg",
    alt: "Concert Event",
    caption: "Major Concert Event"
  },
  {
    id: 5,
    src: "/assets/5.jpeg",
    alt: "Fan Meeting",
    caption: "Exclusive Fan Meeting"
  },
  {
    id: 6,
    src: "/assets/6.jpeg",
    alt: "Workshop Event",
    caption: "Dancing Workshop"
  }
];

export default function AboutClient() {
  return (
    <div className="about-page">
      <Container className="py-5">
        {/* About Section */}
        <Card className="about-card mb-4">
          <Card.Body>
            <div className="section-header">
              <div className="icon-circle">?</div>
              <h2 className="section-title">Web apa sih ini?</h2>
            </div>
            <Card.Text>
              Muchitsujo Event adalah platform terdepan untuk menemukan dan mengikuti berbagai event Chika Idol maupun Idol Major seperti JKT48
              yang menarik di JaBoDeTaBek. Kami berkomitmen untuk menghubungkan penyelenggara event dengan para pengunjung yang mencari pengalaman baru dan menarik.
            </Card.Text>
          </Card.Body>
        </Card>

        {/* Team Section */}
        <Card className="about-card mb-4">
          <Card.Body>
            <div className="section-header">
              <div className="icon-circle">👥</div>
              <h2 className="section-title">Siapa kami?</h2>
            </div>
            <Card.Text>
              Kami adalah sekelompok anak-anak penggemar skena idol major maupun lokal yang ingin mengisi masa muda dengan hal-hal positif.
              Kami percaya bahwa event-event ini tidak hanya memberikan hiburan, tetapi juga kesempatan untuk bertemu orang-orang baru,
              belajar, dan tumbuh bersama dalam komunitas yang penuh semangat.
            </Card.Text>
            <Card.Text>
              Ikuti kami di <a href="https://www.instagram.com/muchitsujo_/" target="_blank" rel="noopener noreferrer">@muchitsujo_</a>
            </Card.Text>
          </Card.Body>
        </Card>

        {/* Gallery Section */}
        <Card className="about-card mb-4">
          <Card.Body>
            <div className="section-header">
              <div className="icon-circle">📸</div>
              <h2 className="section-title">Galeri Event</h2>
            </div>
            <Row>
              {galleryImages.map((image) => (
                <Col md={4} sm={6} xs={12} key={image.id} className="mb-4">
                  <div className="gallery-item">
                    <Image src={image.src} alt={image.alt} fluid className="gallery-image" />
                    <div className="gallery-caption">{image.caption}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* Contact Section */}
        <div className="contact-section text-white p-4 rounded">
          <div className="section-header">
            <div className="icon-circle bg-dark text-white">📞</div>
            <h2 className="section-title">Hubungi Kami</h2>
          </div>
          <p>Jika Anda memiliki pertanyaan atau ingin bekerja sama dengan kami, silakan hubungi kami di:</p>
          <Row className="mt-3">
            <Col md={6}>
              <div className="contact-card">
                <h5>Email</h5>
                <a href="mailto:laksmanarakho@gmail.com" className="contact-link">
                  laksmanarakho@gmail.com
                </a>

              </div>
            </Col>
            <Col md={6}>
              <div className="contact-card">
                <h5>Alamat</h5>
                <p>
                  WPK, Kantin Kuningan, 12, RT.12/RW.1, Kuningan, Kuningan Timur,
                  Kecamatan Setiabudi, Jakarta Selatan, DKI Jakarta 12950
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
