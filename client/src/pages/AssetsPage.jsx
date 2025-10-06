// client/src/pages/AssetsPage.jsx

import React from 'react';
import AssetCharts from '../components/AssetCharts';

const AssetsPage = () => {
    return (
        // O padding-top é essencial para o conteúdo não ficar escondido
        // atrás do Header fixo (que tem 60px de altura)
        <div className="page-content" style={{ paddingTop: '80px', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Meus Ativos e Histórico</h1>
            <p>Gerencie seus investimentos e visualize a performance do seu patrimônio ao longo do tempo.</p>
            
            {/* Componente do Gráfico de Snapshots */}
            <AssetCharts /> 
            
            {/* Futuramente, sua tabela de ativos atuais estará aqui */}
            <div style={{ marginTop: '50px' }}>
                <h2>Lista de Ativos Atuais</h2>
                {/* Ex: <AssetTable /> */}
                <p>Nenhuma tabela de ativos atual implementada ainda. O gráfico usa os dados históricos (Snapshots).</p>
            </div>

        </div>
    );
};

export default AssetsPage;