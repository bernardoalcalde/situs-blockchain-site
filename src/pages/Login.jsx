import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      navigate('/dashboard');
    } catch (error) {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <div style={{height: "100vh", backgroundColor: "var(--color1)", margin: "0px 0px 0px 0px"}}>
      <Row className="justify-content-center">
        <Col style={{marginTop: "100px"}} md={6} lg={4}>
          <Card style={{maxWidth: "400px"}}>
            <Card.Body>
              <h2 className="text-center mb-4" style={{color: "#613000"}}>Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit} style={{color: "#613000"}}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-center w-100">
                  <Button className='mt-3' style={{backgroundColor: "#613000", border: "none"}} type="submit">
                    Entrar
                  </Button>
                </div>
              </Form>
              <div className="text-center mt-3">
                <Link to="/register">Criar conta</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
