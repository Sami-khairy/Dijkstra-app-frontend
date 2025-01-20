import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
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
import { Button, Alert, Dropdown, Form, Modal } from 'react-bootstrap';
import CustomNode from '../pages/CustomNode .jsx';
import Sidebar from './Sidebar';
import { FaTable, FaPlus, FaPlay, FaTrash, FaInfoCircle, FaSave } from "react-icons/fa"; // Import des icônes
import ResultModal from './ResultModal';

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
    const [includeDetails, setIncludeDetails] = useState(true);
    const [showTable, setShowTable] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [isStaticDisplay, setIsStaticDisplay] = useState(false);

    // Réinitialiser tous les états
    const resetAll = () => {
        setNodes(initialNodes);
        setEdges(initialEdges);
        setNodeId(1);
        setResult('');
        setSelectedNode(null);
        setChemins({});
        setShowSidebar(false);
        setShowStartNodeDropdown(false);
        setIncludeDetails(true);
        setShowTable(false);
        setShowResultModal(false);
    };

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
            return newEdges.map((edge) => ({
                ...edge,
                animated: true, // Animation uniquement pour les arêtes
            }));
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
        setNodes((nds) => [...nds, newNode]);
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
        setShowTable(!showTable);
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
            setShowResultModal(true);
        } catch (error) {
            console.error('Error:', error);
            setResult('An error occurred while calculating the shortest path.');
        }
    };

    const handleStartNodeSelection = (nodeId) => {
        setShowStartNodeDropdown(false);
        setIsStaticDisplay(false); // Désactiver l'affichage statique
        calculateShortestPath(nodeId);
    };

    const colorPathNodes = (nodeId) => {
        const chemin = chemins[nodeId] || [];

        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                style: {
                    ...node.style,
                    color: chemin.includes(node.id) ? 'green' : '',
                },
            }))
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
                {/* Bouton Add Node */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="primary" onClick={addNode}>
                        <FaPlus /> Add Node
                    </Button>
                </motion.div>

                {/* Bouton Display Graph */}
                {edges.length > 0 && (

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="secondary" onClick={displayGraph}>
                        <FaTable /> {showTable ? 'Hide Table' : 'Show Table'}
                    </Button>
                </motion.div>

                )}

                {/* Bouton Reset */}
                {nodes.length > 0 && (

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="danger" onClick={resetAll}>
                        <FaTrash /> Reset
                    </Button>
                </motion.div>

                )}

                {/* Bouton View Detail */}
                {Object.keys(chemins).length > 0 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="info" onClick={() => {
                            setShowResultModal(true);
                            setIsStaticDisplay(true);// Activer l'affichage statique
                        }
                        }>
                            <FaInfoCircle /> View Detail
                        </Button>
                    </motion.div>
                )}

                {/* Switch Include Details */}


                {/* Dropdown Select Start Node */}
                {nodes.length > 0 && (
                    <Dropdown show={showStartNodeDropdown} onToggle={(isOpen) => setShowStartNodeDropdown(isOpen)}>
                        <Dropdown.Toggle variant="success" id="dropdown-start-node">
                            <FaPlay /> Select Start Node
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

                )}
                {nodes.length > 0 && (
                    <Form.Check
                        type="switch"
                        id="details-switch"
                        label="Include Details"
                        checked={includeDetails}
                        onChange={(e) => setIncludeDetails(e.target.checked)}
                    />
                )}

                {Object.keys(chemins).length > 0 && (
                        <Dropdown>
                            <Dropdown.Toggle variant="warning" id="dropdown-basic">
                                <FaPlay /> Select Node
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

            {/* ReactFlow */}
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

            {/* Sidebar */}
            <AnimatePresence>
                {showSidebar && (
                    <motion.div
                        style={{
                            width: '300px',
                            height: '100vh',
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderLeft: '1px solid #ddd',
                            position: 'fixed',
                            right: 0,
                            top: 0,
                        }}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Sidebar
                            selectedNode={selectedNode}
                            onUpdateNodeId={updateNodeId}
                            onClose={() => setShowSidebar(false)}
                            edges={edges}
                            setEdges={setEdges}
                            setNodes={setNodes}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tableau */}
            {showTable && result && (
                <Alert variant="info" style={{ margin: '20px' }}>
                    <pre>{result}</pre>
                </Alert>
            )}

            {/* Modal pour afficher le résultat */}
            <ResultModal
                show={showResultModal}
                onHide={() => setShowResultModal(false)}
                result={result}
                isStaticDisplay={isStaticDisplay}
            />
        </div>
    );
};

export default GraphePage;