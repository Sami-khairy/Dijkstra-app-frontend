import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

const Sidebar = ({ selectedNode, onUpdateNodeId, onClose, edges, setEdges }) => {
    const [newNodeId, setNewNodeId] = useState(selectedNode?.id || '');

    const handleSave = () => {
        if (newNodeId.trim()) {
            onUpdateNodeId(selectedNode.id, newNodeId);
            onClose();
        }
    };

    // Fonction pour mettre à jour le poids d'un arc
    const handleEdgeLabelChange = (edgeId, newLabel) => {
        setEdges((eds) =>
            eds.map((edge) => {
                if (edge.id === edgeId) {
                    return { ...edge, label: newLabel };
                }
                return edge;
            })
        );
    };

    return (
        <div style={{
            width: '300px',
            height: '100vh',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderLeft: '1px solid #ddd',
            position: 'fixed',
            right: 0,
            top: 0,
        }}>
            <h4>Modifier le nœud</h4>
            {selectedNode ? (
                <>
                    <Form.Group>
                        <Form.Label>ID du nœud</Form.Label>
                        <Form.Control
                            type="text"
                            value={newNodeId}
                            onChange={(e) => setNewNodeId(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleSave} style={{ marginTop: '10px' }}>
                        Enregistrer
                    </Button>
                    <Button variant="secondary" onClick={onClose} style={{ marginTop: '10px', marginLeft: '10px' }}>
                        Fermer
                    </Button>

                    {/* Afficher les arcs connectés */}
                    <h4 style={{ marginTop: '20px' }}>Arcs connectés</h4>
                    <ListGroup>
                        {edges
                            .filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
                            .map((edge) => (
                                <ListGroup.Item key={edge.id}>
                                    <div>
                                        {edge.source} → {edge.target}: {edge.label}
                                    </div>
                                    <Form.Control
                                        type="text"
                                        value={edge.label}
                                        onChange={(e) => handleEdgeLabelChange(edge.id, e.target.value)}
                                        style={{ marginTop: '5px' }}
                                    />
                                </ListGroup.Item>
                            ))}
                    </ListGroup>
                </>
            ) : (
                <p>Sélectionnez un nœud pour le modifier.</p>
            )}
        </div>
    );
};

export default Sidebar;