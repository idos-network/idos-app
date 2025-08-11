import Toast from '@/components/Toast';
import type { ToastOptions } from '@/hooks/useToast';
import { ToastContext } from '@/hooks/useToast';
import React, { useCallback, useRef, useState } from 'react';

let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Array<{ id: number } & ToastOptions>>(
    [],
  );
  const timers = useRef<{ [id: number]: NodeJS.Timeout }>({});

  const removeToast = useCallback((id: number) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (options: ToastOptions) => {
      const id = ++toastId;
      setToasts((toasts) => [...toasts, { ...options, id }]);
      const duration = options.duration ?? 3500;
      timers.current[id] = setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-[90px] left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 ml-[105px]">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            points={toast.points}
            icon={toast.icon}
            close={toast.close}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
