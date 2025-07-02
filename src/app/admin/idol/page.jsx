'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { Container, Row, Col } from 'react-bootstrap';
import CardIdol from '@/components/IdolCard';

export default function IdolListPage() {
  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdols = async () => {
      try {
        const res = await axios.get('/api/idol');
        console.log('Data idol:', res.data);
        setIdols(res.data || []);
      } catch (err) {
        console.error('Gagal fetch idol:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdols();
  }, []);

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-semibold">Daftar Idol</h3>
        <Link href="/admin/idol/add" className="btn btn-primary d-flex align-items-center gap-1">
          <Plus size={16} />
          Tambah Idol
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : idols.length === 0 ? (
        <p className="text-muted">Tidak ada idol ditemukan.</p>
      ) : (
        <Row className="g-4">
          {idols.map((idol) => (
            <Col key={idol.id} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
              <CardIdol idol={idol} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}