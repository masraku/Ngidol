"use client";

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '@/style/EventForm.css';

const EventForm = () => {
    const initialForm = {
        name: '',
        date: [],
        time: '',
        location: '',
        link: '',
        guest: [],
        category: '',
        htm: '',
        photos: [],
    };

    const [categories, setCategories] = useState([]);
    const [idols, setIdols] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const [guestSearchTerm, setGuestSearchTerm] = useState('');
    const [selectedDates, setSelectedDates] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const fileInputRef = useRef(null);

    // Filter idols based on search term
    const filteredIdols = idols.filter(idol => 
        idol.name.toLowerCase().includes(guestSearchTerm.toLowerCase()) ||
        idol.group.toLowerCase().includes(guestSearchTerm.toLowerCase())
    );

    // Fetch data from API using axios (simulated with fetch for this demo)
    useEffect(() => {
        const fetchData = async () => {
            setDataLoading(true);
            try {
                const [categoriesRes, idolsRes] = await Promise.all([
                    axios.get('/api/event/category'),
                    axios.get('/api/idol')
                ]);
                setCategories(categoriesRes.data);
                setIdols(idolsRes.data);

                // Simulated API calls
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.error('Gagal mengambil data:', error);
                setError('Gagal memuat data kategori dan idol');
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "photos") {
            if (files.length > 3) {
                setError("Maksimal upload 3 foto");
                return;
            }
            setForm((prev) => ({ ...prev, photos: Array.from(files) }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        if (dateValue && !selectedDates.includes(dateValue)) {
            const newDates = [...selectedDates, dateValue];
            setSelectedDates(newDates);
            setForm((prev) => ({ ...prev, date: newDates }));
        }
    };

    const removeDateTag = (dateToRemove) => {
        const newDates = selectedDates.filter(date => date !== dateToRemove);
        setSelectedDates(newDates);
        setForm((prev) => ({ ...prev, date: newDates }));
    };

    const handleGuestToggle = (idol) => {
        const isSelected = form.guest.some(g => g.id === idol.id);
        if (isSelected) {
            setForm(prev => ({
                ...prev,
                guest: prev.guest.filter(g => g.id !== idol.id)
            }));
        } else {
            setForm(prev => ({
                ...prev,
                guest: [...prev.guest, idol]
            }));
        }
    };

    const removeGuestTag = (idolId) => {
        setForm(prev => ({
            ...prev,
            guest: prev.guest.filter(g => g.id !== idolId)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!form.name || !form.guest.length) {
            setError("Lengkapi semua field sebelum submit");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('date', JSON.stringify(form.date));
        formData.append('time', form.time);
        formData.append('location', form.location);
        formData.append('link', form.link);
        formData.append('guest', JSON.stringify(form.guest));
        formData.append('category', form.category);
        formData.append('htm', form.htm);
        
        for (const file of form.photos) {
            formData.append('photos', file);
        }

        try {
            // In real implementation, replace with:
            const response = await axios.post('/api/event', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Simulasi API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setSuccess(true);
            setForm(initialForm);
            setSelectedDates([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            setError(error.message || 'Terjadi kesalahan saat menyimpan event');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (dataLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f4f4 0%, #ede1e1 100%)' }}>
                <div className="text-center">
                    <div className="spinner-border" style={{ color: '#8B0000' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-3" style={{ color: '#8B0000' }}>Memuat data...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* External CSS Links */}
            <link 
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
                rel="stylesheet" 
            />
            <link 
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" 
                rel="stylesheet" 
            />
            
            <div className="bg-gradient-custom py-5">
                <div className="container">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold mb-3" style={{ color: '#8B0000' }}>
                            Tambah Event Baru
                        </h1>
                        <p className="lead text-muted">
                            Buat event menarik dengan guest star idol favorit
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10 col-xl-8">
                            <div className="card card-custom">
                                <div className="card-body p-4 p-md-5">
                                    {/* Alert Messages */}
                                    {error && (
                                        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            <div>{error}</div>
                                        </div>
                                    )}
                                    
                                    {success && (
                                        <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            <div>Event berhasil ditambahkan!</div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        {/* Nama Event */}
                                        <div className="mb-4">
                                            <label className="form-label label-custom">
                                                Nama Event *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="form-control form-control-custom"
                                                placeholder="Masukkan nama event"
                                            />
                                        </div>

                                        {/* Tanggal Event */}
                                        <div className="mb-4">
                                            <label className="form-label label-custom">
                                                Tanggal Event
                                            </label>
                                            <input
                                                type="date"
                                                onChange={handleDateChange}
                                                className="form-control form-control-custom mb-3"
                                            />
                                            {selectedDates.length > 0 && (
                                                <div className="d-flex flex-wrap gap-2">
                                                    {selectedDates.map((date, index) => (
                                                        <span key={index} className="badge badge-custom d-flex align-items-center">
                                                            {formatDate(date)}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeDateTag(date)}
                                                                className="close-btn ms-2"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Waktu Event */}
                                        <div className="mb-4">
                                            <label className="form-label label-custom">
                                                Waktu Event
                                            </label>
                                            <input
                                                type="time"
                                                name="time"
                                                value={form.time}
                                                onChange={handleChange}
                                                className="form-control form-control-custom"
                                            />
                                        </div>

                                        {/* Lokasi Event */}
                                        <div className="mb-4">
                                            <label className="form-label label-custom">
                                                Lokasi Event
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={form.location}
                                                onChange={handleChange}
                                                className="form-control form-control-custom"
                                                placeholder="Masukkan lokasi event"
                                            />
                                        </div>

                                        {/* Link Event */}
                                        <div className="mb-4">
                                            <label className="form-label label-custom">
                                                Link Event
                                            </label>
                                            <input
                                                type="url"
                                                name="link"
                                                value={form.link}
                                                onChange={handleChange}
                                                className="form-control form-control-custom"
                                                placeholder="https://example.com"
                                            />
                                        </div>

                                        {/* Guest Star Selector */}
                                        <div className="mb-4">
                                            <label className="form-label label-custom">
                                                Guest Star *
                                            </label>
                                            <div className="position-relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                                                    className="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center form-control-custom"
                                                    style={{ border: '2px solid #D2B48C', backgroundColor: 'white', color: '#6c757d' }}
                                                >
                                                    <span>
                                                        {form.guest.length > 0 
                                                            ? `${form.guest.length} idol dipilih` 
                                                            : 'Pilih Guest Star'
                                                        }
                                                    </span>
                                                    <span className={`transition ${isGuestDropdownOpen ? 'rotate-180' : ''}`}>
                                                        ▼
                                                    </span>
                                                </button>
                                                
                                                {isGuestDropdownOpen && (
                                                    <div className="position-absolute w-100 mt-2 bg-white dropdown-custom" style={{ zIndex: 1000 }}>
                                                        {/* Search Input */}
                                                        <div className="p-3 border-bottom">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                placeholder="Cari idol atau grup..."
                                                                value={guestSearchTerm}
                                                                onChange={(e) => setGuestSearchTerm(e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        
                                                        {/* Idol List */}
                                                        <div style={{ maxHeight: '16rem', overflowY: 'auto' }}>
                                                            {filteredIdols.length > 0 ? (
                                                                filteredIdols.map((idol) => (
                                                                    <div
                                                                        key={idol.id}
                                                                        onClick={() => handleGuestToggle(idol)}
                                                                        className="dropdown-item-custom p-3 cursor-pointer"
                                                                        style={{ cursor: 'pointer' }}
                                                                    >
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <div className="d-flex align-items-center">
                                                                                <img
                                                                                    src={idol.image}
                                                                                    alt={idol.name}
                                                                                    className="avatar-sm me-3"
                                                                                />
                                                                                <div>
                                                                                    <div className="fw-medium text-dark">{idol.name}</div>
                                                                                    <div className="text-muted small">{idol.group}</div>
                                                                                </div>
                                                                            </div>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={form.guest.some(g => g.id === idol.id)}
                                                                                onChange={() => {}}
                                                                                className="form-check-input"
                                                                                style={{ accentColor: '#8B0000' }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="p-4 text-center text-muted">
                                                                    <div className="small">Tidak ada idol yang ditemukan</div>
                                                                    {guestSearchTerm && (
                                                                        <div className="small">untuk pencarian "{guestSearchTerm}"</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Selected Guests Tags */}
                                            {form.guest.length > 0 && (
                                                <div className="mt-3 d-flex flex-wrap gap-2">
                                                    {form.guest.map((guest) => (
                                                        <span key={guest.id} className="badge badge-guest d-flex align-items-center">
                                                            <img
                                                                src={guest.image}
                                                                alt={guest.name}
                                                                className="avatar-xs me-2"
                                                            />
                                                            <span>{guest.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeGuestTag(guest.id)}
                                                                className="close-btn ms-2"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Kategori */}
                                        <div className="mb-4">
                                            <label className="form-label label-custom">
                                                Kategori
                                            </label>
                                            <select
                                                name="category"
                                                value={form.category}
                                                onChange={handleChange}
                                                className="form-select form-select-custom"
                                            >
                                                <option value="">Pilih Kategori</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* HTM */}
                                        <div className="mb-4">
                                            <label className="form-label label-custom">
                                                Harga Tiket Masuk (HTM)
                                            </label>
                                            <input
                                                type="text"
                                                name="htm"
                                                value={form.htm}
                                                onChange={handleChange}
                                                className="form-control form-control-custom"
                                                placeholder="Rp 0 - Gratis / Rp 50.000"
                                            />
                                        </div>

                                        {/* Upload Foto */}
                                        <div className="mb-5">
                                            <label className="form-label label-custom">
                                                Foto Event (Maksimal 3 foto)
                                            </label>
                                            <input
                                                type="file"
                                                name="photos"
                                                ref={fileInputRef}
                                                onChange={handleChange}
                                                multiple
                                                accept="image/*"
                                                className="form-control form-control-custom file-input-custom"
                                            />
                                            <div className="form-text text-muted">
                                                Format: JPG, PNG, atau GIF. Maksimal ukuran 5MB per foto.
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="d-grid">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="btn btn-custom btn-lg text-white fw-semibold py-3"
                                            >
                                                {loading ? (
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        Menyimpan Event...
                                                    </div>
                                                ) : (
                                                    'Tambah Event'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="text-center mt-4">
                                <p className="text-muted small">
                                    * Field yang wajib diisi untuk membuat event
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventForm;