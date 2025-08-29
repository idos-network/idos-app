import { WalletConnector } from '@/components/wallets/WalletConnector';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import { useEffect } from 'react';

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
          <div className="flex items-center justify-center gap-3 mt-10 mx-10">
            <div className="text-sm text-neutral-400">
              By connecting a wallet I agree to the{' '}
              <a
                // TODO: Add user agreement link
                href="/user-agreement"
                className="text-aquamarine-600 hover:text-aquamarine-400 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                User Agreement
              </a>{' '}
              and confirm I read the{' '}
              <a
                // TODO: Add privacy policy link
                href="/privacy-policy"
                className="text-aquamarine-600 hover:text-aquamarine-400 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                // TODO: Add transparency document link
                href="/transparency-document"
                className="text-aquamarine-600 hover:text-aquamarine-400 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Transparency Document
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
