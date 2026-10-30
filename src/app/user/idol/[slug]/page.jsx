'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Container, Spinner, Button } from 'react-bootstrap';
import MemberCard from '@/components/MemberCard';
import SpotifyCard from '@/components/SpotifyCard';
import { FaInstagram, FaXTwitter } from 'react-icons/fa6';

const REQUEST_TIMEOUT_MS = 15000;

export default function IdolDetailPage() {
    const { slug } = useParams();
    const [idol, setIdol] = useState(null);
    const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'notfound' | 'error'
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let active = true;

        const fetchIdol = async () => {
            setStatus('loading');

            try {
                const res = await axios.get(`/api/idol/${slug}`, { timeout: REQUEST_TIMEOUT_MS });
                if (!active) return;

                setIdol(res.data);
                setStatus('ready');
            } catch (err) {
                if (!active) return;

                console.error('Gagal fetch idol:', err);
                setIdol(null);
                setStatus(err?.response?.status === 404 ? 'notfound' : 'error');
            }
        };

        if (slug) {
            fetchIdol();
        } else {
            setStatus('notfound');
        }

        return () => {
            active = false;
        };
    }, [slug, reloadKey]);

    if (status === 'loading') {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" role="status" aria-label="Memuat data idol" />
                <p className="text-muted mt-3 mb-0">Memuat data idol...</p>
            </Container>
        );
    }

    if (status === 'notfound') {
        return (
            <Container className="text-center py-5">
                <h5 className="fw-semibold">Idol tidak ditemukan</h5>
                <p className="text-muted mb-3">
                    Idol yang kamu cari mungkin sudah dihapus atau tautannya salah.
                </p>
                <Link href="/user/idol" className="btn btn-outline-secondary">
                    Lihat semua idol
                </Link>
            </Container>
        );
    }

    if (status === 'error' || !idol) {
        return (
            <Container className="text-center py-5">
                <h5 className="fw-semibold">Gagal memuat data idol</h5>
                <p className="text-muted mb-3">
                    Sambungan ke server bermasalah. Coba muat ulang sebentar lagi.
                </p>
                <Button variant="outline-secondary" onClick={() => setReloadKey((key) => key + 1)}>
                    Coba lagi
                </Button>
            </Container>
        );
    }

    const members = Array.isArray(idol.members) ? idol.members : [];
    const songs = Array.isArray(idol.songs) ? idol.songs : [];

    return (
        <Container className="idol-detail py-4">
            {/* Gambar & Sosmed */}
            <div className="text-center mb-4">
                {idol.image && (
                    <img
                        src={idol.image}
                        alt={idol.name}
                        className="idol-image-detail"
                    />
                )}

                {/* Sosial Media */}
                {idol.sosmeds && idol.sosmeds.length > 0 && (
                    <div className="d-flex justify-content-center gap-3 mt-3">
                        {idol.sosmeds.map((link, i) => {
                            const isIG = link.includes('instagram.com');
                            const isX = link.includes('x.com') || link.includes('twitter.com');

                            return (
                                <a
                                    key={i}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-dark"
                                    style={{ fontSize: '1.5rem' }}
                                >
                                    {isIG && <FaInstagram title="Instagram" />}
                                    {isX && <FaXTwitter title="X / Twitter" />}
                                </a>
                            );
                        })}
                    </div>
                )}

                <h2 className="fw-bold mt-3 text-maroon">{idol.name}</h2>
                <p className="text-muted">{idol.description}</p>
            </div>

            {/* Member Section dengan CSS Grid */}
            <hr />
            <h4 className="fw-semibold text-maroon mb-3">Member</h4>
            {members.length > 0 ? (
                <div className="members-grid">
                    {members.map((member, idx) => (
                        <MemberCard key={member.id || idx} member={member} />
                    ))}
                </div>
            ) : (
                <p className="text-muted">Belum ada member terdata untuk idol ini.</p>
            )}

            {/* Spotify Section */}
            {songs.length > 0 && (
                <>
                    <hr />
                    <h4 className="fw-semibold text-maroon mt-4 mb-3">Lagu di Spotify</h4>
                    <div className="spotify-grid">
                        {songs.map((song) => (
                            <SpotifyCard key={song.id} song={song} />
                        ))}
                    </div>

                </>
            )}
        </Container>
    );
}