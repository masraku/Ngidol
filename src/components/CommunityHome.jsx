'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import EventCard from './EventCardUser';
import CardIdol from './IdolCardUser';

const activities = [
  {
    title: 'Event Hunting',
    label: 'Agenda',
    description: 'Kurasi jadwal chika idol, JKT48, konser kecil, cosplay, dan pop culture supaya weekend tidak kosong.',
  },
  {
    title: 'Gathering Komunitas',
    label: 'Offline',
    description: 'Titik kumpul sebelum event, after-event talk, dan kenalan antar fans biar nonton tidak sendirian.',
  },
  {
    title: 'Chant & Setlist Practice',
    label: 'Belajar',
    description: 'Panduan chant, mix, dan referensi lagu agar member baru bisa ikut hype dengan aman dan percaya diri.',
  },
  {
    title: 'Media & Dokumentasi',
    label: 'Galeri',
    description: 'Rekap foto, catatan event, dan arsip momen komunitas untuk menjaga memori skena lokal tetap hidup.',
  },
];

const gallery = [
  { src: '/assets/1.jpg', title: 'Community night' },
  { src: '/assets/2.jpg', title: 'Meet and greet' },
  { src: '/assets/3.jpg', title: 'Event capture' },
  { src: '/assets/4.jpeg', title: 'Stage moment' },
];

const automationSteps = [
  'Scan URL flyer, web event, atau posting yang punya metadata jadwal.',
  'Ubah hasil scan jadi draft event/idol yang bisa direview admin.',
  'Approve draft agar data masuk tanpa mengetik ulang semua field.',
];

function getEventDates(event) {
  if (!event?.date) return [];
  return Array.isArray(event.date) ? event.date : [event.date];
}

function getEarliestDate(event) {
  const validDates = getEventDates(event)
    .map((date) => new Date(date))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a - b);

  return validDates[0] || null;
}

function isUpcoming(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates = getEventDates(event);

  if (dates.length === 0) return true;

  return dates.some((dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return false;
    date.setHours(0, 0, 0, 0);
    return date >= today;
  });
}

function formatShortDate(date) {
  if (!date) return 'TBA';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

export default function CommunityHome() {
  const [events, setEvents] = useState([]);
  const [idols, setIdols] = useState([]);
  const [categories, setCategories] = useState(['Semua']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchCommunityData() {
      setLoading(true);
      setError('');

      const [eventResult, idolResult, categoryResult] = await Promise.allSettled([
        fetch('/api/event', { cache: 'no-store' }).then((res) => res.json()),
        fetch('/api/idol', { cache: 'no-store' }).then((res) => res.json()),
        fetch('/api/category', { cache: 'no-store' }).then((res) => res.json()),
      ]);

      if (!active) return;

      if (eventResult.status === 'fulfilled') {
        setEvents(eventResult.value?.data || []);
      }

      if (idolResult.status === 'fulfilled') {
        setIdols(Array.isArray(idolResult.value) ? idolResult.value : []);
      }

      if (categoryResult.status === 'fulfilled') {
        const categoryNames = categoryResult.value?.data?.map((category) => category.name) || [];
        setCategories(['Semua', ...categoryNames]);
      }

      if (eventResult.status === 'rejected' || idolResult.status === 'rejected') {
        setError('Sebagian data komunitas gagal dimuat. Coba refresh halaman.');
      }

      setLoading(false);
    }

    fetchCommunityData();

    return () => {
      active = false;
    };
  }, []);

  const upcomingEvents = events
    .filter(isUpcoming)
    .sort((a, b) => {
      const firstDate = getEarliestDate(a);
      const secondDate = getEarliestDate(b);

      if (!firstDate && !secondDate) return 0;
      if (!firstDate) return 1;
      if (!secondDate) return -1;
      return firstDate - secondDate;
    });

  const nextEvent = upcomingEvents[0];
  const nextEventDate = getEarliestDate(nextEvent);
  const filteredEvents = upcomingEvents.filter((event) => {
    const keyword = searchTerm.toLowerCase();
    const guestNames = event.guests?.map((guest) => guest.name).join(' ') || '';
    const searchableText = `${event.name || ''} ${event.location || ''} ${guestNames}`.toLowerCase();
    const matchesSearch = searchableText.includes(keyword);
    const matchesCategory = selectedCategory === 'Semua' || event.category?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  const visibleEvents = showAllEvents ? filteredEvents : filteredEvents.slice(0, 6);
  const featuredIdols = idols.slice(0, 4);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthEvents = upcomingEvents.filter((event) => {
    const date = getEarliestDate(event);
    return date && date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });

  return (
    <main className="community-home">
      <section className="community-hero">
        <div className="community-hero__glow community-hero__glow--left" />
        <div className="community-hero__glow community-hero__glow--right" />

        <div className="community-container community-hero__grid">
          <div className="community-hero__copy">
            <span className="community-eyebrow">Muchitsujo Community Hub</span>
            <h1>Tempat ngidol yang lebih rapi, hidup, dan tidak cuma daftar jadwal.</h1>
            <p>
              Cari agenda idol terdekat, ikut kegiatan komunitas, belajar chant, simpan event favorit,
              dan bantu kurasi data skena lokal dalam satu website.
            </p>

            <div className="community-hero__actions">
              <Button as={Link} href="#jadwal" className="community-btn community-btn--primary">
                Lihat Jadwal
              </Button>
              <Button as={Link} href="#kegiatan" className="community-btn community-btn--ghost">
                Kegiatan Komunitas
              </Button>
            </div>

            <div className="community-stats">
              <div>
                <strong>{upcomingEvents.length}</strong>
                <span>agenda aktif</span>
              </div>
              <div>
                <strong>{thisMonthEvents.length}</strong>
                <span>event bulan ini</span>
              </div>
              <div>
                <strong>{idols.length}</strong>
                <span>idoru terdata</span>
              </div>
            </div>
          </div>

          <aside className="community-spotlight" aria-label="Event terdekat">
            <div className="community-spotlight__date">
              <span>{formatShortDate(nextEventDate)}</span>
              <small>Next</small>
            </div>
            <div className="community-spotlight__content">
              <span className="community-eyebrow community-eyebrow--dark">Event Terdekat</span>
              <h2>{nextEvent?.name || 'Jadwal berikutnya sedang dikurasi'}</h2>
              <p>{nextEvent?.location || 'Tim admin bisa scan URL/posting untuk masuk ke draft jadwal.'}</p>
              {nextEvent?.slug ? (
                <Link href={`/user/event/${nextEvent.slug}`} className="community-inline-link">
                  Buka detail event
                </Link>
              ) : (
                <Link href="/admin/automation" className="community-inline-link">
                  Setup otomasi data
                </Link>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section id="kegiatan" className="community-section community-section--cream">
        <div className="community-container">
          <div className="community-section__header">
            <span className="community-eyebrow">Kegiatan Kita</span>
            <h2>Bukan cuma kalender, tapi ruang tumbuh komunitas.</h2>
            <p>Website ini jadi etalase aktivitas Muchitsujo: hunting event, gathering, chant, dokumentasi, dan database idoru.</p>
          </div>

          <div className="community-activity-grid">
            {activities.map((activity) => (
              <article key={activity.title} className="community-activity-card">
                <span>{activity.label}</span>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="community-gallery-section">
        <div className="community-container community-gallery-grid">
          <div className="community-section__header community-section__header--left">
            <span className="community-eyebrow">Dokumentasi</span>
            <h2>Galeri kecil untuk nunjukin komunitasnya hidup.</h2>
            <p>Foto kegiatan lama dipakai sebagai visual landing agar website terasa punya identitas, bukan template event generik.</p>
            <Button as={Link} href="/user/about" className="community-btn community-btn--primary">
              Tentang Muchitsujo
            </Button>
          </div>

          <div className="community-gallery-mosaic">
            {gallery.map((item) => (
              <figure key={item.src} className="community-gallery-card">
                <img src={item.src} alt={item.title} />
                <figcaption>{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="jadwal" className="community-section community-schedule-section">
        <div className="community-container">
          <div className="community-section__header">
            <span className="community-eyebrow">Agenda Terbaru</span>
            <h2>Jadwal tetap penting, tapi sekarang jadi bagian dari ekosistem.</h2>
            <p>Filter event berdasarkan nama, lokasi, guest star, dan kategori. Data ini nanti bisa diisi dari hasil scan draft admin.</p>
          </div>

          <div className="community-filter-panel">
            <Form.Control
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Cari event, lokasi, atau guest star..."
              className="community-search-input"
            />

            <div className="community-category-list">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`community-chip ${selectedCategory === category ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="community-alert">{error}</div>}

          {loading ? (
            <div className="community-loading">
              <Spinner animation="border" />
              <span>Memuat data komunitas...</span>
            </div>
          ) : visibleEvents.length > 0 ? (
            <>
              <div className="community-event-grid">
                {visibleEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {filteredEvents.length > 6 && (
                <div className="community-center-action">
                  <Button
                    type="button"
                    className="community-btn community-btn--ghost-dark"
                    onClick={() => setShowAllEvents(!showAllEvents)}
                  >
                    {showAllEvents ? 'Tampilkan lebih sedikit' : 'Lihat semua jadwal'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="community-empty-state">
              <h3>Belum ada jadwal yang cocok.</h3>
              <p>Ubah filter atau scan sumber baru dari halaman otomasi admin.</p>
              <Link href="/admin/automation" className="community-inline-link">
                Buka otomasi data
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="community-section community-idol-section">
        <div className="community-container">
          <div className="community-section__header community-section__header--split">
            <div>
              <span className="community-eyebrow">Database Idoru</span>
              <h2>Profil idol jadi pintu masuk ke event, member, dan lagu.</h2>
            </div>
            <Button as={Link} href="/user/idol" className="community-btn community-btn--ghost-dark">
              Lihat Semua Idoru
            </Button>
          </div>

          {featuredIdols.length > 0 ? (
            <div className="community-idol-grid">
              {featuredIdols.map((idol) => (
                <CardIdol key={idol.id} idol={idol} />
              ))}
            </div>
          ) : (
            <div className="community-empty-state community-empty-state--compact">
              <h3>Belum ada idoru terdata.</h3>
              <p>Gunakan scanner profil untuk membuat draft idol dari URL resmi atau media sosial.</p>
            </div>
          )}
        </div>
      </section>

      <section id="otomasi" className="community-automation-section">
        <div className="community-container community-automation-card">
          <div>
            <span className="community-eyebrow">Otomasi Data</span>
            <h2>Scraping jangan langsung publish. Jadikan draft yang bisa dicek admin.</h2>
            <p>
              Pendekatan yang aman: scanner mengambil metadata dari URL, sistem menormalisasi tanggal/nama/lokasi,
              lalu admin approve supaya data tidak berantakan karena caption atau flyer yang ambigu.
            </p>
          </div>

          <ol className="community-automation-list">
            {automationSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <Button as={Link} href="/admin/automation" className="community-btn community-btn--primary">
            Buka Admin Otomasi
          </Button>
        </div>
      </section>
    </main>
  );
}
