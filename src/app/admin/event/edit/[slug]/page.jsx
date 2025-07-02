'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import EventForm from '@/components/EventForm';

export default function EditEventPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/event/${slug}`);
        setEventData(res.data);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data event.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger">{error || 'Event tidak ditemukan.'}</h3>
      </div>
    );
  }

  return (
    <div className="pt-5">
      <EventForm isEdit initialData={eventData} slug={slug} />
    </div>
  );
}
