'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import slugify from 'slugify';
import Swal from 'sweetalert2';

export default function AddIdolPage() {
  const router = useRouter();
  const [idol, setIdol] = useState({ name: '', description: '', sosmeds: [''] });
  const [imageFile, setImageFile] = useState(null);
  const [members, setMembers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/event/category');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Gagal memuat kategori', err);
      }
    };
    fetchCategories();
  }, []);

  const handleIdolChange = (e) => {
    const { name, value } = e.target;
    setIdol((prev) => ({ ...prev, [name]: value }));
  };

  const handleSosmedChange = (index, value) => {
    const newSosmeds = [...idol.sosmeds];
    newSosmeds[index] = value;
    setIdol((prev) => ({ ...prev, sosmeds: newSosmeds }));
  };

  const addSosmed = () => {
    setIdol((prev) => ({ ...prev, sosmeds: [...prev.sosmeds, ''] }));
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleSongChange = (index, field, value) => {
    const newSongs = [...songs];
    newSongs[index][field] = value;
    setSongs(newSongs);
  };

  const addMember = () =>
    setMembers([
      ...members,
      { name: '', imageFile: null, image: '', description: '', instagram: '', X: '' },
    ]);

  const addSong = () => setSongs([...songs, { title: '', spotifyUrl: '' }]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleMemberImageChange = (index, file) => {
    const updatedMembers = [...members];
    updatedMembers[index].imageFile = file;
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idol.name.trim()) {
      Swal.fire('Nama Idol wajib diisi!', '', 'warning');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('name', idol.name);
      formData.append('slug', slugify(idol.name, { lower: true }));
      formData.append('description', idol.description);
      formData.append('sosmeds', JSON.stringify(idol.sosmeds));
      formData.append('categoryId', selectedCategoryId);

      if (imageFile) formData.append('image', imageFile);

      formData.append(
        'members',
        JSON.stringify(
          members.map(({ imageFile, ...rest }) => rest)
        )
      );

      members.forEach((m, i) => {
        if (m.imageFile) {
          formData.append(`memberImage-${i}`, m.imageFile);
        }
      });

      formData.append('songs', JSON.stringify(songs));

      const res = await fetch('/api/idol/add', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        Swal.fire('Berhasil!', 'Idol berhasil ditambahkan.', 'success').then(() => {
          router.push('/admin/idol');
        });
      } else {
        const err = await res.json();
        Swal.fire('Gagal', err?.error || 'Terjadi kesalahan server', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan saat mengupload.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Tambah Idol Baru</h1>

      <form onSubmit={handleSubmit} className="form-grid" encType="multipart/form-data">
        <div className="input-group">
          <div>
            <label className="label">Nama Idol *</label>
            <input
              name="name"
              value={idol.name}
              onChange={handleIdolChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Kategori *</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="input"
              required
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Deskripsi *</label>
            <textarea
              name="description"
              value={idol.description}
              onChange={handleIdolChange}
              className="textarea"
            />
          </div>

          <div>
            <label className="label">Link Sosial Media</label>
            {idol.sosmeds.map((link, index) => (
              <input
                key={index}
                type="url"
                className="input mb-2"
                placeholder="https://instagram.com/namaakun atau https://x.com/namaakun"
                value={link}
                onChange={(e) => handleSosmedChange(index, e.target.value)}
              />
            ))}
            <button
              type="button"
              onClick={addSosmed}
              className="btn btn-outline-secondary btn-sm mt-1"
            >
              + Tambah Link
            </button>
          </div>
        </div>

        <div>
          <label className="label">Foto Idol</label>
          <label
            className="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleImageChange({ target: { files: e.dataTransfer.files } });
            }}
          >
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Preview" />
            ) : (
              <div className="dropzone-placeholder">
                <Upload className="mx-auto mb-2 w-6 h-6" />
                <p>Klik / Drag foto</p>
              </div>
            )}
            <input type="file" onChange={handleImageChange} accept="image/*" hidden />
          </label>
        </div>
      </form>

      {/* Member section */}
      <div className="section">
        <h2 className="h5">Member</h2>
        {members.map((member, i) => (
          <div key={i} className="member-box">
            <div className="input-group">
              <input
                placeholder="Nama"
                value={member.name}
                onChange={(e) => handleMemberChange(i, 'name', e.target.value)}
                className="input"
              />
              <textarea
                placeholder="Deskripsi"
                value={member.description}
                onChange={(e) => handleMemberChange(i, 'description', e.target.value)}
                className="textarea"
              />
              <input
                placeholder="Instagram"
                value={member.instagram}
                onChange={(e) => handleMemberChange(i, 'instagram', e.target.value)}
                className="input"
              />
              <input
                placeholder="X / Twitter"
                value={member.X}
                onChange={(e) => handleMemberChange(i, 'X', e.target.value)}
                className="input"
              />
            </div>

            <label
              className="dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleMemberImageChange(i, e.dataTransfer.files[0]);
              }}
            >
              {member.imageFile ? (
                <img src={URL.createObjectURL(member.imageFile)} alt="Preview" />
              ) : (
                <div className="dropzone-placeholder">
                  <Upload className="mx-auto mb-2 w-6 h-6" />
                  <p>Klik / Drag foto</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleMemberImageChange(i, e.target.files[0])}
                hidden
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addMember} className="btn btn-outline-primary mt-2">
          + Tambah Member
        </button>
      </div>

      {/* Songs */}
      <div className="section">
        <h2 className="h5">Lagu</h2>
        {songs.map((song, i) => (
          <div key={i} className="song-box">
            <input
              placeholder="Judul Lagu"
              value={song.title}
              onChange={(e) => handleSongChange(i, 'title', e.target.value)}
              className="input"
            />
            <input
              placeholder="Spotify URL"
              value={song.spotifyUrl}
              onChange={(e) => handleSongChange(i, 'spotifyUrl', e.target.value)}
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addSong} className="btn btn-outline-primary mt-2">
          + Tambah Lagu
        </button>
      </div>

      <div className="mt-6">
        <button type="submit" onClick={handleSubmit} className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Menyimpan...' : 'Simpan Idol'}
        </button>
      </div>
    </div>
  );
}
