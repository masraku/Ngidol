'use client';

import { useState } from 'react';
import { Badge, Button, Form, Spinner } from 'react-bootstrap';

const workflow = [
  {
    title: 'Scan sumber',
    description: 'Paste URL flyer/web event/profil idol. Scanner membaca JSON-LD, Open Graph, dan meta tag.',
  },
  {
    title: 'Normalisasi draft',
    description: 'Nama, tanggal, jam, lokasi, poster, sosmed, dan slug dirapikan menjadi format database.',
  },
  {
    title: 'Review admin',
    description: 'Admin tetap mengecek hasil sebelum data dipakai agar tidak salah tanggal atau guest star.',
  },
  {
    title: 'Approve ke database',
    description: 'Tahap berikutnya bisa dibuat sebagai draft queue permanen dengan tombol approve satu klik.',
  },
];

function splitUrls(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function DraftField({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  return (
    <div className="automation-draft-field">
      <span>{label}</span>
      <strong>{Array.isArray(value) ? value.join(', ') : value}</strong>
    </div>
  );
}

export default function AutomationImportClient() {
  const [type, setType] = useState('event');
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleScan = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch('/api/admin/import/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, urls: splitUrls(urls) }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Scanner gagal dijalankan');

      setResults(data.data || []);
    } catch (err) {
      setError(err.message || 'Scanner gagal dijalankan');
    } finally {
      setLoading(false);
    }
  };

  const copyDraft = async (draft, index) => {
    await navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1600);
  };

  return (
    <div className="automation-page">
      <section className="automation-hero">
        <div>
          <span className="automation-eyebrow">Otomasi Data</span>
          <h1>Scan jadwal dan profil idol jadi draft, bukan input manual dari nol.</h1>
          <p>
            Ini fondasi workflow scraping yang aman. Scanner mengambil metadata publik dari URL, lalu hasilnya
            ditampilkan sebagai draft agar admin bisa koreksi sebelum dipublish.
          </p>
        </div>
      </section>

      <section className="automation-workflow-grid">
        {workflow.map((item, index) => (
          <article key={item.title} className="automation-workflow-card">
            <span>{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="automation-scanner-card">
        <div className="automation-scanner-copy">
          <span className="automation-eyebrow">Scanner URL</span>
          <h2>Pilih tipe data, paste URL satu per baris.</h2>
          <p>
            Cocok untuk halaman event yang punya schema.org Event atau profil yang punya Open Graph/JSON-LD.
            Untuk Instagram/X yang render client-side, hasil bisa terbatas jika metadata publiknya minim.
          </p>
        </div>

        <Form onSubmit={handleScan} className="automation-form">
          <div className="automation-type-toggle" role="group" aria-label="Tipe import">
            <button
              type="button"
              className={type === 'event' ? 'is-active' : ''}
              onClick={() => setType('event')}
            >
              Jadwal Event
            </button>
            <button
              type="button"
              className={type === 'idol' ? 'is-active' : ''}
              onClick={() => setType('idol')}
            >
              Profil Idol
            </button>
          </div>

          <Form.Control
            as="textarea"
            rows={7}
            value={urls}
            onChange={(event) => setUrls(event.target.value)}
            placeholder="https://contoh.com/event\nhttps://contoh.com/profil-idol"
          />

          {error && <div className="automation-error">{error}</div>}

          <Button type="submit" className="automation-submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" /> Memindai URL...
              </>
            ) : (
              'Scan jadi draft'
            )}
          </Button>
        </Form>
      </section>

      {results.length > 0 && (
        <section className="automation-results">
          <div className="automation-results-header">
            <h2>Hasil Draft</h2>
            <p>Copy JSON draft untuk referensi input, atau lanjutkan nanti ke fitur approve otomatis.</p>
          </div>

          <div className="automation-result-grid">
            {results.map((result, index) => (
              <article key={`${result.sourceUrl}-${index}`} className="automation-result-card">
                <div className="automation-result-card__top">
                  <Badge bg={result.ok ? 'success' : 'danger'}>{result.ok ? 'Draft siap' : 'Gagal'}</Badge>
                  {result.ok && <Badge bg="light" text="dark">Confidence {result.confidence}%</Badge>}
                </div>

                <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" className="automation-source-link">
                  {result.sourceUrl}
                </a>

                {result.ok ? (
                  <>
                    <DraftField label="Nama" value={result.draft.name} />
                    <DraftField label="Slug" value={result.draft.slug} />
                    <DraftField label="Tanggal" value={result.draft.date} />
                    <DraftField label="Jam" value={result.draft.time} />
                    <DraftField label="Lokasi" value={result.draft.location} />
                    <DraftField label="Poster/Image" value={result.draft.photoUrls || result.draft.imageUrl} />
                    <DraftField label="Guest/Sosmed" value={result.draft.guestSuggestions || result.draft.sosmeds} />

                    {result.warnings?.map((warning) => (
                      <div key={warning} className="automation-warning">{warning}</div>
                    ))}

                    <Button
                      type="button"
                      variant="outline-dark"
                      className="automation-copy-btn"
                      onClick={() => copyDraft(result.draft, index)}
                    >
                      {copiedIndex === index ? 'Draft tersalin' : 'Copy JSON draft'}
                    </Button>
                  </>
                ) : (
                  <div className="automation-error">{result.error}</div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
