import { useWalletGate } from '@/hooks/useWalletGate';
import WalletGate from '@/components/layout/WalletGate';
import { saveUser } from '../api/user';

export function Home() {
  const { isConnected } = useWalletGate();

  if (!isConnected) {
    saveUser({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      mainEvm: '0x1234567890123456789012345678901234567890',
      referrerCode: '1234567890',
    });
    return <WalletGate />;
  }
  return null;
}
