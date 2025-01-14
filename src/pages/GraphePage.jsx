import React, { useState, useCallback, useEffect } from 'react';
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
import { Button, Alert, Dropdown } from 'react-bootstrap';
import CustomNode from '../pages/CustomNode .jsx';

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
    const [selectedNode, setSelectedNode] = useState(null);  // Nœud sélectionné dans le dropdown
    const [chemins, setChemins] = useState({});  // Stocker les chemins retournés par l'API

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

    const convertToGraphe = (nodes, edges) => {
        const sommets = nodes.map(node => ({
            nom: node.id,
            arretes: edges
                .filter(edge => edge.source === node.id)
                .map(edge => ({
                    source: edge.source,
                    destination: edge.target,
                    poids: parseInt(edge.label) || 1, // Utiliser le label comme poids
                })),
        }));

        return { sommets };
    };

    // Fonction pour calculer le chemin le plus court
    const calculateShortestPath = async () => {
        // Convertir les nodes et edges en format Graphe
        const graphe = convertToGraphe(nodes, edges);

        // Demander le sommet de départ
        const startNode = prompt('Enter the start node:', nodes[0]?.id || '');

        if (!startNode) {
            alert('Start node is required.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/dijkstra/calculate?startNode=${startNode}&details=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(graphe),
            });

            if (!response.ok) {
                throw new Error('Failed to calculate shortest path.');
            }

            const result = await response.json();
            const chemins = result?.chemins || {};

            console.log("Chemins from API:", chemins); // Debug
            setChemins(chemins); // Mettre à jour les chemins dans l'état

            setResult(`Shortest Paths:\n${JSON.stringify(result, null, 2)}`);
        } catch (error) {
            console.error('Error:', error);
            setResult('An error occurred while calculating the shortest path.');
        }
    };

    // Met à jour les couleurs des nœuds en fonction du chemin sélectionné
    const colorPathNodes = (nodeId) => {
        console.log("Coloring path for node:", nodeId); // Debug
        const chemin = chemins[nodeId] || []; // Récupérer le chemin pour le nœud sélectionné
        console.log("Chemin:", chemin); // Debug

        // Met à jour les couleurs des nœuds
        setNodes((nds) =>
            nds.map((node) => {
                const isInPath = chemin.includes(node.id);  // Vérifier si le nœud est dans le chemin
                console.log(`Node ${node.id} is in path:`, isInPath); // Debug
                return {
                    ...node,
                    style: {
                        ...node.style,
                        color: isInPath ? 'green' : '', // Colorier le nœud
                    },
                };
            })
        );

        // Met à jour les couleurs des arêtes
        setEdges((edges) =>
            edges.map((edge) => {
                // Vérifier si l'arête est dans le chemin et si les nœuds source et cible sont consécutifs dans le chemin
                const isInPath = chemin.indexOf(edge.source) >= 0 && chemin.indexOf(edge.target) === chemin.indexOf(edge.source) + 1;
                console.log(`Edge ${edge.source}-${edge.target} is in path:`, isInPath); // Debug
                return {
                    ...edge,
                    style: {
                        ...edge.style,
                        stroke: isInPath ? 'green' : '', // Colorier l'arête
                        strokeWidth: isInPath ? 2 : 1, // Ajuster l'épaisseur de l'arête
                    },
                };
            })
        );
    };




    // Observer les changements dans les nœuds
    useEffect(() => {
        console.log("Nodes updated:", nodes); // Debug
    }, [nodes]);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', display: 'flex', gap: '10px', backgroundColor: '#f8f9fa' }}>
                <Button variant="primary" onClick={addNode}>Add Node</Button>
                <Button variant="secondary" onClick={displayGraph}>Display Graph</Button>
                <Button variant="success" onClick={calculateShortestPath}>Calculate Shortest Path</Button>
                <Button variant="warning" onClick={undo}>Undo (Ctrl+Z)</Button>
                {Object.keys(chemins).length > 0 && (
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Select Node
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.keys(chemins).map((nodeId) => (
                                <Dropdown.Item
                                    key={nodeId}
                                    onClick={() => {
                                        setSelectedNode(nodeId); // Mettre à jour le nœud sélectionné
                                        console.log("Selected Node:", nodeId); // Debug
                                        colorPathNodes(nodeId); // Colorier le chemin à partir de ce nœud
                                    }}
                                >
                                    {nodeId}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView={true}  // S'assurer que l'affichage s'ajuste après la mise à jour des nœuds
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