'use client';

import { useState } from 'react';
import ModalError from '../components/ModalError';
import ModalSuccess from '../components/ModalSuccess';
import { loginUsuario } from '../services/login';
import { useUserStore } from '../../store/useUserStore';
import { FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const router = useNavigate();
  const [login, setLogin] = useState('');
  const setUserRole = useUserStore((state) => state.setUserRole);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 estado para mostrar/ocultar
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
    <div className="h-full flex items-center justify-center flex-col bg-[url('/background_login.png')] bg-cover bg-center">
      <div className="p-8 rounded-lg shadow-lg max-w-sm w-full bg-gray-200/20">
        <div className='flex items-center justify-center'>
          <img src="/user_icon.png" alt="usericon" width={80} height={80}/>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white mb-6">Iniciar Sesión</h1>
        
        {/* Usuario */}
        <div className="mb-4 flex flex-row border border-gray-200 rounded-md">
          <FaRegUser className='w-20 h-10 bg-gray-200'/>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full text-gray-200 p-1"
            placeholder="Ej: admin"
          />
        </div>

        {/* Contraseña con icono de ojo */}
        <div className="mb-4 flex items-center border border-gray-200 rounded-md relative">
          <RiLockPasswordLine className='w-20 h-10 bg-gray-200'/>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-gray-200 p-1 pr-10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-400 hover:text-white"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button
        onClick={handleLogin}
        className="w-[300px] bg-gradient-to-b from-transparent to-gray-200/20 hover:from-transparent hover:to-gray-300/30 text-white py-2 rounded-md font-semibold mt-4"
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
  );
};

export default Login;
