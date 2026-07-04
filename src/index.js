import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss'; // Ensure you have this file for global styles
import App from './App';

// This connects your React components to the <div id="root"> 
// located in your public/index.html file
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);