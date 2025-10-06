// client/src/components/AssetSnapshotTable.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

// Componente de Tabela para gerenciar os pontos de histórico (Snapshots)
const AssetSnapshotTable = ({ onDataUpdate }) => {
    const [snapshots, setSnapshots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Função de Busca: Igual à do gráfico, mas aqui precisamos dos IDs
    const fetchSnapshots = async () => {
        setLoading(true);
        setError('');
        try {
            // Usa a mesma rota GET /api/assets
            const response = await apiClient.get('/assets');
            setSnapshots(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(`Erro ao carregar lista de Snapshots: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // Função de Exclusão (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja deletar este ponto de histórico? Esta ação é irreversível.")) {
            return;
        }

        try {
            // Rota DELETE /api/assets/:id
            await apiClient.delete(`/assets/${id}`);
            
            // 1. Atualiza a tabela (remove o item deletado)
            setSnapshots(prev => prev.filter(snapshot => snapshot._id !== id));
            
            // 2. Notifica o componente pai (AssetsPage) para que ele possa notificar o gráfico
            if (onDataUpdate) {
                onDataUpdate(); 
            }
            alert("Snapshot de ativo excluído com sucesso.");

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            alert(`Erro ao deletar Snapshot: ${errorMessage}`);
        }
    };

    // Calcula o valor total bruto/líquido para exibição na tabela
    const calculateTotals = (assets) => {
        const bruto = assets.reduce((sum, asset) => sum + asset.bruto, 0);
        const liquido = assets.reduce((sum, asset) => sum + asset.liquido, 0);
        
        const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);

        return {
            bruto: formatCurrency(bruto),
            liquido: formatCurrency(liquido)
        };
    };

    useEffect(() => {
        fetchSnapshots();
    }, []);

    if (loading) return <p>Carregando histórico...</p>;
    if (error) return <p style={{ color: '#e74c3c' }}>{error}</p>;
    if (snapshots.length === 0) return <p>Nenhum ponto de histórico encontrado. Insira dados via POST/Formulário.</p>;

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Pontos de Histórico Salvos ({snapshots.length})</h3>
            
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Data</th>
                        <th style={styles.th}>Total Bruto</th>
                        <th style={styles.th}>Total Líquido</th>
                        <th style={styles.th}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {snapshots.map(snapshot => {
                        const totals = calculateTotals(snapshot.assets);
                        const date = new Date(snapshot.snapshotDate).toLocaleDateString('pt-BR');
                        
                        return (
                            <tr key={snapshot._id} style={styles.tr}>
                                <td style={styles.td}>{date}</td>
                                <td style={styles.td}>{totals.bruto}</td>
                                <td style={styles.td}>{totals.liquido}</td>
                                <td style={styles.td}>
                                    <button 
                                        onClick={() => handleDelete(snapshot._id)} 
                                        style={styles.deleteButton}
                                        title="Excluir este ponto de histórico"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// ----------------------------------------------------
// ESTILOS BÁSICOS
// ----------------------------------------------------
const styles = {
    container: {
        marginTop: '50px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#f9f9f9'
    },
    title: {
        marginBottom: '20px',
        color: '#2c3e50',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '12px 15px',
        textAlign: 'left',
        borderBottom: '2px solid #34495e',
        backgroundColor: '#ecf0f1',
        color: '#34495e',
    },
    td: {
        padding: '10px 15px',
        borderBottom: '1px solid #ddd',
        verticalAlign: 'middle',
        color: '#000'
    },
    tr: {
        transition: 'background-color 0.2s ease',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    }
};

export default AssetSnapshotTable;