import React, { useState } from 'react';
import { Form, Button, ListGroup, Card, Modal } from 'react-bootstrap';
import { FaSave, FaTimes, FaEdit } from 'react-icons/fa';

const Sidebar = ({ selectedNode, onUpdateNodeId, onClose, edges, setEdges }) => {
    const [newNodeId, setNewNodeId] = useState(selectedNode?.id || '');
    const [showEdgeModal, setShowEdgeModal] = useState(false); // Pour afficher/masquer le modal
    const [selectedEdge, setSelectedEdge] = useState(null); // Pour stocker l'arc sélectionné
    const [newEdgeLabel, setNewEdgeLabel] = useState(''); // Pour stocker la nouvelle valeur de l'arc

    const handleSave = () => {
        if (newNodeId.trim()) {
            onUpdateNodeId(selectedNode.id, newNodeId);
            onClose();
        }
    };

    // Ouvrir le modal pour modifier l'arc
    const handleEditEdge = (edge) => {
        setSelectedEdge(edge);
        setNewEdgeLabel(edge.label);
        setShowEdgeModal(true);
    };

    // Enregistrer la modification de l'arc
    const handleSaveEdge = () => {
        if (selectedEdge) {
            setEdges((eds) =>
                eds.map((edge) => {
                    if (edge.id === selectedEdge.id) {
                        return { ...edge, label: newEdgeLabel };
                    }
                    return edge;
                })
            );
            setShowEdgeModal(false); // Fermer le modal
        }
    };

    return (
        <Card style={{
            width: '300px',
            height: '100vh',
            position: 'fixed',
            right: 0,
            top: 0,
        }}>
            <Card.Body>
                <Card.Title>Modifier le nœud</Card.Title>
                {selectedNode ? (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>ID du nœud</Form.Label>
                            <Form.Control
                                type="text"
                                value={newNodeId}
                                onChange={(e) => setNewNodeId(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSave} className="me-2">
                            <FaSave className="me-2" /> Enregistrer
                        </Button>
                        <Button variant="secondary" onClick={onClose}>
                            <FaTimes className="me-2" /> Fermer
                        </Button>

                        {/* Afficher les arcs connectés */}
                        <Card.Title className="mt-4">Arcs connectés</Card.Title>
                        <ListGroup>
                            {edges
                                .filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
                                .map((edge) => (
                                    <ListGroup.Item key={edge.id} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            {edge.source} → {edge.target}: {edge.label}
                                        </div>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleEditEdge(edge)}
                                        >
                                            <FaEdit />
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                        </ListGroup>

                        {/* Modal pour modifier l'arc */}
                        <Modal show={showEdgeModal} onHide={() => setShowEdgeModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Modifier l'arc</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group>
                                    <Form.Label>Nouvelle valeur de l'arc</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newEdgeLabel}
                                        onChange={(e) => setNewEdgeLabel(e.target.value)}
                                    />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEdgeModal(false)}>
                                    <FaTimes className="me-2" /> Annuler
                                </Button>
                                <Button variant="primary" onClick={handleSaveEdge}>
                                    <FaSave className="me-2" /> Enregistrer
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                ) : (
                    <Card.Text>Sélectionnez un nœud pour le modifier.</Card.Text>
                )}
            </Card.Body>
        </Card>
    );
};

export default Sidebar;