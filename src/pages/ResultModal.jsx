import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

// Animation pour le modal
const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3 } },
};

// Styles pour le scroll moderne (Chrome uniquement)
const scrollStyles = {
    maxHeight: '60vh', // Hauteur maximale du modal
    overflowY: 'auto', // Activer le défilement vertical
    paddingRight: '8px', // Espace pour éviter que le contenu ne chevauche la scrollbar
    scrollbarWidth: 'thin', // Pour Firefox (optionnel)
    scrollbarColor: '#888 transparent', // Pour Firefox (optionnel)
    '&::-webkit-scrollbar': {
        width: '8px', // Largeur de la scrollbar
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent', // Fond de la piste de la scrollbar
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888', // Couleur du curseur de la scrollbar
        borderRadius: '4px', // Bord arrondi du curseur
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#555', // Couleur du curseur au survol
    },
};

const ResultModal = ({ show, onHide, result }) => {
    const [streamedData, setStreamedData] = useState(''); // État pour simuler le flux de données
    const [isStreaming, setIsStreaming] = useState(false); // État pour contrôler le flux
    const contentRef = useRef(null); // Référence pour l'élément de contenu

    // Simuler un flux de données
    useEffect(() => {
        if (show && result) {
            setIsStreaming(true);
            let index = 0;
            const interval = setInterval(() => {
                if (index < result.length) {
                    setStreamedData((prev) => prev + result[index]);
                    index++;
                } else {
                    clearInterval(interval);
                    setIsStreaming(false);
                }
            }, 10); // Vitesse du flux (50ms par caractère)
            return () => clearInterval(interval);
        } else {
            setStreamedData(''); // Réinitialiser le flux lorsque le modal est fermé
        }
    }, [show, result]);

    // Faire défiler vers le bas à chaque mise à jour du texte
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [streamedData]);

    return (
        <AnimatePresence>
            {show && (
                <Modal
                    show={show}
                    onHide={onHide}
                    size="lg"
                    centered
                    backdrop="static"
                    keyboard={false}
                >
                    {/* Animation du modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Shortest Path Result</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={scrollStyles} ref={contentRef}>
                            <pre>{streamedData}</pre>
                            {isStreaming && (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </motion.div>
                </Modal>
            )}
        </AnimatePresence>
    );
};

export default ResultModal;