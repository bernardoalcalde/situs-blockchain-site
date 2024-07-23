import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = process.env.REACT_APP_TOKEN_SECRET;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register/`, {
        name,
        email,
        password,
        confirmPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setMessage('Usuário criado com sucesso!');
        navigate('/dashboard');
      } else {
        setMessage('Erro ao criar usuário: ' + response.data.message);
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao criar usuário');
    }
  };

  return (
    <div style={{height: "100vh", backgroundColor: "var(--color1)", margin: "0px 0px 0px 0px"}}>
      <Row className="justify-content-center">
        <Col style={{marginTop: "100px"}} md={6} lg={4}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4" style={{color: "#613000"}}>Criar Usuário</h2>
              {message && <Alert variant="info">{message}</Alert>}
              <Form onSubmit={handleSubmit} style={{color: "#613000"}}>
                <Form.Group controlId="formName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu email"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-center w-100">
                  <Button className='mt-3' style={{backgroundColor: "#613000", border: "none"}} type="submit">
                    Entrar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
