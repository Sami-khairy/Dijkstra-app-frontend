import React from 'react';
import { Handle } from 'reactflow';

const CustomNode = ({ data }) => {
    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '10px',
            border: '2px solid #007bff',
            width: '100px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            {/* Handle pour l'entrée 1 (en haut) */}
            <Handle
                type="target" // Ce handle est une cible (entrée)
                position="top" // Position en haut du nœud
                id="target-top" // Identifiant unique pour ce handle
                style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)' }}
            />

            {/* Handle pour la sortie 1 (en bas) */}
            <Handle
                type="source" // Ce handle est une source (sortie)
                position="bottom" // Position en bas du nœud
                id="source-bottom" // Identifiant unique pour ce handle
                style={{ bottom: '-10px', left: '50%', transform: 'translateX(-50%)' }}
            />

            {/* Handle pour l'entrée 2 (à gauche) */}
            <Handle
                type="target" // Ce handle est une cible (entrée)
                position="left" // Position à gauche du nœud
                id="target-left" // Identifiant unique pour ce handle
                style={{ left: '-10px', top: '50%', transform: 'translateY(-50%)' }}
            />

            {/* Handle pour la sortie 2 (à droite) */}
            <Handle
                type="source" // Ce handle est une source (sortie)
                position="right" // Position à droite du nœud
                id="source-right" // Identifiant unique pour ce handle
                style={{ right: '-10px', top: '50%', transform: 'translateY(-50%)' }}
            />

            <div>{data.label}</div>
        </div>
    );
};

export default CustomNode;