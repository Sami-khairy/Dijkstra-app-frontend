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
import Sidebar from './Sidebar'; // Importer le composant Sidebar

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
    const [selectedNode, setSelectedNode] = useState(null); // Nœud sélectionné dans le dropdown
    const [chemins, setChemins] = useState({}); // Stocker les chemins retournés par l'API
    const [showSidebar, setShowSidebar] = useState(false); // État pour afficher/masquer la barre latérale

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

        // Créer une représentation structurée du graphe
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

        // Mettre à jour le résultat avec la table
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
                    poids: parseInt(edge.label) || 1, // Utiliser le label comme poids
                })),
        }));

        return { sommets };
    };
    const calculateShortestPath = async () => {
        const graphe = convertToGraphe(nodes, edges);
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

            console.log("Chemins from API:", chemins);
            setChemins(chemins);
            setResult(`Shortest Paths:\n${JSON.stringify(result, null, 2)}`);
        } catch (error) {
            console.error('Error:', error);
            setResult('An error occurred while calculating the shortest path.');
        }
    };
    const colorPathNodes = (nodeId) => {
        console.log("Coloring path for node:", nodeId);
        const chemin = chemins[nodeId] || [];

        console.log("Chemin:", chemin);

        // Mettre à jour les couleurs des nœuds
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

        // Mettre à jour les couleurs des arêtes
        setEdges((eds) =>
            eds.map((edge) => {
                // Vérifier si l'arête est dans le chemin
                const isInPath = chemin.indexOf(edge.source) >= 0 && chemin.indexOf(edge.target) === chemin.indexOf(edge.source) + 1;

                if (isInPath) {
                    // Trouver tous les arcs entre edge.source et edge.target
                    const arcsBetweenNodes = edges.filter(
                        (e) => e.source === edge.source && e.target === edge.target
                    );

                    // Trouver l'arc avec le poids minimum
                    const minArc = arcsBetweenNodes.reduce((min, current) => {
                        return parseInt(current.label) < parseInt(min.label) ? current : min;
                    });

                    // Colorer uniquement l'arc avec le poids minimum
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

                // Ne pas colorer les autres arcs
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
    // Fonction pour gérer le clic sur un nœud
    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node); // Mettre à jour le nœud sélectionné
        setShowSidebar(true); // Afficher la barre latérale
    }, []);
    // Fonction pour mettre à jour le nom d'un nœud
    // Dans GraphePage
    const updateNodeId = (oldId, newId) => {
        // Vérifier si le nouvel id est unique
        const isIdUnique = !nodes.some((node) => node.id === newId);
        if (!isIdUnique) {
            alert("L'ID doit être unique. Veuillez en choisir un autre.");
            return;
        }

        // Mettre à jour l'id et le label du nœud
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === oldId) {
                    return {
                        ...node,
                        id: newId, // Mettre à jour l'id
                        data: {
                            ...node.data,
                            label: `Node ${newId}`, // Mettre à jour le label
                        },
                    };
                }
                return node;
            })
        );

        // Mettre à jour les arêtes connectées
        setEdges((eds) =>
            eds.map((edge) => {
                if (edge.source === oldId) {
                    return { ...edge, source: newId }; // Mettre à jour l'id source
                }
                if (edge.target === oldId) {
                    return { ...edge, target: newId }; // Mettre à jour l'id target
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
                <Button variant="success" onClick={calculateShortestPath}>Calculate Shortest Path</Button>
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
                    key={nodes.length} // Forcer le re-rendering de ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick} // Gérer le clic sur un nœud
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
                    onUpdateNodeId={updateNodeId} // Passer la fonction updateNodeId
                    onClose={() => setShowSidebar(false)}
                    edges={edges} // Passer les arcs
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