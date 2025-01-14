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
            <Handle
                type="target"
                position="top"
                id="target-top"
                style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'red' }}
            />

            <Handle
                type="source"
                position="bottom"
                id="source-bottom"
                style={{ bottom: '-10px', left: '50%', transform: 'translateX(-50%)' }}
            />

            <Handle
                type="target"
                position="left"
                id="target-left"
                style={{ left: '-10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'red'  }}
            />

            <Handle
                type="source"
                position="right"
                id="source-right"
                style={{ right: '-10px', top: '50%', transform: 'translateY(-50%)' }}
            />

            <div>{data.label}</div>
        </div>
    );
};

export default CustomNode;