'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="community-footer">
      <div className="community-container community-footer__grid">
        <div className="community-footer__brand">
          <span>Muchitsujo</span>
          <p>
            Komunitas idol dan event hub untuk jadwal, chant, arsip, dokumentasi, dan database idoru lokal.
          </p>
        </div>

        <div>
          <h5>Navigasi</h5>
          <Link href="/user">Beranda</Link>
          <Link href="/user#jadwal">Jadwal</Link>
          <Link href="/user/idol">Idoru</Link>
          <Link href="/user/chant">Chant</Link>
        </div>

        <div>
          <h5>Komunitas</h5>
          <Link href="/user/about">Tentang Kami</Link>
          <Link href="/user/arsip">Arsip Event</Link>
          <Link href="/admin/automation">Otomasi Data</Link>
        </div>

        <div>
          <h5>Kontak</h5>
          <a href="mailto:laksmanarakho@gmail.com">laksmanarakho@gmail.com</a>
          <a href="https://www.instagram.com/muchitsujo_/" target="_blank" rel="noopener noreferrer">@muchitsujo_</a>
        </div>
      </div>

      <div className="community-container community-footer__bottom">
        <small>&copy; {new Date().getFullYear()} Muchitsujo. Built for the local idol community.</small>
      </div>
    </footer>
  );
}
