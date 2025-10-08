// client/src/pages/AssetGainLossPage.jsx

import React from 'react';
import AssetGainLossChart from '../components/AssetGainLossChart'; 

const AssetGainLossPage = () => {
    return (
        <div style={styles.container}>
            <h2>Gráfico: Evolução dos Ganhos vs. Perdas (Bruto - Líquido)</h2>
            <AssetGainLossChart />
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '80px auto 20px auto', // Garante que não fique sob o Header fixo
        padding: '0 20px',
    },
};

export default AssetGainLossPage;