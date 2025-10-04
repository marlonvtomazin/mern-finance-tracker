// client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/login', formData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/');
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro de conexão ou credenciais inválidas.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Utiliza a classe form-container
        <div className="form-container">
            <h2>Acessar sua Conta</h2>
            {error && <p className="form-error">{error}</p>}

            {/* Utiliza a classe form-content */}
            <form onSubmit={handleSubmit} className="form-content">
                
                <input
                    type="email"
                    name="email"
                    placeholder="Seu Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
                
                <input
                    type="password"
                    name="password"
                    placeholder="Sua Senha"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                />

                <button type="submit" disabled={loading} className="form-button">
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>

            <p className="form-link-text">
                Não tem uma conta? <Link to="/register" className="form-link">Crie uma agora</Link>
            </p>
        </div>
    );
};

export default LoginPage;