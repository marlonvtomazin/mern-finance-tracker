// client/src/App.jsx (COMPLETO E ATUALIZADO)

import React from 'react'; 
import { Routes, Route, useNavigate } from 'react-router-dom'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
// 🚨 Importe a nova página de Ativos
import AssetsPage from './pages/AssetsPage'; 
import AssetHistoryByTypePage from './pages/AssetHistoryByTypePage';
import AssetGainLossPage from './pages/AssetGainLossPage';

import PrivateRoute from './components/PrivateRoute'; 
import Header from './components/Header'; 


function App() {
    const navigate = useNavigate(); 
    
    const handleLogout = () => {
        // 1. Remove o token do Local Storage
        localStorage.removeItem('token'); 
        
        // 2. Redireciona para o Login
        navigate('/login'); 
    };
    
    return (
        <>
            {/* O Header passa a função de logout para o componente */}
            <Header onLogout={handleLogout} /> 
            
            {/* O padding-top no main é crucial para o conteúdo não ficar
                escondido atrás do Header fixo */}
            <main style={{ minHeight: '100vh', paddingTop: '60px' }}> 
                <Routes>
                    
                    {/* Rotas Públicas */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* ------------------------------------------- */}
                    {/* ROTAS PROTEGIDAS (Usam o PrivateRoute)      */}
                    {/* ------------------------------------------- */}

                    {/* Rota Raiz (Dashboard) */}
                    <Route path="/" element={<PrivateRoute><DashboardPage onLogout={handleLogout} /> </PrivateRoute>} /> 

                    {/* 🚨 NOVA ROTA PROTEGIDA: Ativos */}
                    <Route path="/assets" element={<PrivateRoute><AssetsPage /> {/* Renderiza AssetsPage com o gráfico */}</PrivateRoute>} /> 

                    <Route path="/asset-type-history" element={<PrivateRoute><AssetHistoryByTypePage /></PrivateRoute>} /> 

                    <Route path="/asset-type-gain-loss" element={<PrivateRoute><AssetGainLossPage /></PrivateRoute>} /> 
                    
                    {/* Aqui entrariam outras rotas protegidas, como /transactions */}
                    {/* Exemplo: <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} /> */}
                    
                </Routes>
            </main>
        </>
    );
}

export default App;