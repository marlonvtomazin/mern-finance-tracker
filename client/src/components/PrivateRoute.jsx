// client/src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Componente que verifica a autenticação antes de renderizar a rota filha.
 */
const PrivateRoute = ({ children }) => {
    // 1. Verifica se há um token JWT armazenado no navegador
    const isAuthenticated = localStorage.getItem('token'); 

    if (isAuthenticated) {
        // 2. Se autenticado, renderiza os componentes filhos (ex: Dashboard)
        return children;
    } else {
        // 3. Se NÃO autenticado, redireciona para a página de Login
        // O replace=true garante que o histórico de navegação não seja poluído
        return <Navigate to="/login" replace />; 
    }
};

export default PrivateRoute;