'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/user/context/AuthContext';
import {
    Container, Row, Col, Card, Badge, Button,
    Nav, Tab, Form, Alert, Spinner, Toast, ToastContainer
} from 'react-bootstrap';
import { Calendar, Clock, MapPin, Heart, Bell, Settings, User, Bookmark, Trash2, Eye } from 'lucide-react';

export default function MyPageClient() {
    const { user } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('saved-events');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savedEvents, setSavedEvents] = useState([]);
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        eventReminders: true
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        if (user) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/user/profile');
            if (!res.ok) throw new Error('Gagal fetch data user');
            const data = await res.json();

            // Cek apakah belum set preferensi
            if (!data.user.favoriteCategories || data.user.favoriteCategories.length === 0) {
                router.replace('/user/preferences'); // redirect jika belum isi preferensi
                return;
            }

            setUserData(data.user);
            setSavedEvents(data.savedEvents || []);
            setPreferences({
                emailNotifications: data.user.emailNotifications,
                eventReminders: data.user.eventReminders
            });
        } catch (error) {
            console.error(error);
            showToastMessage('Gagal memuat data pengguna', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsaveEvent = async (eventId) => {
        try {
            const res = await fetch(`/api/user/events/${eventId}/unsave`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Gagal unsave event');
            setSavedEvents(prev => prev.filter(e => e.id !== eventId));
            showToastMessage('Event dihapus dari simpanan', 'success');
        } catch (err) {
            console.error(err);
            showToastMessage('Gagal hapus event', 'error');
        }
    };

    const handlePreferenceChange = async (key, value) => {
        try {
            const res = await fetch('/api/user/preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: value })
            });
            if (!res.ok) throw new Error('Gagal update preferensi');
            setPreferences(prev => ({ ...prev, [key]: value }));
            showToastMessage('Preferensi berhasil diperbarui', 'success');
        } catch (err) {
            console.error(err);
            showToastMessage('Gagal memperbarui preferensi', 'error');
        }
    };

    const showToastMessage = (msg, type = 'success') => {
        setToastMessage(msg);
        setToastType(type);
        setShowToast(true);
    };

    const formatDate = (dates) => {
        if (!dates || dates.length === 0) return 'TBA';
        const date = new Date(dates[0]);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const getEventStatus = (dates) => {
        if (!dates || dates.length === 0) return 'upcoming';
        const eventDate = new Date(dates[0]);
        const today = new Date();
        const diff = eventDate.getTime() - today.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return 'past';
        if (days === 0) return 'today';
        if (days === 1) return 'tomorrow';
        return 'upcoming';
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'today': return <Badge bg="success">Hari Ini</Badge>;
            case 'tomorrow': return <Badge bg="warning">Besok</Badge>;
            case 'past': return <Badge bg="secondary">Sudah Lewat</Badge>;
            default: return <Badge bg="primary">Akan Datang</Badge>;
        }
    };

    const getUpcomingEventsCount = () => {
        return savedEvents.filter(event => {
            const status = getEventStatus(event.date);
            return ['upcoming', 'today', 'tomorrow'].includes(status);
        }).length;
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    const profileImage = userData?.favoriteMembers?.[0]?.image;

    return (
        <>
            <Container className="py-4">
                <Row>
                    <Col md={3}>
                        <Card className="mb-4 shadow-sm text-center">
                            <Card.Body>
                                <div className="mb-3">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="Member Favorit"
                                            className="rounded-circle"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto"
                                            style={{ width: '80px', height: '80px' }}>
                                            <User size={40} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                <h5 className="mb-1">{userData?.name || 'User'}</h5>
                                <p className="text-muted small mb-0">{userData?.email}</p>
                                {userData?.favoriteMembers?.length > 0 && (
                                    <small className="text-primary">
                                        Fan of {userData.favoriteMembers[0].name}
                                    </small>
                                )}

                                <hr />
                                <div className="d-flex justify-content-around text-center">
                                    <div>
                                        <div className="fw-bold text-primary">{savedEvents.length}</div>
                                        <small className="text-muted">Event Disimpan</small>
                                    </div>
                                    <div>
                                        <div className="fw-bold text-success">{getUpcomingEventsCount()}</div>
                                        <small className="text-muted">Akan Datang</small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        <Nav variant="pills" className="flex-column">
                            <Nav.Item className="mb-2">
                                <Nav.Link
                                    active={activeTab === 'saved-events'}
                                    onClick={() => setActiveTab('saved-events')}
                                    className="d-flex align-items-center">
                                    <Bookmark size={18} className="me-2" />
                                    Event Tersimpan
                                    <Badge bg="secondary" className="ms-auto">{savedEvents.length}</Badge>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="mb-2">
                                <Nav.Link
                                    active={activeTab === 'preferences'}
                                    onClick={() => setActiveTab('preferences')}
                                    className="d-flex align-items-center">
                                    <Heart size={18} className="me-2" />
                                    Preferensi
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    active={activeTab === 'settings'}
                                    onClick={() => setActiveTab('settings')}
                                    className="d-flex align-items-center">
                                    <Settings size={18} className="me-2" />
                                    Pengaturan
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>

                    <Col md={9}>
                        <Tab.Content>
                            {activeTab === 'saved-events' && (
                                <div>
                                    <h4 className="mb-4">Event Tersimpan</h4>
                                    {savedEvents.length === 0 ? (
                                        <Alert variant="info" className="text-center">
                                            <Bookmark size={48} className="mb-3 text-muted" />
                                            <h5>Belum Ada Event Tersimpan</h5>
                                            <p>Yuk, simpan event favoritmu!</p>
                                            <Button variant="primary" href="/user">Jelajahi Event</Button>
                                        </Alert>
                                    ) : (
                                        <Row>
                                            {savedEvents.map(event => (
                                                <Col md={6} key={event.id} className="mb-4">
                                                    <Card className="h-100 shadow-sm">
                                                        <Card.Body>
                                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                                <h6 className="mb-0 flex-grow-1 me-2">{event.name}</h6>
                                                                {getStatusBadge(getEventStatus(event.date))}
                                                            </div>
                                                            <div className="text-muted small mb-3">
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <Calendar size={14} className="me-2 text-primary" />
                                                                    <span>{formatDate(event.date)}</span>
                                                                </div>
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <Clock size={14} className="me-2 text-primary" />
                                                                    <span>{event.time}</span>
                                                                </div>
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <MapPin size={14} className="me-2 text-primary" />
                                                                    <span>{event.location}</span>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    href={`/events/${event.slug}`}>
                                                                    <Eye size={14} className="me-1" />
                                                                    Detail
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleUnsaveEvent(event.id)}>
                                                                    <Trash2 size={14} className="me-1" />
                                                                    Hapus
                                                                </Button>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </div>
                            )}
                            {activeTab === 'preferences' && (
                                <div>
                                    <h4 className="mb-4">Preferensi Saya</h4>

                                    {/* Kategori Favorit */}
                                    <Card className="mb-4 shadow-sm">
                                        <Card.Header className="bg-primary text-white">
                                            <h5 className="mb-0">Kategori Favorit</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <p className="text-muted mb-3">
                                                Pilih kategori yang kamu sukai untuk mendapatkan rekomendasi event yang lebih personal.
                                            </p>
                                            <div className="d-flex flex-wrap gap-2">
                                                {userData?.favoriteCategories?.map(cat => (
                                                    <Badge key={cat.id} bg="primary" pill className="p-2">
                                                        {cat.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="mt-3"
                                                onClick={() => router.push('/user/preferences')}
                                            >
                                                <Settings size={16} className="me-1" />
                                                Ubah Preferensi
                                            </Button>
                                        </Card.Body>
                                    </Card>

                                    {/* Idol Favorit */}
                                    <Card className="mb-4 shadow-sm">
                                        <Card.Header className="bg-success text-white">
                                            <h5 className="mb-0">Idol Favorit</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <p className="text-muted mb-3">
                                                Idol yang kamu ikuti untuk mendapatkan notifikasi event terbaru.
                                            </p>
                                            {userData?.favoriteIdols?.length > 0 ? (
                                                <Row>
                                                    {userData.favoriteIdols.map(idol => (
                                                        <Col md={4} key={idol.id} className="mb-3">
                                                            <Card className="h-100 border-0 shadow-sm">
                                                                <Card.Body className="text-center p-3">
                                                                    <img
                                                                        src={idol.image || '/default-idol.png'}
                                                                        alt={idol.name}
                                                                        className="rounded-circle mb-2"
                                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                    />
                                                                    <h6 className="mb-1">{idol.name}</h6>
                                                                    <small className="text-muted">{idol.category?.name || 'Kategori'}</small>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            ) : (
                                                <Alert variant="info" className="text-center">
                                                    <Heart size={32} className="mb-2 text-muted" />
                                                    <p className="mb-0">Belum ada idol favorit yang dipilih</p>
                                                </Alert>
                                            )}
                                        </Card.Body>
                                    </Card>

                                    {/* Member Favorit */}
                                    <Card className="mb-4 shadow-sm">
                                        <Card.Header className="bg-warning text-dark">
                                            <h5 className="mb-0">Member Favorit</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <p className="text-muted mb-3">
                                                Member yang kamu sukai dari berbagai idol group.
                                            </p>
                                            {userData?.favoriteMembers?.length > 0 ? (
                                                <Row>
                                                    {userData.favoriteMembers.map(member => (
                                                        <Col md={4} key={member.id} className="mb-3">
                                                            <Card className="h-100 border-0 shadow-sm">
                                                                <Card.Body className="text-center p-3">
                                                                    <img
                                                                        src={member.image || '/default-member.png'}
                                                                        alt={member.name}
                                                                        className="rounded-circle mb-2"
                                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                    />
                                                                    <h6 className="mb-1">{member.name}</h6>
                                                                    <small className="text-muted">{member.idol?.name || 'Idol'}</small>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            ) : (
                                                <Alert variant="info" className="text-center">
                                                    <User size={32} className="mb-2 text-muted" />
                                                    <p className="mb-0">Belum ada member favorit yang dipilih</p>
                                                </Alert>
                                            )}
                                        </Card.Body>
                                    </Card>

                                    {/* Statistik */}
                                    <Card className="shadow-sm">
                                        <Card.Header className="bg-info text-white">
                                            <h5 className="mb-0">Statistik Preferensi</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row className="text-center">
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <div className="display-6 text-primary fw-bold">
                                                            {userData?.favoriteCategories?.length || 0}
                                                        </div>
                                                        <small className="text-muted">Kategori Favorit</small>
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <div className="display-6 text-success fw-bold">
                                                            {userData?.favoriteIdols?.length || 0}
                                                        </div>
                                                        <small className="text-muted">Idol Favorit</small>
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <div className="display-6 text-warning fw-bold">
                                                            {userData?.favoriteMembers?.length || 0}
                                                        </div>
                                                        <small className="text-muted">Member Favorit</small>
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <div className="display-6 text-info fw-bold">
                                                            {savedEvents.length}
                                                        </div>
                                                        <small className="text-muted">Event Tersimpan</small>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}
                            {activeTab === 'settings' && (
                                <div>
                                    <h4 className="mb-4">Pengaturan Notifikasi</h4>

                                    <Card className="shadow-sm">
                                        <Card.Header className="bg-light">
                                            <h6 className="mb-0 d-flex align-items-center">
                                                <Bell size={18} className="me-2" /> Notifikasi Email
                                            </h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Form.Check
                                                    type="switch"
                                                    id="notif-email"
                                                    label="Terima notifikasi email untuk event baru"
                                                    checked={preferences.emailNotifications}
                                                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                                                    className="mb-3"
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    id="notif-reminder"
                                                    label="Terima pengingat email H-1 sebelum event berlangsung"
                                                    checked={preferences.eventReminders}
                                                    onChange={(e) => handlePreferenceChange('eventReminders', e.target.checked)}
                                                />
                                            </Form>
                                            <hr />
                                            <div className="bg-light p-3 rounded">
                                                <small className="text-muted">
                                                    <strong>Catatan:</strong> Email dikirim berdasarkan kategori, idol, dan event yang kamu simpan.
                                                </small>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}
                        </Tab.Content>
                    </Col>
                </Row>
            </Container>

            <ToastContainer position="top-end" className="p-3">
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={4000}
                    autohide
                    bg={toastType === 'success' ? 'success' : 'danger'}>
                    <Toast.Body className="text-white">
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}