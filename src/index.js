import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Dans index.js ou App.js
const ignoreResizeObserverError = () => {
    const originalError = console.error;
    console.error = (...args) => {
        if (args[0]?.includes('ResizeObserver loop completed with undelivered notifications')) {
            return; // Ignore cette erreur spécifique
        }
        originalError(...args); // Affiche les autres erreurs normalement
    };
};

ignoreResizeObserverError();

root.render(
    <App />
);


