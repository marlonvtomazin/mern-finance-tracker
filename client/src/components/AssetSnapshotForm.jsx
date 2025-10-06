// client/src/components/AssetSnapshotForm.jsx

import React, { useState } from 'react';
import apiClient from '../api/apiClient';

// Helper para criar um novo ativo vazio
const createNewAsset = () => ({
    id: Date.now() + Math.random(), // Chave única para o React
    name: '',
    bruto: '',
    liquido: ''
});

const AssetSnapshotForm = ({ onSnapshotSaved }) => {
    const [snapshotDate, setSnapshotDate] = useState('');
    // Estado para a lista de ativos (o corpo da requisição real)
    const [assets, setAssets] = useState([createNewAsset()]);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // -----------------------------------------------------------------
    // Funções de Gerenciamento do Array de Ativos
    // -----------------------------------------------------------------
    const handleAssetChange = (index, e) => {
        const { name, value } = e.target;
        const newAssets = assets.map((asset, i) => {
            if (i === index) {
                // Converte Bruto/Líquido para número, se for o campo correto
                const val = (name === 'bruto' || name === 'liquido') ? parseFloat(value) : value;
                return { ...asset, [name]: val };
            }
            return asset;
        });
        setAssets(newAssets);
        setMessage('');
        setError('');
    };

    const handleAddAsset = () => {
        setAssets([...assets, createNewAsset()]);
    };

    const handleRemoveAsset = (id) => {
        // Garante que o usuário não delete todos os ativos por acidente (mínimo 1)
        if (assets.length === 1) {
            setError('Deve haver pelo menos um ativo para registrar o snapshot.');
            return;
        }
        setAssets(assets.filter(asset => asset.id !== id));
    };


    // -----------------------------------------------------------------
    // Submissão do Formulário
    // -----------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        
        // 1. Validação
        if (!snapshotDate) {
            setError("A Data do Snapshot é obrigatória.");
            setLoading(false);
            return;
        }

        // Remove ativos vazios ou inválidos e valida
        const validAssets = assets.filter(asset => 
            asset.name && 
            asset.bruto !== '' && !isNaN(asset.bruto) && asset.bruto >= 0 && 
            asset.liquido !== '' && !isNaN(asset.liquido) && asset.liquido >= 0
        ).map(({ id, ...rest }) => rest); // Remove a chave 'id' local

        if (validAssets.length === 0) {
            setError("Nenhum ativo válido foi inserido. Preencha pelo menos um item.");
            setLoading(false);
            return;
        }

        // 2. MONTA O JSON NO FORMATO ESPERADO PELO BACKEND
        // { "YYYY-MM-DD": [ { name: 'Reserva', bruto: 5000, liquido: 5000 }, ... ] }
        const dataToSend = {
            [snapshotDate]: validAssets.map(asset => ({
                nome: asset.name, // O backend espera 'nome' minúsculo
                bruto: asset.bruto,
                liquido: asset.liquido
            }))
        };
        
        try {
            // 3. Envia para a rota POST /api/assets (que lida com Upsert)
            await apiClient.post('/assets', dataToSend);
            
            setMessage(`Snapshot para ${snapshotDate} salvo/atualizado com sucesso!`);
            
            // 4. Notifica o pai para recarregar a tabela e o gráfico
            if (onSnapshotSaved) {
                onSnapshotSaved();
            }

            // 5. Limpa o formulário
            setSnapshotDate('');
            setAssets([createNewAsset()]);

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(`Erro ao salvar Snapshot: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };


    // -----------------------------------------------------------------
    // RENDERIZAÇÃO
    // -----------------------------------------------------------------
    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Registrar Novo Ponto de Histórico (Múltiplos Ativos)</h3>
            <p style={styles.tip}>Insira o valor de cada ativo individual para a data selecionada. O sistema somará os totais.</p>

            {error && <p style={styles.error}>{error}</p>}
            {message && <p style={styles.success}>{message}</p>}

            <form onSubmit={handleSubmit}>
                {/* Campo de Data (Único para todos os ativos) */}
                <div style={{ ...styles.inputGroup, marginBottom: '20px' }}>
                    <label style={styles.label}>Data do Snapshot (AAAA-MM-DD):</label>
                    <input
                        type="date"
                        name="date"
                        value={snapshotDate}
                        onChange={(e) => setSnapshotDate(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                
                <h4 style={styles.sectionTitle}>Detalhes dos Ativos:</h4>
                
                {/* Loop para Renderizar os Ativos */}
                {assets.map((asset, index) => (
                    <div key={asset.id} style={styles.assetRow}>
                        
                        <input
                            type="text"
                            name="name"
                            placeholder="Nome do Ativo (Ex: Ações, FIIs)"
                            value={asset.name}
                            onChange={(e) => handleAssetChange(index, e)}
                            required
                            style={{ ...styles.input, flex: 3 }}
                        />
                        <input
                            type="number"
                            name="bruto"
                            placeholder="Valor Bruto (R$)"
                            value={asset.bruto}
                            onChange={(e) => handleAssetChange(index, e)}
                            step="0.01"
                            required
                            style={{ ...styles.input, flex: 2 }}
                        />
                        <input
                            type="number"
                            name="liquido"
                            placeholder="Valor Líquido (R$)"
                            value={asset.liquido}
                            onChange={(e) => handleAssetChange(index, e)}
                            step="0.01"
                            required
                            style={{ ...styles.input, flex: 2 }}
                        />
                        
                        {assets.length > 1 && (
                            <button 
                                type="button" 
                                onClick={() => handleRemoveAsset(asset.id)} 
                                style={styles.removeButton}
                                title="Remover este ativo"
                            >
                                X
                            </button>
                        )}
                    </div>
                ))}
                
                <button type="button" onClick={handleAddAsset} style={styles.addButton}>
                    + Adicionar Outro Ativo
                </button>

                <button type="submit" disabled={loading} style={styles.submitButton}>
                    {loading ? 'Salvando Snapshot...' : 'Salvar Snapshot'}
                </button>
            </form>
        </div>
    );
};

// ----------------------------------------------------
// ESTILOS BÁSICOS
// ----------------------------------------------------
const styles = {
    container: {
        marginTop: '30px',
        border: '1px solid #3498db',
        borderRadius: '8px',
        padding: '25px',
        backgroundColor: '#f4faff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    title: {
        color: '#2c3e50',
        marginBottom: '10px',
    },
    tip: {
        fontSize: '14px',
        color: '#7f8c8d',
        marginBottom: '20px',
        borderLeft: '3px solid #3498db',
        paddingLeft: '10px',
    },
    sectionTitle: {
        color: '#34495e',
        marginTop: '15px',
        marginBottom: '15px',
        borderBottom: '1px dashed #ccc',
        paddingBottom: '5px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#2c3e50',
    },
    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        minWidth: 0,
    },
    assetRow: {
        display: 'flex',
        gap: '10px',
        marginBottom: '15px',
        alignItems: 'center',
    },
    addButton: {
        padding: '8px 15px',
        backgroundColor: '#1abc9c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginBottom: '20px',
        width: '100%',
    },
    submitButton: {
        padding: '12px 15px',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '100%',
    },
    removeButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '35px',
        height: '35px',
        flexShrink: 0,
    },
    error: {
        color: '#e74c3c',
        fontWeight: 'bold',
        marginBottom: '15px',
    },
    success: {
        color: '#2ecc71',
        fontWeight: 'bold',
        marginBottom: '15px',
    }
};

export default AssetSnapshotForm;