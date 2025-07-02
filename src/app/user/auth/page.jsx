'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '@/app/user/context/AuthContext';

export default function LoginPage() {
  const {setUser, fetchUser}  = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await axios.post('/api/auth', { email, password });
      if (res.data.success) {
        await fetchUser();
        router.push('/admin');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <h3 className="mb-4 text-center">Login Admin</h3>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">Login</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
