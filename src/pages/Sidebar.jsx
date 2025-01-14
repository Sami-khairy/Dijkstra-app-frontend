import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const Sidebar = ({ selectedNode, onUpdateNodeId, onClose }) => {
    const [newNodeId, setNewNodeId] = useState(selectedNode?.id || '');

    const handleSave = () => {
        if (newNodeId.trim()) {
            onUpdateNodeId(selectedNode.id, newNodeId);
            onClose();
        }
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
                </>
            ) : (
                <p>Sélectionnez un nœud pour le modifier.</p>
            )}
        </div>
    );
};

export default Sidebar;