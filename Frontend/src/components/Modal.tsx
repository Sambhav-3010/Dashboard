import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-8 border w-full max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-lg rounded-md bg-white animate-fade-in-up">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
