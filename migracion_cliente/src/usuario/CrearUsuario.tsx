'use client';

import { useState } from 'react';
import { crearUsuario } from '../services/usuarios';
import ModalError from '../components/ModalError';
import ModalSuccess from '../components/ModalSuccess';

interface ModalCrearUsuarioProps {
  onSuccess: () => void;
}

const CrearUsuario = ({ onSuccess }: ModalCrearUsuarioProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [acceso, setAcceso] = useState('Cajero');
  const [estado, setEstado] = useState('activo');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleCrear = async () => {
    if (
      !login.trim() ||
      !password.trim() ||
      !acceso.trim() ||
      !nombre.trim() ||
      !apellido.trim()
    ) {
      setModalMessage('⚠️ Los campos Login, Contraseña, Nombre y Apellido son obligatorios');
      setErrorOpen(true);
      return;
    }

    try {
      await crearUsuario({
        login,
        password,
        acceso,
        estado,
        nombre,
        apellido,
        telefono: telefono.trim() || "",
      });

      setModalMessage('✅ Usuario creado correctamente');
      setSuccessOpen(true);

      setLogin('');
      setPassword('');
      setAcceso('Cajero');
      setEstado('activo');
      setNombre('');
      setApellido('');
      setTelefono('');

      onSuccess(); 
    } catch (err: any) {
      console.error(err);
      setModalMessage(err.response?.data?.error || '❌ Error al crear usuario');
      setErrorOpen(true);
    }
  };

 return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Crear Nuevo Usuario</h2>

      <div className="flex flex-wrap -mx-2">
        {/* Nombre */}
        <div className="w-1/3 px-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:outline-none"
            placeholder="Ej: Juan"
          />
        </div>

        {/* Apellido */}
        <div className="w-1/3 px-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:outline-none"
            placeholder="Ej: Pérez"
          />
        </div>

        {/* Teléfono */}
        <div className="w-1/3 px-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:outline-none"
            placeholder="Ej: +595981234567"
          />
        </div>

        {/* Login */}
        <div className="w-1/3 px-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Usuario (Login)</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:outline-none"
            placeholder="Ej: admin"
          />
        </div>

        {/* Password */}
        <div className="w-1/3 px-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        {/* Acceso */}
        <div className="w-1/3 px-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol / Acceso</label>
          <select
            value={acceso}
            onChange={(e) => setAcceso(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="Administrador">Administrador</option>
            <option value="Cajero">Cajero</option>
            <option value="Auditor">Auditor</option>
          </select>
        </div>

        {/* Estado */}
        <div className="w-1/3 px-2 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>
    <div className="flex justify-center">
      <button
        onClick={handleCrear}
        className="w-[160px] bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold"
      >
        Crear Usuario
      </button>
</div>
      {/* Modales */}
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

export default CrearUsuario;
