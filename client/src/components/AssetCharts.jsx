// client/src/components/AssetCharts.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient'; // Usa o cliente configurado para JWT
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'; 
// 🚨 Nota: Certifique-se de que o 'recharts' está instalado (npm install recharts)

// ----------------------------------------------------
// Função de Formatação: ESSENCIAL para o gráfico
// ----------------------------------------------------
const formatChartData = (snapshots) => {
    // Ordena os snapshots pela data, garantindo que o gráfico não fique bagunçado
    const sortedSnapshots = snapshots.sort((a, b) => new Date(a.snapshotDate) - new Date(b.snapshotDate));

    return sortedSnapshots.map(snapshot => {
        // 1. Soma o valor total do patrimônio (bruto e líquido) para este ponto de data
        const totalBruto = snapshot.assets.reduce((sum, asset) => sum + asset.bruto, 0);
        const totalLiquido = snapshot.assets.reduce((sum, asset) => sum + asset.liquido, 0);
        
        // 2. Cria um rótulo de data amigável (Mês/Ano)
        const date = new Date(snapshot.snapshotDate);
        // Garante que a data seja tratada como UTC para evitar inconsistências de fuso horário
        const label = `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`; // Ex: 1/1/2024
        
        return {
            name: label,
            totalBruto: totalBruto,
            totalLiquido: totalLiquido,
        };
    });
};


const AssetCharts = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    
    const fetchReportData = async () => {
        setLoading(true);
        setError('');
        
        try {
            // 🚨 Rota GET: /api/assets (onde o controller getAssetSnapshots está mapeado)
            const response = await apiClient.get('/assets'); 
            const snapshots = response.data; // Dados brutos do Backend
            
            if (snapshots.length < 2) {
                setError('Dados insuficientes. Mínimo de 2 pontos de histórico necessários.');
                setChartData([]);
                return;
            }
            
            // 2. Formata os dados antes de salvar no estado
            const formattedData = formatChartData(snapshots);
            setChartData(formattedData);
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(`Erro ao carregar histórico: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []); 

    // --- RENDERIZAÇÃO DE ESTADOS ---
    if (loading) return <p style={{ textAlign: 'center', marginTop: '30px' }}>Carregando dados de histórico...</p>;
    
    if (error) {
         return <p style={{ color: '#e74c3c', textAlign: 'center', marginTop: '30px' }}>{error}</p>;
    }
    
    // --- RENDERIZAÇÃO DO GRÁFICO ---
    return (
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
        <h2>Performance do Patrimônio (Histórico)</h2>
        
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                
                {/* 🚨 1. ESTILIZANDO O EIXO X (A DATA) */}
                <XAxis 
                    dataKey="name" 
                    // Propriedade 'tick' aceita um objeto com estilos
                    tick={{ fill: '#333333', fontSize: 12, fontWeight: 'bold' }} // Altera a cor e a fonte do rótulo
                    stroke="#2c3e50" // Altera a cor da linha do eixo
                />
                
                <YAxis 
                    tickFormatter={(value) => `R$ ${new Intl.NumberFormat('pt-BR').format(value)}`} 
                />
                
                {/* 🚨 2. ESTILIZANDO O TOOLTIP (A CAIXA POP-UP) */}
                <Tooltip 
                    formatter={(value) => [`R$ ${new Intl.NumberFormat('pt-BR').format(value)}`, 'Valor']} 
                    // contentStyle: Estiliza a caixa do Tooltip (fundo, borda, cor do texto)
                    contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #3498db', 
                        color: '#2c3e50', 
                        fontSize: 14 
                    }}
                    // labelStyle: Estiliza o rótulo da data dentro do Tooltip
                    labelStyle={{ 
                        fontWeight: 'bold', 
                        color: '#000' // Altera a cor da data no Tooltip para vermelho, por exemplo
                    }}
                />
                
                <Legend />
                
                <Line type="monotone" dataKey="totalBruto" stroke="#3498db" activeDot={{ r: 8 }} name="Valor Bruto Total" strokeWidth={2} />
                <Line type="monotone" dataKey="totalLiquido" stroke="#2ecc71" name="Valor Líquido Total" strokeWidth={2} />
                
            </LineChart>
        </ResponsiveContainer>
    </div>
    );
};

export default AssetCharts;