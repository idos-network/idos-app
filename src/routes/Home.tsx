import WalletGate from '@/components/layout/WalletGate';
import { useWalletGate } from '@/hooks/useWalletGate';
import { useIdosStore } from '@/stores/idosStore';
import { useEffect } from 'react';

export function Home() {
  const { isConnected } = useWalletGate();
  const { resetStore } = useIdosStore();

  useEffect(() => {
    if (!isConnected) resetStore();
  }, [isConnected]);

  if (!isConnected) {
    return <WalletGate />;
  }

  return null;
}
