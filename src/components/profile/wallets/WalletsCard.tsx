import FaceSignTag from '@/components/NotaBank/components/FaceSignTag';
import { isProduction } from '@/env';
import InfoIcon from '@/icons/info';
import MoreVertIcon from '@/icons/more-vert';
import type { IdosWallet } from '@/interfaces/idos-profile';
import { useIdosStore } from '@/stores/idosStore';
import { addressGradient } from '@/utils/gradient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { WalletActionModal } from './WalletActionModal';
import WalletAddButton from './WalletAddButton';
import { useHasMainEvm } from '@/components/onboarding/OnboardingStepper';

export const useUserWallets = () => {
  const { idOSClient } = useIdosStore();
  return useQuery({
    queryKey: ['user-wallets'],
    enabled: !!idOSClient && idOSClient.state === 'logged-in',
    queryFn: async () => {
      if (!idOSClient || idOSClient.state !== 'logged-in') return [];
      const wallets = await idOSClient.getWallets();
      return (wallets as IdosWallet[]) || [];
    },
  });
};

export default function WalletsCard() {
  const { data: wallets = [], isLoading, error, refetch } = useUserWallets();
  const { data: mainEvmAddress, refetch: refetchMainEvm } = useHasMainEvm();
  const [actionModalPosition, setActionModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [tooltipText, setTooltipText] = useState<string>('');

  useEffect(() => {
    if (!wallets || !wallets.length) return;
    setTimeout(() => {
      refetchMainEvm();
    }, 2000);
  }, [wallets.length]);

  if (isLoading) return null;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex h-full flex-col w-fit min-w-full gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 relative">
          <span className="text-xl font-normal text-neutral-50">Wallets</span>
          <div className="relative">
            <button
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({
                  x: rect.left + rect.width / 2,
                  y: rect.bottom + 8,
                });
                setTooltipText(
                  'Wallets connected to your profile are not publicly visible',
                );
                setShowTooltip(true);
              }}
              onMouseLeave={() => {
                setShowTooltip(false);
                setTooltipPosition(null);
                setTooltipText('');
              }}
              className="flex items-center text-neutral-400 hover:text-neutral-300 transition-colors"
            >
              <InfoIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <WalletAddButton />
      </div>
      {/* Table Section */}
      <div className="flex-grow overflow-x-auto">
        <table className="w-full table-auto text-sm font-['Inter']">
          <thead>
            <tr className="text-left text-neutral-400 text-sm bg-neutral-800 h-[52px]">
              <th className="w-1/2 px-4 font-normal rounded-l-[20px]">
                Address
              </th>
              <th className="w-1/12 px-4 font-normal">Type</th>
              <th className="w-1/12 px-4 font-normal">Status</th>
              <th className="w-1/12 px-4 font-normal rounded-r-[20px]"></th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet, index) => {
              const isLastRow = index === wallets.length - 1;

              return (
                <tr
                  key={wallet.id}
                  className={`text-neutral-200 text-base h-[52px] ${!isLastRow ? 'border-neutral-800 border-b' : ''}`}
                >
                  <td className="w-10/12 px-4">
                    <div className="truncate font-['Inter'] text-base text-neutral-200 flex items-center gap-3">
                      <div
                        className="flex items-center justify-center w-7 h-7 rounded-full"
                        style={{
                          background: addressGradient(wallet.address || ''),
                        }}
                      ></div>
                      <span className="flex items-center gap-2 font-normal">
                        {wallet.address}
                      </span>
                    </div>
                  </td>
                  <td className="w-10/12 px-4">
                    <div className="truncate font-['Inter'] text-base text-neutral-200 flex items-center gap-3">
                      <span className="flex items-center gap-2 font-normal">
                        {wallet.wallet_type === 'face_sign' && !isProduction ? (
                          <FaceSignTag />
                        ) : (
                          wallet.wallet_type
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="w-1/12 px-4">
                    <div className="truncate font-['Inter'] text-base text-neutral-200 flex items-center gap-3">
                      <span className="flex items-center gap-2 font-normal">
                        {wallet.address === mainEvmAddress ? (
                          <div className="relative">
                            <button
                              onMouseEnter={(e) => {
                                const rect =
                                  e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({
                                  x: rect.left + rect.width / 2,
                                  y: rect.bottom + 8,
                                });
                                setTooltipText(
                                  'Your main wallet for receiving airdrops and making transactions. You can switch it anytime.',
                                );
                                setShowTooltip(true);
                              }}
                              onMouseLeave={() => {
                                setShowTooltip(false);
                                setTooltipPosition(null);
                                setTooltipText('');
                              }}
                              className="flex text-[13px] font-medium items-center py-[2.5px] px-[5px] rounded-sm bg-[#00FFB933] text-[#00FFB9]"
                            >
                              Primary
                            </button>
                          </div>
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="w-1/12 px-4">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setActionModalPosition({
                          x: rect.right + 5,
                          y: rect.top,
                        });
                        setSelectedWalletId(wallet.id);
                        setIsActionModalOpen(true);
                      }}
                      className="rounded-md p-2 transition-colors text-neutral-200 hover:bg-idos-grey2 cursor-pointer"
                    >
                      <MoreVertIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <WalletActionModal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setActionModalPosition(null);
        }}
        position={actionModalPosition}
        walletId={selectedWalletId || undefined}
        wallets={wallets}
        refetch={refetch}
        refetchMainEvm={refetchMainEvm}
      />

      {/* Shared tooltip */}
      {showTooltip && tooltipPosition && (
        <div
          className="fixed z-50 bg-neutral-800 rounded-lg p-4 text-neutral-200 drop-shadow-[0_0_10px_rgba(0,0,0,0.7)] w-[240px] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(5%)',
          }}
        >
          <div className="text-sm text-neutral-400">{tooltipText}</div>
        </div>
      )}
    </div>
  );
}
