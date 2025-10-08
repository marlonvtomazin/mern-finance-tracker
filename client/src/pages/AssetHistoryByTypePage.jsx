// client/src/pages/AssetHistoryByTypePage.jsx

import React from 'react';
import AssetHistoryByTypeChart from '../components/AssetHistoryByTypeChart';

const AssetHistoryByTypePage = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Histórico de Patrimônio (Separado por Ativo/Tipo)</h1>
            
            <p style={styles.subtitle}>Esta visualização exibe a evolução do valor Bruto e Líquido para cada ativo registrado (tratado como categoria) ao longo dos seus snapshots.</p>

            <AssetHistoryByTypeChart />
            
        </div>
    );
};

const styles = {
    container: {
        paddingTop: '80px', 
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    title: {
        marginBottom: '10px',
        color: '#2c3e50',
    },
    subtitle: {
        marginBottom: '30px',
        color: '#7f8c8d',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
    }
};

export default AssetHistoryByTypePage;