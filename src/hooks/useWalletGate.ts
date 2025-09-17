import { useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useWalletConnector } from './useWalletConnector';

export function useWalletGate() {
  const { isConnected } = useWalletConnector();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      !isConnected &&
      location.pathname !== '/' &&
      location.pathname !== '/leaderboard'
    ) {
      navigate({ to: '/' });
    } else if (isConnected && location.pathname === '/') {
      navigate({ to: '/idos-profile' });
    }
  }, [isConnected, location.pathname, navigate]);

  return { isConnected };
}
