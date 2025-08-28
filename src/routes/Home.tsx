import WalletGate from '@/components/layout/WalletGate';
import { useWalletGate } from '@/hooks/useWalletGate';

export function Home() {
  const { isConnected } = useWalletGate();

  if (!isConnected) {
    return <WalletGate />;
  }

  return null;
}
