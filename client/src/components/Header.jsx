// client/src/components/Header.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ onLogout }) => {
    const location = useLocation();
    // Verifica se o usuário está autenticado olhando o Local Storage
    const isAuthenticated = localStorage.getItem('token'); 
    
    // Só mostra o header/botão se o usuário estiver logado e não estiver na tela de login/register
    const showHeader = isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register';

    if (!showHeader) {
        return null;
    }

    return (
        <header style={styles.header}>
            <Link to="/" style={styles.logo}>Finance Tracker</Link>
            <nav>
                {/* Botão que chama a função de logout passada pelo App.jsx */}
                <button onClick={onLogout} style={styles.logoutButton}>
                    Sair
                </button>
            </nav>
        </header>
    );
};

// Estilos básicos para o tema escuro
const styles = {
    header: {
        backgroundColor: '#34495e',
        color: '#ecf0f1',
        padding: '10px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #4a6c8e',
    },
    logo: {
        color: '#1abc9c',
        textDecoration: 'none',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: '8px 15px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    }
};

export default Header;