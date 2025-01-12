import React from 'react';
import { Button } from 'react-bootstrap';

const Home = () => {
    return (
        <div>
            <h1>Bienvenue sur l'application de visualisation de graphes</h1>
            <p>Cliquez sur le bouton ci-dessous pour commencer.</p>
            <Button variant="primary" href="/graphe">
                Commencer
            </Button>
        </div>
    );
};

export default Home;