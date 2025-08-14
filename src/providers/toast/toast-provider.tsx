import Toast from '@/components/Toast';
import type { ToastOptions } from '@/hooks/useToast';
import { ToastContext } from '@/hooks/useToast';
import React, { useCallback, useEffect, useRef, useState } from 'react';

let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Array<{ id: number } & ToastOptions>>(
    [],
  );
  const [pointsFrameRef, setPointsFrameRef] = useState<HTMLElement | null>(
    null,
  );
  const [belowPointsFramePosition, setBelowPointsFramePosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const timers = useRef<{ [id: number]: NodeJS.Timeout }>({});

  useEffect(() => {
    if (pointsFrameRef) {
      const updatePosition = () => {
        const rect = pointsFrameRef.getBoundingClientRect();
        setBelowPointsFramePosition({
          top: rect.bottom + 8,
          left: rect.left + rect.width / 2,
        });
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [pointsFrameRef]);

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
      // Only set timeout if duration is not Infinity (persistent toast)
      if (duration !== Infinity) {
        timers.current[id] = setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  const defaultToasts = toasts.filter(
    (toast) => toast.type !== 'quest' && toast.type !== 'onboarding',
  );
  const questToasts = toasts.filter(
    (toast) => toast.type === 'quest' || toast.type === 'onboarding',
  );

  return (
    <ToastContext.Provider value={{ showToast, setPointsFrameRef }}>
      {children}

      {/* Default positioned toasts */}
      <div className="fixed top-[90px] left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 ml-[105px]">
        {defaultToasts.map((toast) => (
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

      {/* Quest toasts positioned below points frame */}
      {belowPointsFramePosition && (
        <div
          className="fixed z-50 flex flex-col gap-2 -translate-x-1/2"
          style={{
            top: `${belowPointsFramePosition.top}px`,
            left: `${belowPointsFramePosition.left}px`,
          }}
        >
          {questToasts.map((toast) => (
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
      )}
    </ToastContext.Provider>
  );
};
