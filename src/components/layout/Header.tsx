import WalletBar from '@/components/wallets/WalletBar';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';

export default function Header() {
  const hasProfile = useIdOSLoginStatus();
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;

  return (
    <header className="flex justify-end gap-2 border-gray-800 border-b items-center text-idos-seasalt h-20 pr-6">
      {wallet && wallet.type === 'evm' && (
        <WalletBar
          network="evm"
          address={wallet.address}
          profileStatus={hasProfile ? 'verified' : 'notVerified'}
        />
      )}
      {wallet && wallet.type === 'near' && (
        <WalletBar
          network="near"
          address={wallet.address}
          profileStatus={hasProfile ? 'verified' : 'notVerified'}
        />
      )}
      {wallet && wallet.type === 'stellar' && (
        <WalletBar
          network="stellar"
          address={wallet.address}
          profileStatus={hasProfile ? 'verified' : 'notVerified'}
        />
      )}
      {wallet && wallet.type === 'xrpl' && (
        <WalletBar
          network="xrpl"
          address={wallet.address}
          profileStatus={hasProfile ? 'verified' : 'notVerified'}
        />
      )}
    </header>
  );
}
