import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (msg) => console.log(`[Toast]: ${msg}`),
      removeToast: () => {},
    };
  }
  return context;
}

export default useToast;
