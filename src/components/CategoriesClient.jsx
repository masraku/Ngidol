'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';

export default function CategoriesClient() {
  return (
    <Container className="py-5">
      <h1 className="mb-5 text-center">Kategori Event</h1>
      
      <Row className="g-4">
        {['Chika Idol', 'JKT48', 'E-Sport'].map((category) => (
          <Col key={category} md={3}>
            <Card className="h-100 shadow-sm border-0 text-center">
              <Card.Body>
                <h3>{category}</h3>
                <p className="text-muted">Lihat semua event {category.toLowerCase()}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}