'use client';

import { Card, Button } from 'react-bootstrap';
import { Instagram, Twitter } from 'react-bootstrap-icons';

export default function MemberCard({ member }) {
  return (
    <Card className="member-card shadow-sm">
      <Card.Img
        variant="top"
        src={member.image}
        alt={member.name}
        className="member-image"
      />
      <Card.Body>
        <Card.Title>{member.name}</Card.Title>
        <Card.Text>{member.description}</Card.Text>

        <div className="social-buttons d-flex gap-2 flex-wrap">
          {member.instagram && (
            <Button
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="outline-primary"
            >
              <Instagram className="me-1" />
              Instagram
            </Button>
          )}
          {member.X && (
            <Button
              href={member.X}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="outline-secondary"
            >
              <Twitter className="me-1" />
              X
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}