'use client';

import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import GuestSelector from '@/components/GuestSelector';

const Event = () => {
    const initialForm = {
        name: '',
        date: '',
        time: '',
        location: '',
        link: '',
        guest: [],
        category: 'Pilih Kategori',
        htm: '',
        photos: [],
    };

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/api/event/category');
                setCategories(res.data); // pastikan API-nya mengembalikan array objek kategori
            } catch (error) {
                console.error('Gagal mengambil kategori:', error);
            }
        };
    
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "photos") {
            if (files.length > 3) {
                setError("Maksimal upload 3 foto");
                return;
            }
            setForm((prev) => ({ ...prev, photos: Array.from(files) }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!form.name || !form.date || !form.guest.length) {
            setError("Lengkapi semua field sebelum submit");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('date', form.date);
        formData.append('time', form.time);
        formData.append('location', form.location);
        formData.append('link', form.link);
        formData.append('guest', JSON.stringify(form.guest));
        formData.append('category', form.category);
        formData.append('htm', form.htm);
        for (const file of form.photos) {
            formData.append('photos', file);
        }

        try {
            const res = await axios.post('/api/event', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setSuccess(true);
            setForm(initialForm);
            if (fileInputRef.current) fileInputRef.current.value = ''; // clear file input
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="py-5 bg-light">
            <Row>
                <Col md={8} className="text-center mx-auto">
                    <h1 className="display-4 fw-bold mb-3">Tambah Event</h1>
                    <p className="lead text-muted">Isi form di bawah untuk menambahkan event baru</p>
                </Col>
            </Row>
            <Row>
                <Col md={8} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">Event berhasil ditambahkan!</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nama Event</Form.Label>
                                    <Form.Control type="text" name="name" value={form.name} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tanggal Event</Form.Label>
                                    <Form.Control type="date" name="date" value={form.date} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Waktu Event</Form.Label>
                                    <Form.Control type="time" name="time" value={form.time} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Lokasi Event</Form.Label>
                                    <Form.Control type="text" name="location" value={form.location} onChange={handleChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Link Event</Form.Label>
                                    <Form.Control type="text" name="link" value={form.link} onChange={handleChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Guest Star</Form.Label>
                                    <GuestSelector
                                        selected={form.guest}
                                        setSelected={(guestList) =>
                                            setForm((prev) => ({ ...prev, guest: guestList }))
                                        }
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Kategori</Form.Label>
                                    <Form.Select name="category" value={form.category} onChange={handleChange}>
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>HTM</Form.Label>
                                    <Form.Control type="text" name="htm" value={form.htm} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Foto</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="photos"
                                        onChange={handleChange}
                                        multiple
                                        ref={fileInputRef}
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary" disabled={loading}>
                                    {loading ? 'Menyimpan...' : 'Tambah Event'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Event;
