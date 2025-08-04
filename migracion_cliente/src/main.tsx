// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';   //USAR HashRouter si utilizamos electron y si es que no, se utilizara BrowserRouter
import routes from '~react-pages';  
import './globals.css';

function App() {
  return useRoutes(routes);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
