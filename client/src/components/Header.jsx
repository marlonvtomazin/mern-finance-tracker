// client/src/components/Header.jsx

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ onLogout }) => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('token'); 
    
    const [isAssetsDropdownOpen, setIsAssetsDropdownOpen] = useState(false); 
    const [dropdownLinkHover, setDropdownLinkHover] = useState(null); 
    
    if (!isAuthenticated) {
        return null;
    }

    const handleMouseEnter = () => setIsAssetsDropdownOpen(true);
    const handleMouseLeave = () => {
        setIsAssetsDropdownOpen(false);
        setDropdownLinkHover(null); 
    };

    // Função auxiliar para aplicar estilos de hover nos links
    const getLinkStyle = (linkName) => ({
        ...styles.dropdownLink,
        ...(dropdownLinkHover === linkName ? styles.dropdownLinkHover : {})
    });

    return (
        <header style={styles.header}>
            <Link to="/" style={styles.logo}>Finance Tracker</Link>
            
            <nav style={styles.nav}>
                <Link to="/" style={styles.navLink}>Dashboard</Link>
                
                {/* DROPDOWN DE ATIVOS */}
                <div 
                    style={styles.dropdown}
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave} 
                >
                    <span style={styles.dropdownTitle}>
                        Ativos <span style={styles.dropdownArrow}>▼</span>
                    </span>
                    
                    {isAssetsDropdownOpen && (
                        <div style={styles.dropdownContent}>
                            {/* Histórico: Formulário e Lista de Snapshots */}
                            <Link 
                                to="/assets" // Mantém a rota original de gerenciamento de snapshots
                                style={getLinkStyle('history')}
                                onMouseEnter={() => setDropdownLinkHover('history')}
                                onMouseLeave={() => setDropdownLinkHover(null)}
                            >
                                Histórico (Total ao longo do tempo)
                            </Link>
                            
                            {/* Histórico: Separado por Tipo (Bruto vs Líquido) */}
                            <Link 
                                to="/asset-type-history" 
                                style={getLinkStyle('type-history')}
                                onMouseEnter={() => setDropdownLinkHover('type-history')}
                                onMouseLeave={() => setDropdownLinkHover(null)}
                            > 
                                Histórico (Separado por Tipo)
                            </Link>

                            {/* NOVO LINK: Evolução dos Ganhos */}
                            <Link 
                                to="/asset-type-gain-loss" 
                                style={getLinkStyle('type-gain-loss')}
                                onMouseEnter={() => setDropdownLinkHover('type-gain-loss')}
                                onMouseLeave={() => setDropdownLinkHover(null)}
                            > 
                                Histórico (Ganho vs Perda)
                            </Link>
                        </div>
                    )}
                </div>
                
                <Link to="/transactions" style={styles.navLink}>Transações</Link> 
                
                <button onClick={onLogout} style={styles.logoutButton}>
                    Sair
                </button>
            </nav>
        </header>
    );
};

// ----------------------------------------------------
// ESTILOS MODERNIZADOS (Com correção do display duplicado no dropdown)
// ----------------------------------------------------
const styles = {
    header: {
        backgroundColor: '#2c3e50', 
        color: '#ecf0f1',
        padding: '10px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #34495e',
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100%',
        height: '60px', 
        zIndex: 100,
    },
    logo: {
        color: '#2ecc71', 
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
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    // DROPDOWN
    dropdown: {
        position: 'relative',
        display: 'flex', // 🚨 Corrigido: Mantido apenas 'flex'
        alignItems: 'center',
        height: '100%', 
    },
    dropdownTitle: {
        color: '#ecf0f1',
        fontSize: '16px',
        padding: '5px 10px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    dropdownArrow: {
        marginLeft: '5px',
        fontSize: '10px',
    },
    dropdownContent: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        backgroundColor: '#34495e', 
        minWidth: '250px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)', 
        zIndex: 101, 
        top: '100%', 
        left: '0',
        padding: '8px 0', 
        borderRadius: '6px', 
        border: '1px solid #4a6c8e',
        transition: 'opacity 0.2s ease-out', 
    },
    dropdownLink: {
        color: '#ecf0f1',
        padding: '10px 16px',
        textDecoration: 'none',
        display: 'block',
        fontSize: '14px',
        transition: 'background-color 0.1s ease-in',
    },
    dropdownLinkHover: {
        backgroundColor: '#2c3e50', 
        color: '#2ecc71', 
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