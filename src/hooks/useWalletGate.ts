import { useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export function useWalletGate() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isConnected && location.pathname !== '/') {
      navigate({ to: '/' });
    } else if (isConnected && location.pathname === '/') {
      navigate({ to: '/idos-profile' });
    }
  }, [isConnected, location.pathname, navigate]);

  return { isConnected };
}
