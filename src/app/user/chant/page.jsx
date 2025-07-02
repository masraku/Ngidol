'use client';

import { Accordion, Container, Button, Row, Col, Form } from 'react-bootstrap';
import { useState } from 'react';
import { chants } from '@/data/chant'; // Mengimpor data chant dari file chant.js

const ChantPage = () => {
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Fungsi untuk highlight kata yang dicari
    const highlightText = (text) => {
        if (!searchQuery) return text;

        const regex = new RegExp(`(${searchQuery})`, 'gi');
        return text.split(regex).map((part, index) =>
            regex.test(part) ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part
        );
    };

    // Filter chants berdasarkan searchQuery (judul dan lirik)
    const filteredChants = chants.filter(
        chant =>
            chant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chant.lyrics.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container className="py-5">
            <h1 className="text-center mb-4">MiX Seru!</h1>

            {/* Input Pencarian */}
            <Form.Control
                type="text"
                placeholder="Cari Chant..."
                className="mb-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Accordion untuk Chant */}
            <Row xs={1} md={2} className="g-4">
                {filteredChants.length > 0 ? (
                    filteredChants.map((chant, idx) => (
                        <Col key={idx}>
                            <Accordion>
                                <Accordion.Item eventKey={idx.toString()}>
                                    <Accordion.Header variant="danger">{highlightText(chant.title)}</Accordion.Header>
                                    <Accordion.Body>
                                        <div style={{ whiteSpace: 'pre-line' }}>
                                            {highlightText(chant.lyrics)}
                                        </div>
                                        <div className="mt-3">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => handleCopy(chant.lyrics, idx)}
                                            >
                                                {copiedIndex === idx ? 'Tersalin!' : 'Copy Lirik'}
                                            </Button>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    ))
                ) : (
                    <p className="text-center">Tidak ada chant yang cocok dengan pencarian.</p>
                )}
            </Row>
            <div className="text-center mt-5">
                <p>Ingin versi lengkap ?</p>
                <a
                    href="/pdf/IDOL_MIXES.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-danger"
                >
                    Unduh PDF Chant Lengkap
                </a>
            </div>

        </Container>
    );
};

export default ChantPage;
