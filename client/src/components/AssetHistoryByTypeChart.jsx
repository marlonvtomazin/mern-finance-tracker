// client/src/components/AssetHistoryByTypeChart.jsx

import React, { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import apiClient from '../api/apiClient';

// 🚨 CORES BASE MAIS VIBRANTES (Ajustadas para a imagem)
const BASE_COLORS = [
    '#e74c3c', // Vermelho Vibrante
    '#3498db', // Azul Vibrante
    '#1abc9c', // Verde-Água Vibrante
    '#f1c40f', // Amarelo Vibrante
    '#9b59b6', // Roxo
    '#e67e22', // Laranja
    '#2ecc71', // Verde Esmeralda
    '#34495e', // Azul Escuro
];

// Função auxiliar para converter cor hex para rgba, usada no Valor Líquido
const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const AssetHistoryByTypeChart = () => {
    const [historyData, setHistoryData] = useState([]);
    const [assetNames, setAssetNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Função que processa os dados brutos do backend para o formato do recharts
    const processData = (snapshots) => {
        if (!snapshots || snapshots.length === 0) return { processed: [], names: [] };

        // 1. Coleta todos os nomes de ativos (usados como "Categoria")
        const allAssetNames = new Set();
        snapshots.forEach(s => {
            s.assets.forEach(a => allAssetNames.add(a.name));
        });
        const sortedAssetNames = Array.from(allAssetNames).sort();

        // 2. Transforma os dados: Array de objetos, onde cada objeto é uma data
        const processed = snapshots.map(s => {
            const dateLabel = new Date(s.snapshotDate).toLocaleDateString('pt-BR', {
                month: '2-digit', day: '2-digit', year: 'numeric'
            });

            // Objeto base para a data
            const dateObject = { 
                date: dateLabel 
            };

            // Adiciona as chaves de bruto e líquido para cada ativo
            s.assets.forEach(asset => {
                // Chaves no formato: "VALE3_bruto", "VALE3_liquido"
                dateObject[`${asset.name}_bruto`] = asset.bruto;
                dateObject[`${asset.name}_liquido`] = asset.liquido;
            });

            return dateObject;
        }); 
        // 🚨 O .reverse() FOI REMOVIDO para que a data aumente para a direita.

        return { processed, names: sortedAssetNames };
    };

    // Busca os dados no backend
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await apiClient.get('/assets');
                const { processed, names } = processData(response.data);
                
                setHistoryData(processed);
                setAssetNames(names);

            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message;
                setError(`Erro ao buscar dados do histórico: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Função para formatar o tooltip
    const renderTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={styles.tooltip}>
                    <p style={styles.tooltipLabel}>{`Data: ${label}`}</p>
                    {payload.map((p, index) => (
                        <p key={index} style={{ color: p.color, margin: '0' }}>
                            {`${p.name.replace('_bruto', ' (Bruto)').replace('_liquido', ' (Líquido)')}: `}
                            <span style={{ fontWeight: 'bold' }}>{
                                new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(p.value || 0) // Usa 0 se o valor for nulo
                            }</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };
    
    // Função para formatar o eixo Y
    const formatYAxis = (tickItem) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact', 
            maximumFractionDigits: 1
        }).format(tickItem);
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '20px' }}>Carregando gráfico de histórico...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>;
    if (historyData.length === 0) return <p style={{ textAlign: 'center', marginTop: '20px', color: '#7f8c8d' }}>Nenhum dado de snapshot encontrado para exibir.</p>;

    return (
        <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Evolução Bruto vs. Líquido por Ativo</h3>
            <ResponsiveContainer width="100%" height={450}>
                <BarChart
                    data={historyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    barCategoryGap="10%" // 🚨 Espaçamento entre as datas (ajusta a largura do grupo)
                    barGap={2} // 🚨 Espaçamento entre Bruto e Líquido (ajusta a largura da barra)
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={formatYAxis} />
                    <Tooltip content={renderTooltip} />
                    <Legend />
                    
                    {/* Renderiza as barras para cada ativo e tipo (Bruto/Líquido) */}
                    {assetNames.map((name, index) => {
                        const baseColor = BASE_COLORS[index % BASE_COLORS.length];
                        const colorBruto = baseColor;
                        const colorLiquido = hexToRgba(baseColor, 0.6); 

                        return [
                            // Barra para o Valor Bruto
                            <Bar 
                                key={`${name}-bruto`}
                                dataKey={`${name}_bruto`}
                                name={`${name} (Bruto)`}
                                fill={colorBruto}
                                minPointSize={5}
                            />,
                            // Barra para o Valor Líquido
                            <Bar 
                                key={`${name}-liquido`}
                                dataKey={`${name}_liquido`}
                                name={`${name} (Líquido)`}
                                fill={colorLiquido}
                                minPointSize={5}
                            />
                        ];
                    })}
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

export default AssetHistoryByTypeChart;