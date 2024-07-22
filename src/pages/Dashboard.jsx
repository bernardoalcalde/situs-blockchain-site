import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Modal, Button, Form, Card, Col, Row, Container } from 'react-bootstrap';
import axios from 'axios';

const projectId = '669d0f4c29a4bd84c1482f8b'; // ID do projeto Blockchain.Rio

const Dashboard = () => {
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [note, setNote] = useState('');
  const [title, setTitle] = useState('');
  const [evidences, setEvidences] = useState(null);
  const [file, setFile] = useState(null);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/points/project/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // busca as evidências de cada ponto
        let aux_pontos = response.data
        for (const point of aux_pontos) {
            try {
                const token = localStorage.getItem('authToken');
                const responseEvidences = await axios.get(`${process.env.REACT_APP_API_URL}/evidences/point/${point._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                point.evidences = responseEvidences.data;  // Adiciona as evidências diretamente ao ponto
            } catch (error) {
                console.error(`Erro ao buscar evidências para o ponto ${point._id}:`, error);
            }
        }
        setPoints(aux_pontos);
      } catch (error) {
        console.error('Error fetching points', error);
      }
    };

    fetchPoints();
  }, []);

  const handleMarkerClick = (point) => {
    setSelectedPoint(point);
    setEvidences(point.evidences);
    console.log(evidences)
  };

  const handleCloseModal = () => {
    setSelectedPoint(null);
    setNote('');
    setTitle('');
    setFile(null);
    setShowInsertModal(false);
    setShowConfirmation(false);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !note) return;
    setShowConfirmation(true);
  };

  const handleConfirmSave = async () => {
    if (!title || !note) return;

    const token = localStorage.getItem('authToken');

    try {
      const token = localStorage.getItem('authToken');

      // cria a evidência
      const evidenceData = await axios.post(`${process.env.REACT_APP_API_URL}/evidences/new`, { title, note, point: selectedPoint._id }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const evidenceId = evidenceData.data._id;
      console.log("Evidência cadastrada = ", evidenceData);
      console.log("nova evidencia = ", evidenceId);

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('refId', evidenceId);
        formData.append('refModel', 'Evidence');

        await axios.post(`${process.env.REACT_APP_API_URL}/images/upload/`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving evidence', error);
    }
  };

  const thumbnails = [
    { id: 'new', imageUrl: 'https://via.placeholder.com/150?text=Inserir+evidência', description: 'Inserir evidência' }
  ];

  return (
    <div>
      <MapContainer center={[-22.908333, -43.196388]} zoom={12} style={{ height: "100vh" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {points.map(point => (
          <Marker
            key={point._id}
            position={[point.location.coordinates[1], point.location.coordinates[0]]}
            eventHandlers={{
              click: () => handleMarkerClick(point),
            }}
          >
            <Popup>{point.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <Modal show={!!selectedPoint} onHide={handleCloseModal}>
        {selectedPoint && evidences && (
          <div>
            <Modal.Header closeButton>
              <Modal.Title>{selectedPoint.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Sobre</strong><br /> {selectedPoint.note}</p>
              <p><strong>Coordenadas</strong><br /> {selectedPoint.location.coordinates[1]}, {selectedPoint.location.coordinates[0]}</p>
              <Container>
                <Row>
                {evidences && evidences.map(evidence => (
                    <Col key={evidence.id} xs={6} md={4} lg={3} className="mb-4">
                      <Card onClick={() => evidence.id === 'new' ? setShowInsertModal(true) : null}>
                        <Card.Img 
                          variant="top" 
                          src={evidence.images[0] && evidence.images[0].name ? `${process.env.REACT_APP_API_URL}/images/${evidence.images[0].name}` : ''} 
                        />
                        <Card.Body>
                          <Card.Text>{evidence.title}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}                    
                  {thumbnails.map(thumbnail => (
                    <Col key={thumbnail.id} xs={6} md={4} lg={3} className="mb-4">
                      <Card onClick={() => thumbnail.id === 'new' ? setShowInsertModal(true) : null}>
                        <Card.Img variant="top" src={thumbnail.imageUrl} />
                        <Card.Body>
                          <Card.Text>{thumbnail.description}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Fechar</Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>

      <Modal show={showInsertModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Inserir Evidência</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control 
                type="text" 
                value={title} 
                onChange={handleTitleChange} 
                placeholder="Adicione um título" 
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Descrição</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={note} 
                onChange={handleNoteChange} 
                placeholder="Adicione uma descrição" 
              />
            </Form.Group>
            <Form.Group controlId="formFile">
              <Form.Label>Fotografias</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={() => setShowConfirmation(true)} block>
              Salvar
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Fechar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Inserção</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Esta evidência será cadastrada e não poderá ser alterada no futuro. Deseja continuar?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmSave}>Confirmar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
