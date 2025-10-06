// client/src/pages/AssetsPage.jsx

import React, { useState } from 'react';
import AssetCharts from '../components/AssetCharts';
import AssetSnapshotTable from '../components/AssetSnapshotTable'; 
import AssetSnapshotForm from '../components/AssetSnapshotForm'; 

const AssetsPage = () => {
    // ESTADO DE CHAVE: Força o AssetCharts e a AssetSnapshotTable a recarregarem
    const [dataKey, setDataKey] = useState(0); 

    // Função que será chamada após um DELETE (na tabela) ou um POST (no formulário)
    const handleDataUpdate = () => {
        // Incrementa a chave para forçar os componentes filhos a re-montar/re-rodar o useEffect
        setDataKey(prevKey => prevKey + 1);
    };

    return (
        <div className="page-content" style={{ paddingTop: '80px', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Meus Ativos e Histórico</h1>
            
            {/* 🚨 Formulário de Múltiplos Ativos */}
            <AssetSnapshotForm onSnapshotSaved={handleDataUpdate} />
            
            <hr style={{ margin: '40px 0', borderTop: '1px solid #eee' }} />
            
            {/* Componente do Gráfico (Recarrega ao mudar dataKey) */}
            <AssetCharts key={`chart-${dataKey}`} /> 
            
            {/* Tabela de Gerenciamento (Recarrega ao mudar dataKey) */}
            <AssetSnapshotTable key={`table-${dataKey}`} onDataUpdate={handleDataUpdate} /> 

        </div>
    );
};

export default AssetsPage;