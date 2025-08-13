import CalendarIcon from '@/components/icons/calendar';
import LayersIcon from '@/components/icons/layers';
import UserIcon from '@/components/icons/user';
import WalletBar from '@/components/wallets/WalletBar';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';
import { useToast } from '@/hooks/useToast';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import PointsHeaderFrame from '../points/PointsHeaderFrame';

const evmNetworks = {
  1: 'ethereum',
  42161: 'arbitrum',
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hasProfile = useIdOSLoginStatus();
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const { setPointsFrameRef } = useToast();
  const pointsFrameRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (pointsFrameRef.current) {
      setPointsFrameRef(pointsFrameRef.current);
    }
  }, [setPointsFrameRef]);

  return (
    <>
      <header className="flex items-center justify-start gap-5 border-gray-800 border-b text-idos-seasalt h-18 px-6 sticky top-0 z-20 backdrop-blur-sm bg-neutral-950/60">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex flex-col space-y-1 w-6 h-6 justify-center"
          aria-label="Toggle mobile menu"
        >
          <div
            className={`h-0.5 w-6 bg-idos-seasalt transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
          />
          <div
            className={`h-0.5 w-6 bg-idos-seasalt transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}
          />
          <div
            className={`h-0.5 w-6 bg-idos-seasalt transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
          />
        </button>

        {/* Right side items */}
        <div className="flex justify-end gap-5 items-center ml-auto">
          <PointsHeaderFrame ref={pointsFrameRef} />
          {wallet && wallet.type === 'evm' && (
            <WalletBar
              network={
                wallet.type === 'evm'
                  ? evmNetworks[wallet.network as keyof typeof evmNetworks]
                  : wallet.type
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
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-18 bg-neutral-950/95 z-10 backdrop-blur-sm">
          <div className="p-6 border-b border-gray-800">
            <img src="/idos-logo.png" width="141" alt="idOS Logo" />
          </div>
          <nav className="flex flex-col p-6 space-y-4">
            <Link
              to="/idos-profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30 px-3 py-4"
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-4 w-full ${isActive ? 'text-aquamarine-400' : ''}`}
                >
                  <UserIcon className="h-6 w-6" isActive={isActive} />
                  <span className="text-lg font-medium">idOS Profile</span>
                </div>
              )}
            </Link>
            <Link
              to="/staking-event"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30 px-3 py-4"
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-4 w-full ${isActive ? 'text-aquamarine-400' : ''}`}
                >
                  <CalendarIcon className="h-6 w-6" isActive={isActive} />
                  <span className="text-lg font-medium">Staking Event</span>
                </div>
              )}
            </Link>
            <Link
              to="/idos-staking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30 px-3 py-4"
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-4 w-full ${isActive ? 'text-aquamarine-400' : ''}`}
                >
                  <LayersIcon className="h-6 w-6" isActive={isActive} />
                  <span className="text-lg font-medium">idOS Staking</span>
                </div>
              )}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
