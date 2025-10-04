// client/src/App.jsx (VERSÃO TEMPORÁRIA)

import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute'; 

function App() {
  return (
    <>
      <main>
        <Routes>
          
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/register" element={<RegisterPage />} />
          
          {/* 🚨 2. Rota Principal PROTEGIDA: Envolve o DashboardPage */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          
        </Routes>
      </main>
    </>
  );
}

export default App;