'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ModalSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ModalSuccess = ({ isOpen, onClose, message }: ModalSuccessProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center animate-fade-in">
        <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800">{message}</h3>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalSuccess;
