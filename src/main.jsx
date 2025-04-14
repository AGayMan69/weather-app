// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import the global stylesheet FIRST
import './App.css';

// Import the main App component
import App from './App.jsx';

// Note: No need to import CitySearch here anymore, App handles it

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
