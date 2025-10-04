import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // 🚨 IMPORTAÇÃO ESSENCIAL

// Usa o método createRoot para inicializar a aplicação
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 🚨 ENVOLVIMENTO OBRIGATÓRIO: Permite que o App.jsx use <Routes> e <Route> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);