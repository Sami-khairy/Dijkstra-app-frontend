import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FaProjectDiagram, FaPlayCircle, FaChartLine, FaCode } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom'; // Assurez-vous d'utiliser react-router-dom pour la navigation

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

const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

const Home = () => {
    return (
        <div className="bg-light">
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
                                Créez, modifiez et explorez des graphes en temps réel. Utilisez des algorithmes puissants comme Dijkstra pour trouver les chemins les plus courts.
                            </motion.p>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                                transition={{ delay: 0.6 }}
                            >
                                <Link to="/graphe">
                                    <Button variant="light" size="lg" className="rounded-pill px-4 py-2">
                                        <FaPlayCircle className="me-2" /> Commencer
                                    </Button>
                                </Link>
                            </motion.div>
                        </Col>
                        <Col md={6} className="mt-4 mt-md-0">
                            <motion.img
                                src="/graph-visualization.png" // Remplacez par l'URL de votre image
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
                        <Col md={3} className="mb-4">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeInLeft}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body className="text-center">
                                        <FaProjectDiagram className="text-primary mb-3" size={48} />
                                        <Card.Title className="fw-bold">Création de Graphes</Card.Title>
                                        <Card.Text className="text-muted">
                                            Ajoutez des nœuds et des arêtes facilement. Personnalisez les poids et les labels.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                        <Col md={3} className="mb-4">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeInLeft}
                                transition={{ delay: 0.4 }}
                            >
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body className="text-center">
                                        <FaChartLine className="text-primary mb-3" size={48} />
                                        <Card.Title className="fw-bold">Algorithmes Avancés</Card.Title>
                                        <Card.Text className="text-muted">
                                            Utilisez l'algorithme de Dijkstra pour trouver les chemins les plus courts.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                        <Col md={3} className="mb-4">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeInRight}
                                transition={{ delay: 0.6 }}
                            >
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body className="text-center">
                                        <FaCode className="text-primary mb-3" size={48} />
                                        <Card.Title className="fw-bold">API Intégrée</Card.Title>
                                        <Card.Text className="text-muted">
                                            Connectez-vous à une API pour des calculs en temps réel.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                        <Col md={3} className="mb-4">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeInRight}
                                transition={{ delay: 0.8 }}
                            >
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body className="text-center">
                                        <FaPlayCircle className="text-primary mb-3" size={48} />
                                        <Card.Title className="fw-bold">Interface Interactive</Card.Title>
                                        <Card.Text className="text-muted">
                                            Une interface utilisateur intuitive et réactive pour une expérience fluide.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
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
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                                transition={{ delay: 0.6 }}
                            >
                                <Link to="/graphe">
                                    <Button variant="light" size="lg" className="rounded-pill px-4 py-2">
                                        <FaPlayCircle className="me-2" /> Démarrer l'Application
                                    </Button>
                                </Link>
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
                            <motion.p
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                                className="mb-0"
                            >
                                &copy; 2023 Graph Visualization Tool. Tous droits réservés.
                            </motion.p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
};

export default Home;