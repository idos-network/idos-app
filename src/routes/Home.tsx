import { useWalletGate } from '@/hooks/useWalletGate';
import WalletGate from '@/components/layout/WalletGate';

export function Home() {
  const { isConnected } = useWalletGate();

  if (!isConnected) {
    return <WalletGate />;
  }

  return null;
}
