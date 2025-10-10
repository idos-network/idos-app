import WalletBar from '@/components/wallets/WalletBar';
import { useToast } from '@/hooks/useToast';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import { leaderboardRoute } from '@/routes';
import { useIdosStore } from '@/stores/idosStore';
import { useUiStore } from '@/stores/uiStore';
import { Link } from '@tanstack/react-router';
//import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { useEffect, useRef } from 'react';
//import { formatEther, formatUnits } from 'viem';
import PointsHeaderFrame from '../points/PointsHeaderFrame';
import SmallPrimaryButton from '../SmallPrimaryButton';

const evmNetworks = {
  1: 'ethereum',
  42161: 'arbitrum',
};

export default function Header() {
  const { isMobileMenuOpen, toggleMobileMenu } = useUiStore();
  const { idOSClient } = useIdosStore();
  const hasProfile = idOSClient?.state === 'logged-in';
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const { setPointsFrameRef, hasOnboardingToast } = useToast();
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
          onClick={toggleMobileMenu}
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
          <PointsHeaderFrame
            ref={pointsFrameRef}
            highlight={hasOnboardingToast}
          />
          <Link to={leaderboardRoute.to}>
            <SmallPrimaryButton className="transition-colors duration-200 bg-[#E6D0FF] hover:border-[#E6D0FF] hover:text-neutral-50 hover:bg-[#5A23A7]/100 h-8! font-['Urbanist'] font-medium text-neutral-950 border border-[#5A23A7]">
              Leaderboard
            </SmallPrimaryButton>
          </Link>
          {wallet && wallet.type === 'evm' && (
            <WalletBar
              network={
                wallet.type === 'evm'
                  ? evmNetworks[wallet.network as keyof typeof evmNetworks]
                  : wallet.type
              }
              address={wallet.address}
              profileStatus={hasProfile ? 'verified' : 'notVerified'}
              // balance={
              //   wallet.balance
              //     ? formatEther(wallet.balance).slice(0, -14) + ' ETH'
              //     : '0 ETH'
              // }
            />
          )}
          {wallet && wallet.type === 'near' && (
            <WalletBar
              network="near"
              address={wallet.address}
              profileStatus={hasProfile ? 'verified' : 'notVerified'}
              // balance={
              //   wallet.balance
              //     ? formatNearAmount(wallet.balance.toString(), 4) + ' NEAR'
              //     : '0 NEAR'
              // }
            />
          )}
          {wallet && wallet.type === 'stellar' && (
            <WalletBar
              network="stellar"
              address={wallet.address}
              profileStatus={hasProfile ? 'verified' : 'notVerified'}
              // balance={
              //   wallet.balance
              //     ? formatUnits(wallet.balance, 6) + ' XLM'
              //     : '0 XLM'
              // }
            />
          )}
          {wallet && wallet.type === 'xrpl' && (
            <WalletBar
              network="xrpl"
              address={wallet.address}
              profileStatus={hasProfile ? 'verified' : 'notVerified'}
              // balance={
              //   wallet.balance
              //     ? formatUnits(wallet.balance, 6).slice(0, -2) + ' XRP'
              //     : '0 XRP'
              // }
            />
          )}
        </div>
      </header>
    </>
  );
}
