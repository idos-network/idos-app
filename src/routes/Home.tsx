import { getIpData } from '@/api/geoblock';
import WalletGate from '@/components/layout/WalletGate';
import { useWalletGate } from '@/hooks/useWalletGate';
import { useQuery } from '@tanstack/react-query';

export function Home() {
  const { isConnected } = useWalletGate();

  const { data } = useQuery({
    queryKey: ['geoblock'],
    queryFn: () => getIpData(),
  });

  console.log('data', data);

  if (!isConnected) {
    return <WalletGate />;
  }

  return null;
}
