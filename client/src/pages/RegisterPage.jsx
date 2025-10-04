// client/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient'; 

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
            const response = await apiClient.post('/auth/register', formData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/');
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro de conexão ou dados inválidos.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Utiliza a classe form-container para centralização e tema
        <div className="form-container">
            <h2>Criar uma Conta</h2>
            {error && <p className="form-error">{error}</p>}

            {/* Utiliza a classe form-content */}
            <form onSubmit={handleSubmit} className="form-content">
                
                <input
                    type="text"
                    name="name"
                    placeholder="Seu Nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input" // Classe para inputs
                />
                
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

                <button type="submit" disabled={loading} className="form-button"> {/* Classe para botões */}
                    {loading ? 'Registrando...' : 'Registrar'}
                </button>
            </form>

            <p className="form-link-text">
                Já tem uma conta? <Link to="/login" className="form-link">Faça Login</Link>
            </p>
        </div>
    );
};

export default RegisterPage;