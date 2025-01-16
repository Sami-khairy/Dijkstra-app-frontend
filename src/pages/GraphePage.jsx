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
import { Button, Alert, Dropdown, Form } from 'react-bootstrap'; // Ajouter Form
import CustomNode from '../pages/CustomNode .jsx';
import Sidebar from './Sidebar';

const nodeTypes = {
    customNode: CustomNode,
};

const initialNodes = [];
const initialEdges = [];

const GraphePage = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [nodeId, setNodeId] = useState(1);
    const [result, setResult] = useState('');
    const [selectedNode, setSelectedNode] = useState(null);
    const [chemins, setChemins] = useState({});
    const [showSidebar, setShowSidebar] = useState(false);
    const [showStartNodeDropdown, setShowStartNodeDropdown] = useState(false);
    const [includeDetails, setIncludeDetails] = useState(true); // État pour inclure ou non les détails

    const onConnect = useCallback((params) => {
        const edgeLabel = prompt('Enter value for the edge:', '1') || '1';
        params = {
            ...params,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#FF0000',
            },
            label: edgeLabel,
            labelStyle: { fill: '#000', fontSize: '12px' },
            labelBgStyle: { fill: '#fff', opacity: 0.8 },
            labelBgPadding: [4, 4],
            labelBgBorderRadius: 2,
        };
        setEdges((eds) => {
            const newEdges = addEdge(params, eds);
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
            return newNodes;
        });
        setNodeId((id) => id + 1);
    };

    const displayGraph = () => {
        const graphRepresentation = edges.map((edge) => ({
            source: edge.source,
            target: edge.target,
            label: edge.label || 'No Value',
        }));

        const graphTable = (
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Source</th>
                    <th>Target</th>
                    <th>Poids</th>
                </tr>
                </thead>
                <tbody>
                {graphRepresentation.map((edge, index) => (
                    <tr key={index}>
                        <td>{edge.source}</td>
                        <td>{edge.target}</td>
                        <td>{edge.label}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );

        setResult(
            <div>
                <h5>Graph Representation</h5>
                {graphTable}
            </div>
        );
    };

    const convertToGraphe = (nodes, edges) => {
        const sommets = nodes.map(node => ({
            nom: node.id,
            arretes: edges
                .filter(edge => edge.source === node.id)
                .map(edge => ({
                    source: edge.source,
                    destination: edge.target,
                    poids: parseInt(edge.label) || 1,
                })),
        }));

        return { sommets };
    };

    const calculateShortestPath = async (startNode) => {
        if (!startNode) {
            alert('Start node is required.');
            return;
        }

        const graphe = convertToGraphe(nodes, edges);

        try {
            const response = await fetch(`http://localhost:8080/api/dijkstra/calculate?startNode=${startNode}&details=${includeDetails}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(graphe),
            });

            if (!response.ok) {
                throw new Error('Failed to calculate shortest path.');
            }

            const result = await response.json();
            const chemins = result?.chemins || {};

            console.log("Chemins from API:", chemins);
            setChemins(chemins);
            setResult(`Shortest Paths:\n${JSON.stringify(result, null, 2)}`);
        } catch (error) {
            console.error('Error:', error);
            setResult('An error occurred while calculating the shortest path.');
        }
    };

    const handleStartNodeSelection = (nodeId) => {
        setShowStartNodeDropdown(false);
        calculateShortestPath(nodeId);
    };

    const colorPathNodes = (nodeId) => {
        console.log("Coloring path for node:", nodeId);
        const chemin = chemins[nodeId] || [];

        console.log("Chemin:", chemin);

        setNodes((nds) =>
            nds.map((node) => {
                const isInPath = chemin.includes(node.id);
                return {
                    ...node,
                    style: {
                        ...node.style,
                        color: isInPath ? 'green' : '',
                    },
                };
            })
        );

        setEdges((eds) =>
            eds.map((edge) => {
                const isInPath = chemin.indexOf(edge.source) >= 0 && chemin.indexOf(edge.target) === chemin.indexOf(edge.source) + 1;

                if (isInPath) {
                    const arcsBetweenNodes = edges.filter(
                        (e) => e.source === edge.source && e.target === edge.target
                    );

                    const minArc = arcsBetweenNodes.reduce((min, current) => {
                        return parseInt(current.label) < parseInt(min.label) ? current : min;
                    });

                    if (edge.id === minArc.id) {
                        return {
                            ...edge,
                            style: {
                                ...edge.style,
                                stroke: 'green',
                                strokeWidth: 2,
                            },
                        };
                    }
                }

                return {
                    ...edge,
                    style: {
                        ...edge.style,
                        stroke: '',
                        strokeWidth: 1,
                    },
                };
            })
        );
    };

    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node);
        setShowSidebar(true);
    }, []);

    const updateNodeId = (oldId, newId) => {
        const isIdUnique = !nodes.some((node) => node.id === newId);
        if (!isIdUnique) {
            alert("L'ID doit être unique. Veuillez en choisir un autre.");
            return;
        }

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === oldId) {
                    return {
                        ...node,
                        id: newId,
                        data: {
                            ...node.data,
                            label: `Node ${newId}`,
                        },
                    };
                }
                return node;
            })
        );

        setEdges((eds) =>
            eds.map((edge) => {
                if (edge.source === oldId) {
                    return { ...edge, source: newId };
                }
                if (edge.target === oldId) {
                    return { ...edge, target: newId };
                }
                return edge;
            })
        );
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', display: 'flex', gap: '10px', backgroundColor: '#f8f9fa' }}>
                <Button variant="primary" onClick={addNode}>Add Node</Button>
                <Button variant="secondary" onClick={displayGraph}>Display Graph</Button>

                {/* Interrupteur pour inclure ou non les détails */}
                <Form.Check
                    type="switch"
                    id="details-switch"
                    label="Include Details"
                    checked={includeDetails}
                    onChange={(e) => setIncludeDetails(e.target.checked)}
                />

                <Dropdown show={showStartNodeDropdown} onToggle={(isOpen) => setShowStartNodeDropdown(isOpen)}>
                    <Dropdown.Toggle variant="success" id="dropdown-start-node">
                        Select Start Node
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {nodes.map((node) => (
                            <Dropdown.Item
                                key={node.id}
                                onClick={() => handleStartNodeSelection(node.id)}
                            >
                                {node.id}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

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
                                        setSelectedNode(nodeId);
                                        colorPathNodes(nodeId);
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
                    key={nodes.length}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    fitView={true}
                    style={{ flex: 1 }}
                    nodeTypes={nodeTypes}
                >
                    <MiniMap />
                    <Controls />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>

            {showSidebar && (
                <Sidebar
                    selectedNode={selectedNode}
                    onUpdateNodeId={updateNodeId}
                    onClose={() => setShowSidebar(false)}
                    edges={edges}
                    setEdges={setEdges}
                />
            )}

            {result && (
                <Alert variant="info" style={{ margin: '20px' }}>
                    <pre>{result}</pre>
                </Alert>
            )}
        </div>
    );
};

export default GraphePage;