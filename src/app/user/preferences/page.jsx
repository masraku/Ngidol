'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/user/context/AuthContext';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner,
  Badge, Toast, ToastContainer, Modal
} from 'react-bootstrap';
import { Heart, Settings, Save, ArrowLeft, Plus, X, Check } from 'lucide-react';

export default function PreferencesPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Data states
  const [categories, setCategories] = useState([]);
  const [idols, setIdols] = useState([]);
  const [members, setMembers] = useState([]);
  
  // Selected preferences
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedIdols, setSelectedIdols] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  // Filter states
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [searchMember, setSearchMember] = useState('');

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const categoriesRes = await fetch('/api/category');
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.data || []);
      
      // Fetch idols
      const idolsRes = await fetch('/api/idol');
      const idolsData = await idolsRes.json();
      setIdols(idolsData || []);
      
      // Extract members from idols
      const allMembers = [];
      idolsData.forEach(idol => {
        if (idol.members) {
          idol.members.forEach(member => {
            allMembers.push({
              ...member,
              idol: { id: idol.id, name: idol.name, category: idol.category }
            });
          });
        }
      });
      setMembers(allMembers);
      
      // Fetch current user preferences
      const userRes = await fetch('/api/user/profile');
      const userData = await userRes.json();
      
      if (userData.user) {
        setSelectedCategories(userData.user.favoriteCategories?.map(c => c.id) || []);
        setSelectedIdols(userData.user.favoriteIdols?.map(i => i.id) || []);
        setSelectedMembers(userData.user.favoriteMembers?.map(m => m.id) || []);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      showToastMessage('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleIdolToggle = (idolId) => {
    setSelectedIdols(prev => 
      prev.includes(idolId) 
        ? prev.filter(id => id !== idolId)
        : [...prev, idolId]
    );
  };

  const handleMemberToggle = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const savePreferences = async () => {
    if (selectedCategories.length === 0) {
      showToastMessage('Pilih minimal satu kategori', 'error');
      return;
    }

    try {
      setSaving(true);
      
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryIds: selectedCategories,
          idolIds: selectedIdols,
          memberIds: selectedMembers
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan preferensi');
      }

      showToastMessage('Preferensi berhasil disimpan!', 'success');
      setTimeout(() => {
        router.push('/user/mypage');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      showToastMessage('Gagal menyimpan preferensi', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToastMessage = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
  };

  const filteredMembers = members.filter(member => {
    const matchesCategory = !selectedCategoryFilter || 
      member.idol?.category?.id === parseInt(selectedCategoryFilter);
    const matchesSearch = !searchMember || 
      member.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      member.idol?.name.toLowerCase().includes(searchMember.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getSelectedCategoryNames = () => {
    return categories
      .filter(cat => selectedCategories.includes(cat.id))
      .map(cat => cat.name);
  };

  const getSelectedIdolNames = () => {
    return idols
      .filter(idol => selectedIdols.includes(idol.id))
      .map(idol => idol.name);
  };

  const getSelectedMemberNames = () => {
    return members
      .filter(member => selectedMembers.includes(member.id))
      .map(member => `${member.name} (${member.idol?.name})`);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <>
      <Container className="py-4">
        <Row>
          <Col md={12}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  className="me-3"
                  onClick={() => router.back()}
                >
                  <ArrowLeft size={16} />
                </Button>
                <div>
                  <h3 className="mb-0">Pengaturan Preferensi</h3>
                  <p className="text-muted mb-0">Sesuaikan preferensi untuk mendapatkan rekomendasi yang lebih personal</p>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={savePreferences}
                disabled={saving || selectedCategories.length === 0}
              >
                {saving ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} className="me-2" />
                    Simpan Preferensi
                  </>
                )}
              </Button>
            </div>

            {/* Progress Summary */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Row className="text-center">
                  <Col md={4}>
                    <div className="mb-2">
                      <div className={`h4 mb-0 ${selectedCategories.length > 0 ? 'text-success' : 'text-muted'}`}>
                        {selectedCategories.length}
                      </div>
                      <small className="text-muted">Kategori Dipilih</small>
                      {selectedCategories.length > 0 && <Check size={16} className="text-success ms-1" />}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <div className={`h4 mb-0 ${selectedIdols.length > 0 ? 'text-success' : 'text-muted'}`}>
                        {selectedIdols.length}
                      </div>
                      <small className="text-muted">Idol Dipilih</small>
                      {selectedIdols.length > 0 && <Check size={16} className="text-success ms-1" />}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <div className={`h4 mb-0 ${selectedMembers.length > 0 ? 'text-success' : 'text-muted'}`}>
                        {selectedMembers.length}
                      </div>
                      <small className="text-muted">Member Dipilih</small>
                      {selectedMembers.length > 0 && <Check size={16} className="text-success ms-1" />}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Categories Selection */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Pilih Kategori Favorit</h5>
                <Badge bg="light" text="dark">{selectedCategories.length} dipilih</Badge>
              </Card.Header>
              <Card.Body>
                <Alert variant="info" className="small">
                  <strong>Wajib:</strong> Pilih minimal satu kategori untuk mendapatkan rekomendasi event yang sesuai.
                </Alert>
                <Row>
                  {categories.map(category => (
                    <Col md={4} key={category.id} className="mb-2">
                      <Card
                        className={`cursor-pointer border-2 ${
                          selectedCategories.includes(category.id) 
                            ? 'border-primary bg-primary bg-opacity-10' 
                            : 'border-light'
                        }`}
                        onClick={() => handleCategoryToggle(category.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body className="text-center py-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-medium">{category.name}</span>
                            {selectedCategories.includes(category.id) && (
                              <Check size={16} className="text-primary" />
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Idols Selection */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Pilih Idol Favorit</h5>
                <Badge bg="light" text="dark">{selectedIdols.length} dipilih</Badge>
              </Card.Header>
              <Card.Body>
                <Alert variant="info" className="small">
                  <strong>Opsional:</strong> Pilih idol yang kamu sukai untuk mendapatkan notifikasi event terbaru.
                </Alert>
                <Row>
                  {idols.map(idol => (
                    <Col md={4} key={idol.id} className="mb-3">
                      <Card
                        className={`cursor-pointer border-2 ${
                          selectedIdols.includes(idol.id) 
                            ? 'border-success bg-success bg-opacity-10' 
                            : 'border-light'
                        }`}
                        onClick={() => handleIdolToggle(idol.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body className="text-center py-3">
                          <img
                            src={idol.image || '/default-idol.png'}
                            alt={idol.name}
                            className="rounded-circle mb-2"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-start">
                              <h6 className="mb-0">{idol.name}</h6>
                              <small className="text-muted">{idol.category?.name}</small>
                            </div>
                            {selectedIdols.includes(idol.id) && (
                              <Check size={16} className="text-success" />
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Members Selection */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Pilih Member Favorit</h5>
                <Badge bg="light" text="dark">{selectedMembers.length} dipilih</Badge>
              </Card.Header>
              <Card.Body>
                <Alert variant="info" className="small">
                  <strong>Opsional:</strong> Pilih member individual yang kamu sukai dari berbagai idol group.
                </Alert>
                
                {/* Filters */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    >
                      <option value="">Semua Kategori</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Cari member atau idol..."
                      value={searchMember}
                      onChange={(e) => setSearchMember(e.target.value)}
                    />
                  </Col>
                </Row>

                <Row>
                  {filteredMembers.map(member => (
                    <Col md={4} key={member.id} className="mb-3">
                      <Card
                        className={`cursor-pointer border-2 ${
                          selectedMembers.includes(member.id) 
                            ? 'border-warning bg-warning bg-opacity-10' 
                            : 'border-light'
                        }`}
                        onClick={() => handleMemberToggle(member.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body className="text-center py-3">
                          <img
                            src={member.image || '/default-member.png'}
                            alt={member.name}
                            className="rounded-circle mb-2"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-start">
                              <h6 className="mb-0">{member.name}</h6>
                              <small className="text-muted">{member.idol?.name}</small>
                            </div>
                            {selectedMembers.includes(member.id) && (
                              <Check size={16} className="text-warning" />
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                
                {filteredMembers.length === 0 && (
                  <Alert variant="secondary" className="text-center">
                    Tidak ada member yang sesuai dengan filter
                  </Alert>
                )}
              </Card.Body>
            </Card>

            {/* Save Button */}
            <div className="text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={savePreferences}
                disabled={saving || selectedCategories.length === 0}
                className="px-5"
              >
                {saving ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Menyimpan Preferensi...
                  </>
                ) : (
                  <>
                    <Save size={20} className="me-2" />
                    Simpan Preferensi
                  </>
                )}
              </Button>
              {selectedCategories.length === 0 && (
                <div className="text-danger small mt-2">
                  Pilih minimal satu kategori untuk melanjutkan
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
          autohide
          bg={toastType === 'success' ? 'success' : 'danger'}
        >
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}