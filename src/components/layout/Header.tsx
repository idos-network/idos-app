import WalletBar from '@/components/wallets/WalletBar';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';

export default function Header() {
  const hasProfile = useIdOSLoginStatus();
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;

  return (
    <header className="flex justify-end gap-2 border-gray-800 border-b items-center text-idos-seasalt h-18 pr-6 sticky top-0 z-10 backdrop-blur-sm bg-neutral-950/60">
      {wallet && wallet.type === 'evm' && (
        <WalletBar
          network={
            wallet.network === 1
              ? 'ethereum'
              : wallet.network === 42161
                ? 'arbitrum'
                : 'ethereum'
          }
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
