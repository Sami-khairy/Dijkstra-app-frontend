import React, { useState, useCallback } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    useEdgesState,
    useNodesState,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button, Alert } from 'react-bootstrap';
import CustomNode from "./CustomNode ";

const nodeTypes = {
    customNode: CustomNode,
};

const initialNodes = [];
const initialEdges = [];

const GraphePage = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [nodeId, setNodeId] = useState(1);
    const [history, setHistory] = useState([]);
    const [result, setResult] = useState('');

    const onConnect = useCallback((params) => {
        const edgeLabel = prompt('Enter value for the edge:', '1') || '1'; // Demander la valeur de l'arc
        params = {
            ...params,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#FF0000',
            },
            label: edgeLabel, // Ajouter le label à l'arc
            labelStyle: { fill: '#000', fontSize: '12px' }, // Personnaliser le style du label
            labelBgStyle: { fill: '#fff', opacity: 0.8 }, // Ajouter un fond au label
            labelBgPadding: [4, 4], // Padding autour du label
            labelBgBorderRadius: 2, // Bordure arrondie pour le fond du label
        };
        setEdges((eds) => {
            const newEdges = addEdge(params, eds);
            setHistory((hist) => [...hist, { nodes, edges: eds }]);
            return newEdges;
        });
    }, [setEdges, nodes]);

    const addNode = () => {
        const newNode = {
            id: `${nodeId}`,
            data: { label: `Node ${nodeId}` },
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            style: {
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #007bff',
            },
            type: 'customNode',
        };
        setNodes((nds) => {
            const newNodes = [...nds, newNode];
            setHistory((hist) => [...hist, { nodes: nds, edges }]);
            return newNodes;
        });
        setNodeId((id) => id + 1);
    };

    const undo = () => {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setNodes(lastState.nodes);
            setEdges(lastState.edges);
            setHistory((hist) => hist.slice(0, -1));
        }
    };

    const displayGraph = () => {
        const graphRepresentation = edges.map(
            (edge) => `${edge.source}-${edge.target}:${edge.label || 'No Value'}`
        );
        setResult(`Graph Representation:\n${graphRepresentation.join('\n')}`);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', display: 'flex', gap: '10px', backgroundColor: '#f8f9fa' }}>
                <Button variant="primary" onClick={addNode}>Add Node</Button>
                <Button variant="secondary" onClick={displayGraph}>Display Graph</Button>
                <Button variant="warning" onClick={undo}>Undo (Ctrl+Z)</Button>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    style={{ flex: 1 }}
                    nodeTypes={nodeTypes}
                >
                    <MiniMap />
                    <Controls />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>
            {result && (
                <Alert variant="info" style={{ margin: '20px' }}>
                    <pre>{result}</pre>
                </Alert>
            )}
        </div>
    );
};

export default GraphePage;