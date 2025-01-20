import React, { useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FaProjectDiagram, FaPlayCircle, FaChartLine, FaCode } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Variants pour les animations
const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

// Composant du portail
const Portal = ({ isOpen }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Cercles d'énergie */}
                    {Array.from({ length: 10 }).map((_, i) => {
                        // Générer des positions aléatoires pour chaque cercle
                        const randomTop = Math.random() * 100; // Position verticale aléatoire (0% à 100%)
                        const randomLeft = Math.random() * 100; // Position horizontale aléatoire (0% à 100%)
                        const randomSize = 100 + Math.random() * 200; // Taille aléatoire entre 100px et 300px

                        return (
                            <motion.div
                                key={`circle-${i}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: [0, 1, 1.5],
                                    opacity: [0, 1, 0.8],
                                    rotateZ: [0, 180, 360],
                                }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                    duration: 1.5,
                                    delay: i * 0.2,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    position: 'fixed',
                                    top: `${randomTop}%`, // Position verticale aléatoire
                                    left: `${randomLeft}%`, // Position horizontale aléatoire
                                    width: `${randomSize}px`, // Taille aléatoire
                                    height: `${randomSize}px`, // Taille aléatoire
                                    borderRadius: '50%',
                                    border: '4px solid #4a90e2',
                                    transform: 'translate(-50%, -50%)', // Centrer le cercle sur sa position
                                    zIndex: 9997,
                                    boxShadow: '0 0 50px #4a90e2',
                                }}
                            />
                        );
                    })}




                </>
            )}
        </AnimatePresence>
    );
};

const Home = () => {
    const [isPortalOpen, setIsPortalOpen] = useState(false);
    const navigate = useNavigate();

    const handleStartClick = () => {
        setIsPortalOpen(true);
        setTimeout(() => {
            navigate('/graphe');
        }, 2000);
    };

    return (
        <>
            <Portal isOpen={isPortalOpen} />

            <div className={`bg-light ${isPortalOpen ? 'blur-out' : ''}`}>
                {/* Hero Section */}
                <section className="bg-primary text-white py-5">
                    <Container>
                        <Row className="align-items-center">
                            <Col md={6} className="text-center text-md-start">
                                <motion.h1
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeInUp}
                                    className="display-4 fw-bold mb-4"
                                >
                                    Visualisez et Analysez vos Graphes
                                </motion.h1>
                                <motion.p
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeInUp}
                                    transition={{ delay: 0.3 }}
                                    className="lead mb-4"
                                >
                                    Créez, modifiez et explorez des graphes en temps réel.
                                    Utilisez des algorithmes puissants comme Dijkstra pour
                                    trouver les chemins les plus courts.
                                </motion.p>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="light"
                                        size="lg"
                                        className="rounded-pill px-4 py-2"
                                        onClick={handleStartClick}
                                        disabled={isPortalOpen}
                                    >
                                        <FaPlayCircle className="me-2" /> Commencer
                                    </Button>
                                </motion.div>
                            </Col>
                            <Col md={6} className="mt-4 mt-md-0">
                                <motion.img
                                    src="/graph-visualization.png"
                                    alt="Graph Visualization"
                                    className="img-fluid rounded shadow"
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeInRight}
                                    transition={{ delay: 0.3 }}
                                />
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Features Section */}
                <section className="py-5">
                    <Container>
                        <motion.h2
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="text-center mb-5 display-5 fw-bold text-primary"
                        >
                            Fonctionnalités
                        </motion.h2>
                        <Row>
                            {[
                                {
                                    icon: FaProjectDiagram,
                                    title: "Création de Graphes",
                                    text: "Ajoutez des nœuds et des arêtes facilement. Personnalisez les poids et les labels."
                                },
                                {
                                    icon: FaChartLine,
                                    title: "Algorithmes Avancés",
                                    text: "Utilisez l'algorithme de Dijkstra pour trouver les chemins les plus courts."
                                },
                                {
                                    icon: FaCode,
                                    title: "API Intégrée",
                                    text: "Connectez-vous à une API pour des calculs en temps réel."
                                },
                                {
                                    icon: FaPlayCircle,
                                    title: "Interface Interactive",
                                    text: "Une interface utilisateur intuitive et réactive pour une expérience fluide."
                                }
                            ].map((feature, index) => (
                                <Col md={3} className="mb-4" key={index}>
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        variants={index < 2 ? fadeInLeft : fadeInRight}
                                        transition={{ delay: 0.2 * (index + 1) }}
                                    >
                                        <Card className="h-100 shadow-sm border-0 hover-card">
                                            <Card.Body className="text-center">
                                                <feature.icon className="text-primary mb-3" size={48} />
                                                <Card.Title className="fw-bold">{feature.title}</Card.Title>
                                                <Card.Text className="text-muted">
                                                    {feature.text}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* Call to Action Section */}
                <section className="bg-primary text-white py-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={8} className="text-center">
                                <motion.h2
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeInUp}
                                    className="display-5 fw-bold mb-4"
                                >
                                    Prêt à Explorer ?
                                </motion.h2>
                                <motion.p
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeInUp}
                                    transition={{ delay: 0.3 }}
                                    className="lead mb-4"
                                >
                                    Commencez dès maintenant à créer et analyser vos graphes en quelques clics.
                                </motion.p>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="light"
                                        size="lg"
                                        className="rounded-pill px-4 py-2"
                                        onClick={handleStartClick}
                                        disabled={isPortalOpen}
                                    >
                                        <FaPlayCircle className="me-2" /> Démarrer l'Application
                                    </Button>
                                </motion.div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Footer */}
                <footer className="bg-dark text-white py-3">
                    <Container>
                        <Row>
                            <Col className="text-center">
                                <p className="mb-0">
                                    &copy; 2024 Graph Visualization Tool. Tous droits réservés.
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </footer>
            </div>
        </>
    );
};

export default Home;