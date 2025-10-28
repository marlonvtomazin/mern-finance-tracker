# 💰 Finance Tracker

Um sistema completo de gerenciamento de finanças pessoais e acompanhamento de portfólio de ativos, construído com a *MERN stack* (MongoDB, Express, React, Node.js). Este projeto permite que usuários rastreiem o valor de seus ativos ao longo do tempo (snapshots) e visualizem seu desempenho diário.

## ✨ Funcionalidades Principais

* **Autenticação JWT:** Registro e Login de usuários seguro.
* **Gerenciamento de Ativos (Snapshots):** Registre o valor bruto e líquido de seus ativos em datas específicas para criar um histórico.
* **Visualização de Histórico:**
    * Gráfico de Evolução do Patrimônio ao longo do tempo.
    * Gráfico de Rentabilidade Diária (Bruta vs. Líquida).
* **Frontend Moderno:** Interface de usuário limpa e responsiva construída com React e Recharts.
* **Backend Robusto:** API RESTful protegida com middlewares de autenticação.

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
| :--- | :--- |
| **Frontend** | React (Hooks, Context/State), React Router DOM, Axios |
| **Visualização** | Recharts (Gráficos) |
| **Backend** | Node.js, Express |
| **Banco de Dados** | MongoDB (usando Mongoose ODM) |
| **Autenticação** | JSON Web Tokens (JWT), bcryptjs |

## 🚀 Como Executar o Projeto Localmente

Siga estas etapas para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

* Node.js (versão LTS recomendada)
* npm ou yarn
* Uma instância do MongoDB (local ou na nuvem, ex: MongoDB Atlas)

### 1. Configuração do Backend (`server/`)

1.  **Instalação de Dependências:**
    ```bash
    cd server
    npm install
    ```

2.  **Variáveis de Ambiente:**
    Crie um arquivo chamado **`.env`** na pasta `server/` e adicione as seguintes variáveis:
    ```
    # Variáveis do MongoDB
    MONGO_URI=mongodb+srv://<SEU_USUARIO>:<SUA_SENHA>@<SEU_CLUSTER>.mongodb.net/finance_tracker?retryWrites=true&w=majority

    # Variáveis de Autenticação JWT
    JWT_SECRET=sua_chave_secreta_muito_longa_e_forte
    PORT=5000 
    ```

3.  **Iniciar o Servidor:**
    ```bash
    npm run dev 
    # ou 'node index.js' se você não tiver nodemon configurado
    ```
    O backend será executado em `http://localhost:5000`.

### 2. Configuração do Frontend (`client/`)

1.  **Instalação de Dependências:**
    ```bash
    cd ../client
    npm install
    ```

2.  **Iniciar o Cliente:**
    ```bash
    npm run dev 
    ```
    O frontend será executado em `http://localhost:5173` (ou porta similar, dependendo do seu ambiente de desenvolvimento React).

## 📂 Estrutura do Projeto
```text
.
├── client/                     # Código React (Frontend)
│   ├── src/
│   │   ├── api/                # Configuração do Axios (apiClient.js)
│   │   ├── components/         # Componentes reutilizáveis (Header, PrivateRoute, Gráficos)
│   │   ├── pages/              # Telas da aplicação (Dashboard, Login, Assets, etc.)
│   │   └── App.jsx             # Definição de Rotas
├── server/                     # Código Express (Backend API)
│   ├── config/                 # Configuração do Banco de Dados
│   ├── controllers/            # Lógica de negócio das rotas (authController, assetController)
│   ├── middleware/             # Middlewares (autenticação JWT)
│   ├── models/                 # Schemas do Mongoose (User, AssetSnapshot)
│   ├── routes/                 # Definição de Rotas da API
│   └── index.js                # Arquivo principal do servidor
└── README.md                   # Este arquivo
```