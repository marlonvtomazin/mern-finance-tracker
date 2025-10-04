// client/src/App.jsx (COMPLETO E ATUALIZADO)

import React from 'react'; // 🚨 Importe o React
import { Routes, Route, useNavigate } from 'react-router-dom'; // 🚨 Importe o useNavigate
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute'; 

// Crie um Header básico para ter um botão de logout
import Header from './components/Header'; 


function App() {
    // Use useNavigate para redirecionar após o logout
    const navigate = useNavigate(); 
    
    // 🚨 NOVA FUNÇÃO: Lógica de Logout
    const handleLogout = () => {
        // 1. Remove o token do Local Storage (o passo mais importante)
        localStorage.removeItem('token'); 
        
        // 2. Redireciona para o Login
        navigate('/login'); 
    };
    
    return (
        <>
            {/* O Header passa a função de logout para o componente */}
            <Header onLogout={handleLogout} /> 
            <main>
                <Routes>
                    
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    <Route 
                        path="/" 
                        element={
                            <PrivateRoute>
                                {/* O Dashboard também recebe a função de logout, se necessário */}
                                <DashboardPage onLogout={handleLogout} /> 
                            </PrivateRoute>
                        } 
                    /> 
                </Routes>
            </main>
        </>
    );
}

export default App;