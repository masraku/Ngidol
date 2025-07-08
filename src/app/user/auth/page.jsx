'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { useAuth } from '@/app/user/context/AuthContext'; 

export default function UniversalLogin() {
  const router = useRouter();
  const { user, fetchUser } = useAuth(); // Ambil user & fetchUser
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Jika sudah login, redirect otomatis
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user/mypage');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Gagal login");
        setLoading(false);
        return;
      }

      await fetchUser(); // update context → akan trigger redirect dari useEffect
    } catch (error) {
      console.error("Login error", error);
      setErrorMsg("Terjadi kesalahan saat login");
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/user/auth/register');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "100%", maxWidth: "400px" }}>
        <Card.Body>
          <h3 className="mb-4 text-center">Login Akun</h3>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <span>Belum punya akun?</span>
            <Button variant="link" onClick={goToRegister} className="p-0 ms-1" disabled={loading}>
              Daftar Sekarang
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
