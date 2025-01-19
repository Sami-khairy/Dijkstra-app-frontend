import React, {useEffect, useState} from 'react';
import { Form, Button, ListGroup, Card, Modal } from 'react-bootstrap';
import { FaSave, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

const Sidebar = ({ selectedNode, onUpdateNodeId, onClose, edges, setEdges, nodes, setNodes }) => {
    const [newNodeId, setNewNodeId] = useState(selectedNode?.id || '');
    const [showEdgeModal, setShowEdgeModal] = useState(false);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [newEdgeLabel, setNewEdgeLabel] = useState('');

    // Synchroniser newNodeId avec selectedNode?.id
    useEffect(() => {
        setNewNodeId(selectedNode?.id || '');
    }, [selectedNode]);

    // Modifier un arc
    const handleEditEdge = (edge) => {
        setSelectedEdge(edge);
        setNewEdgeLabel(edge.label || '');
        setShowEdgeModal(true);
    };

    const saveEdge = () => {
        setEdges((eds) =>
            eds.map((edge) =>
                edge.id === selectedEdge.id
                    ? { ...edge, label: newEdgeLabel }
                    : edge
            )
        );
        setShowEdgeModal(false);
        setSelectedEdge(null);
        onClose();

    };

    // Supprimer un nœud et ses arêtes associées
    const deleteNode = () => {
        if (window.confirm(`Are you sure you want to delete node ${selectedNode.id}?`)) {
            setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
            setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
            onClose();
        }
    };

    // Supprimer une arête
    const deleteEdge = (edgeId) => {
        if (window.confirm('Are you sure you want to delete this edge?')) {
            setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
        }
        onClose();

    };

    // Visualiser les connexions d'un nœud
    const nodeConnections = edges.filter(
        (edge) => edge.source === selectedNode.id || edge.target === selectedNode.id
    );

    return (
        <Card style={{ padding: '20px', backgroundColor: '#f8f9fa', height: '100%' }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>Node {selectedNode?.id}</h5>
                <Button variant="outline-danger" size="sm" onClick={onClose}>
                    <FaTimes />
                </Button>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Update Node ID</Form.Label>
                        <Form.Control
                            type="text"
                            value={newNodeId}
                            onChange={(e) => setNewNodeId(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        onClick={() => {
                            onUpdateNodeId(selectedNode.id, newNodeId); // Met à jour l'ID du nœud
                            onClose(); // Ferme la sidebar
                        }}
                        className="mb-3"
                    >
                        <FaSave /> Save
                    </Button>
                </Form>
                <Button variant="danger" onClick={deleteNode}>
                    <FaTrash /> Delete Node
                </Button>
                <hr />
                <h6>Node Connections:</h6>
                <ListGroup>
                    {nodeConnections.map((edge) => (
                        <ListGroup.Item key={edge.id}>
                            {edge.source} → {edge.target} (Weight: {edge.label || 'N/A'})
                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEditEdge(edge)}
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => deleteEdge(edge.id)}
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card.Body>

            {/* Modal pour modifier le poids d'une arête */}
            <Modal show={showEdgeModal} onHide={() => setShowEdgeModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Edge</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>New Weight</Form.Label>
                            <Form.Control
                                type="text"
                                value={newEdgeLabel}
                                onChange={(e) => setNewEdgeLabel(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEdgeModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={saveEdge}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

export default Sidebar;
