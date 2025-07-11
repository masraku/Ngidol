'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import MemberCard from '@/components/MemberCard';
import SpotifyCard from '@/components/SpotifyCard';
import { FaInstagram, FaXTwitter } from 'react-icons/fa6';

export default function IdolDetailPage() {
    const { slug } = useParams();
    const [idol, setIdol] = useState(null);

    useEffect(() => {
        const fetchIdol = async () => {
            try {
                const res = await axios.get(`/api/idol/${slug}`);
                setIdol(res.data);
            } catch (err) {
                console.error('Gagal fetch idol:', err);
            }
        };
        if (slug) fetchIdol();
    }, [slug]);

    if (!idol) return <p className="text-center mt-4">Loading...</p>;

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
            <div className="members-grid">
                {idol.members.map((member, idx) => (
                    <MemberCard key={idx} member={member} />
                ))}
            </div>

            {/* Spotify Section */}
            {idol.songs && idol.songs.length > 0 && (
                <>
                    <hr />
                    <h4 className="fw-semibold text-maroon mt-4 mb-3">Lagu di Spotify</h4>
                    <div className="spotify-grid">
                        {idol.songs.map((song) => (
                            <SpotifyCard key={song.id} song={song} />
                        ))}
                    </div>

                </>
            )}
        </Container>
    );
}