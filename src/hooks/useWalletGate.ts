import { useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useNearWallet } from './useNearWallet';

export function useWalletGate() {
  const { isConnected } = useAccount();

  const nearWallet = useNearWallet();

  const isLoggedIn = nearWallet.selector.isSignedIn();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isConnected && !isLoggedIn && location.pathname !== '/') {
      navigate({ to: '/' });
    } else if ((isConnected || isLoggedIn) && location.pathname === '/') {
      navigate({ to: '/idos-profile' });
    }
  }, [isConnected, isLoggedIn, location.pathname, navigate]);

  return { isConnected };
}
