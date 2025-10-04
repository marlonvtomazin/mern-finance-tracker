// client/src/components/Header.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ onLogout }) => {
    const location = useLocation();
    // Verifica se o usuário está autenticado olhando o Local Storage
    const isAuthenticated = localStorage.getItem('token'); 
    
    // Mostra o Header apenas quando o usuário está autenticado
    const showHeader = isAuthenticated; 

    // Não renderiza o Header nas telas de Login e Registro
    if (!showHeader) {
        return null;
    }

    return (
        <header style={styles.header}>
            <Link to="/" style={styles.logo}>Finance Tracker</Link>
            
            <nav style={styles.nav}>
                {/* Links de navegação */}
                <Link to="/" style={styles.navLink}>Dashboard</Link>
                <Link to="/assets" style={styles.navLink}>Ativos</Link> 
                <Link to="/transactions" style={styles.navLink}>Transações</Link> 
                
                {/* Botão de Logout */}
                <button onClick={onLogout} style={styles.logoutButton}>
                    Sair
                </button>
            </nav>
        </header>
    );
};

// 🚨 ESTILOS ATUALIZADOS para fixar no topo e garantir a altura (60px)
const styles = {
    header: {
        backgroundColor: '#34495e',
        color: '#ecf0f1',
        padding: '10px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #4a6c8e',
        
        // 🚨 NOVO: Propriedades para fixar o Header no topo
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100%',
        height: '60px', // Altura definida, que corresponde ao padding-top no main
        zIndex: 100, // Garante que o Header fique acima de outros elementos
    },
    logo: {
        color: '#1abc9c',
        textDecoration: 'none',
        fontSize: '24px',
        fontWeight: 'bold',
        marginRight: '30px', 
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px', 
    },
    navLink: {
        color: '#ecf0f1',
        textDecoration: 'none',
        fontSize: '16px',
        padding: '5px 10px',
        transition: 'color 0.3s ease',
    },
    logoutButton: {
        padding: '8px 15px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginLeft: '20px',
        transition: 'background-color 0.3s ease',
    }
};

export default Header;