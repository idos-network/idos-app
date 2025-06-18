import CustomConnectButton from './CustomConnectButton';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import { NearHeader } from './NearHeader';
import { StellarHeader } from './StellarHeader';

export default function Header() {
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;

  return (
    <header className="flex justify-end gap-2 border-gray-800 border-b p-4 text-idos-seasalt">
      {wallet && wallet.type === 'ethereum' && <CustomConnectButton />}
      {wallet && wallet.type === 'near' && <NearHeader />}
      {wallet && wallet.type === 'stellar' && <StellarHeader />}

      {/* TODO remove once Near modal is correctly implemented and rainbowkit modal uses walletConnect.disconnectAll*/}
      <button
        onClick={walletConnector.disconnect}
        className="flex items-center gap-2 rounded-md border border-idos-grey4 bg-idos-grey1 px-2 py-1 font-semibold text-idos-seasalt text-sm"
      >
        Sign out
      </button>
    </header>
  );
}
