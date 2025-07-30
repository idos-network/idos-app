import { WalletConnector } from '@/components/wallets/WalletConnector';
import { useEffect } from 'react';
import { useWalletConnector } from '@/hooks/useWalletConnector';

function XRPLAutoConnect() {
  const walletConnector = useWalletConnector();
  useEffect(() => {
    if (
      localStorage.getItem('xrpl-connected') === 'true' &&
      !walletConnector.isConnected
    ) {
      walletConnector.connectXRPL();
    }
  }, [walletConnector]);
  return null;
}

export default function WalletGate() {
  return (
    <div className="grid grid-cols-2 min-h-screen bg-neutral-950">
      <XRPLAutoConnect />
      <div className="h-full">
        <img src="/cube-hero.png" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col items-center justify-center gap-14 h-full">
        <div className="flex flex-col items-center justify-center gap-4">
          <img src="/idos-logo.png" alt="idOS Logo" className="w-52 mb-4" />
          <span className="text-2xl font-medium text-center">
            Portable Identity for the Stablecoin Economy
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="mb-4 text-base font-semibold text-center text-idos-seasalt">
            Connect your wallet to get started.
          </span>
          <WalletConnector />
        </div>
      </div>
    </div>
  );
}
