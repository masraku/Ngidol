'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GuestSelector from '@/components/GuestSelector';
import { Form, Button, Spinner, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import DatePicker from "react-multi-date-picker"; // Import DatePicker

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch data event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/event/${id}`);
        setEventData(res.data);
      } catch (err) {
        console.error('Gagal mengambil data event:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/event/category');
        setCategories(res.data || []);
      } catch (err) {
        console.error('Gagal mengambil kategori:', err);
      }
    };

    if (id) {
      fetchEvent();
      fetchCategories();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemovePhoto = (index) => {
    setEventData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleDateChange = (dates) => {
    setEventData((prev) => ({
      ...prev,
      date: dates ? dates.map((date) => {
        const validDate = new Date(date);
        return isNaN(validDate.getTime()) ? null : validDate.toISOString(); // Ensure valid ISO string
      }).filter(date => date !== null) : [], // Remove invalid dates
    }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      let uploadedUrls = [...(eventData.photos || [])];

      // Upload foto baru jika ada
      if (eventData.newPhotos && eventData.newPhotos.length > 0) {
        const uploaded = await Promise.all(
          eventData.newPhotos.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const { error } = await supabase.storage
              .from('event')
              .upload(fileName, file);

            if (error) throw error;

            const { data: urlData } = supabase.storage
              .from('event')
              .getPublicUrl(fileName);

            return urlData.publicUrl;
          })
        );

        uploadedUrls = [...uploadedUrls, ...uploaded]; // tambahkan ke foto yang belum dihapus
      }

      await axios.put(`/api/event/${id}`, {
        ...eventData,
        photos: uploadedUrls,
      });

      router.push('/');
    } catch (err) {
      console.error('Gagal update event:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!eventData) {
    return <p className="text-center py-5">Event tidak ditemukan</p>;
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Edit Event</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Event</Form.Label>
              <Form.Control
                name="name"
                value={eventData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tanggal</Form.Label>
              <DatePicker
                value={eventData.date.map(date => new Date(date).toISOString())}
                onChange={handleDateChange}
                multiple
                format="YYYY-MM-DD"
              />

            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Jam</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={eventData.time}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lokasi</Form.Label>
              <Form.Control
                name="location"
                value={eventData.location}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                name="link"
                value={eventData.link}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select
                name="category"
                value={eventData.category}
                onChange={handleChange}
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat.name}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>HTM</Form.Label>
              <Form.Control
                name="htm"
                value={eventData.htm || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Guest Star</Form.Label>
              <GuestSelector
                selected={eventData.guest}
                setSelected={(guestList) =>
                  setEventData((prev) => ({ ...prev, guest: guestList }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Ganti / Hapus Foto (maks. 3)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    newPhotos: Array.from(e.target.files),
                  }))
                }
              />
              <div className="mt-2 d-flex gap-2 flex-wrap">
                {eventData.photos?.map((url, idx) => (
                  <div key={idx} className="position-relative">
                    <img
                      src={url}
                      alt="preview"
                      height="80"
                      className="rounded shadow-sm"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 translate-middle"
                      onClick={() => handleRemovePhoto(idx)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary" disabled={updating}>
          {updating ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </Form>
    </Container>
  );
}
