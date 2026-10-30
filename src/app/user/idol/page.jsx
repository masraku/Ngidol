'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import CardIdol from '@/components/IdolCardUser';

const REQUEST_TIMEOUT_MS = 15000;

export default function IdolPage() {
  const [idols, setIdols] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchIdols = async () => {
      setStatus('loading');

      try {
        const res = await axios.get('/api/idol', { timeout: REQUEST_TIMEOUT_MS });
        if (!active) return;

        setIdols(Array.isArray(res.data) ? res.data : []);
        setStatus('ready');
      } catch (err) {
        if (!active) return;

        console.error('Gagal fetch idol:', err);
        setIdols([]);
        setStatus('error');
      }
    };

    fetchIdols();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <Container className="my-4">
      <h3 className="fw-semibold text-center mb-4">Idoru!</h3>

      {status === 'loading' && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" aria-label="Memuat data idol" />
          <p className="text-muted mt-3 mb-0">Memuat data idol...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-5">
          <h5 className="fw-semibold">Gagal memuat data idol</h5>
          <p className="text-muted">
            Sambungan ke server bermasalah. Coba muat ulang sebentar lagi.
          </p>
          <Button variant="outline-secondary" onClick={() => setReloadKey((key) => key + 1)}>
            Coba lagi
          </Button>
        </div>
      )}

      {status === 'ready' && idols.length === 0 && (
        <div className="text-center py-5">
          <h5 className="fw-semibold">Belum ada idol terdata</h5>
          <p className="text-muted mb-0">
            Daftar idoru masih kosong. Nantikan update dari admin komunitas.
          </p>
        </div>
      )}

      {status === 'ready' && idols.length > 0 && (
        <Row className="g-4">
          {idols.map((idol) => (
            <Col
              key={idol.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex justify-content-center"
            >
              <CardIdol idol={idol} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
