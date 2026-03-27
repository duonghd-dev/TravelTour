import { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '@/shared/components/common';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message, duration = 3000) => addToast(message, 'success', duration),
    [addToast]
  );

  const error = useCallback(
    (message, duration = 4000) => addToast(message, 'error', duration),
    [addToast]
  );

  const warning = useCallback(
    (message, duration = 3500) => addToast(message, 'warning', duration),
    [addToast]
  );

  const info = useCallback(
    (message, duration = 3000) => addToast(message, 'info', duration),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastContext;
