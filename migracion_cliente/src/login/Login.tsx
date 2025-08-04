'use client';

import { useState } from 'react';
import ModalError from '../components/ModalError';
import ModalSuccess from '../components/ModalSuccess';
import { loginUsuario } from '../services/login';
import { useUserStore } from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const router = useNavigate();
  const [login, setLogin] = useState('');
  const setUserRole = useUserStore((state) => state.setUserRole);
  const [password, setPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleLogin = async () => {
    if (!login || !password) {
      setModalMessage('⚠️ Usuario y contraseña son obligatorios');
      setErrorOpen(true);
      return;
    }

    try {
      const res = await loginUsuario(login, password);

      const { acceso, login: username, token } = res.data;

      localStorage.setItem('usuario', JSON.stringify({ acceso, username }));
      localStorage.setItem('auth_token', token); 
      setUserRole(acceso);

      setModalMessage('✅ Bienvenido');
      setSuccessOpen(true);

      setTimeout(() => {
        router('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setModalMessage(err.response?.data?.error || '❌ Error al iniciar sesión');
      setErrorOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:outline-none"
            placeholder="Ej: admin"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold"
        >
          Ingresar
        </button>
        <ModalSuccess
          isOpen={successOpen}
          onClose={() => setSuccessOpen(false)}
          message={modalMessage}
        />
        <ModalError
          isOpen={errorOpen}
          onClose={() => setErrorOpen(false)}
          message={modalMessage}
        />
      </div>
    </div>
  );
};

export default Login;
