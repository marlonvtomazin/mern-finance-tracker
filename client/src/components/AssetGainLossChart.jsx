// client/src/components/AssetGainLossChart.jsx

import React, { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import apiClient from '../api/apiClient';

const AssetGainLossChart = () => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /**
     * Função que processa os snapshots para calcular o RENDIMENTO DIÁRIO
     * (Variação do Total Bruto e Total Líquido em relação ao dia anterior).
     */
    const processData = (snapshots) => {
        // Garantir que os snapshots estão ordenados por data
        snapshots.sort((a, b) => new Date(a.snapshotDate) - new Date(b.snapshotDate));

        // Precisamos de pelo menos dois pontos para calcular a diferença diária
        if (!snapshots || snapshots.length < 2) return []; 

        // 1. Calcular o Total Bruto e Total Líquido para CADA snapshot
        const totals = snapshots.map(s => {
            const totalBruto = s.assets.reduce((sum, item) => sum + item.bruto, 0);
            const totalLiquido = s.assets.reduce((sum, item) => sum + item.liquido, 0);
            
            return {
                date: new Date(s.snapshotDate).toLocaleDateString('pt-BR', {
                    month: '2-digit', day: '2-digit', year: 'numeric'
                }),
                totalBruto,
                totalLiquido
            };
        });

        // 2. Calcular o Rendimento Diário (Variação: Total Atual - Total Anterior)
        const dailyGains = [];
        
        for (let i = 1; i < totals.length; i++) {
            const previous = totals[i - 1];
            const current = totals[i];
            
            const dailyGainBruto = current.totalBruto - previous.totalBruto;
            const dailyGainLiquido = current.totalLiquido - previous.totalLiquido;
            
            // Objeto no formato que o Recharts espera para o gráfico de barras
            dailyGains.push({
                date: current.date,
                'Rendimento Bruto': dailyGainBruto, 
                'Rendimento Líquido': dailyGainLiquido, 
            });
        }

        return dailyGains;
    };

    // Busca os dados no backend
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                // Rota GET /api/assets (Retorna todos os snapshots)
                const response = await apiClient.get('/assets');
                const processed = processData(response.data);
                
                setHistoryData(processed);

            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message;
                setError(`Erro ao buscar dados do histórico: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Função para renderizar o Tooltip formatado (moeda)
    const renderTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={styles.tooltip}>
                    <p style={styles.tooltipLabel}>{`Data: ${label}`}</p>
                    {payload.map((p, index) => (
                        <p key={index} style={{ color: p.color, margin: '0' }}>
                            {`${p.name}: `}
                            <span style={{ fontWeight: 'bold' }}>{
                                new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(p.value)
                            }</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };
    
    // Função para formatar o eixo Y (abrevia números grandes)
    const formatYAxis = (tickItem) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(tickItem);
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '20px' }}>Carregando gráfico de rendimento...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>;
    // Se há menos de 2 pontos, não há rendimento diário para calcular
    if (historyData.length === 0) return <p style={{ textAlign: 'center', marginTop: '20px', color: '#7f8c8d' }}>Pelo menos dois snapshots são necessários para calcular o rendimento diário.</p>;

    return (
        <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Rendimento por data</h3>
            <ResponsiveContainer width="100%" height={450}>
                {/* 🚨 Alterado para BarChart */}
                <BarChart
                    data={historyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={formatYAxis} />
                    <Tooltip content={renderTooltip} />
                    <Legend />
                    
                    {/* 🚨 Barra para o Rendimento Bruto Diário */}
                    <Bar 
                        dataKey="Rendimento Bruto" 
                        fill="#3498db" // Azul (similar ao seu exemplo)
                        name="Rendimento Bruto por data"
                    />

                    {/* 🚨 Barra para o Rendimento Líquido Diário */}
                    <Bar 
                        dataKey="Rendimento Líquido" 
                        fill="#2ecc71" // Verde (similar ao seu exemplo)
                        name="Rendimento Líquido por data"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const styles = {
    chartContainer: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        maxWidth: '100%',
        marginTop: '20px',
    },
    chartTitle: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#2c3e50',
    },
    tooltip: {
        margin: 0,
        padding: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        fontSize: '14px',
    },
    tooltipLabel: {
        margin: '0 0 5px 0',
        fontWeight: 'bold',
        color: '#34495e',
    }
};

export default AssetGainLossChart;