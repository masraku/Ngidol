'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from 'react-bootstrap';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export default function SaveEventButton({ eventId, initialSaved = false }) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleSaveEvent = async () => {
    if (!session) {
      // Redirect to login or show modal
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/user/events/${eventId}/save`, {
        method: isSaved ? 'DELETE' : 'POST'
      });

      if (response.ok) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isSaved ? 'success' : 'outline-primary'}
      onClick={handleSaveEvent}
      disabled={loading}
      className="d-flex align-items-center"
    >
      {isSaved ? (
        <BookmarkCheck size={16} className="me-2" />
      ) : (
        <Bookmark size={16} className="me-2" />
      )}
      {isSaved ? 'Tersimpan' : 'Simpan'}
    </Button>
  );
}