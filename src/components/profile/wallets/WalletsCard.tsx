import { useFetchWallets } from '@/hooks/useFetchWallets';
import { useToast } from '@/hooks/useToast';
import { useUserMainEvm } from '@/hooks/useUserMainEvm';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import MoreVertIcon from '@/icons/more-vert';
import { addressGradient } from '@/utils/gradient';
import { useState } from 'react';
import { WalletActionModal } from './WalletActionModal';
import WalletAddButton from './WalletAddButton';

export default function WalletsCard() {
  const { wallets, isLoading, error, refetch } = useFetchWallets();
  const { connectedWallet } = useWalletConnector();
  const { mainEvm } = useUserMainEvm();
  const [actionModalPosition, setActionModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const { showToast } = useToast();

  if (isLoading) return null;
  if (error) return <div>Error: {error.message}</div>;

  const isWalletConnected = (wallet: any) => {
    if (!connectedWallet) return false;

    return wallet.address === connectedWallet.address;
  };

  return (
    <div className="flex h-full flex-col w-fit min-w-full gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xl font-normal text-neutral-50">Wallets</span>
        <WalletAddButton
          onWalletAdded={refetch}
          onError={(err) => showToast({ type: 'error', message: err })}
          onSuccess={(msg) => showToast({ type: 'success', message: msg })}
        />
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
              const isConnected = isWalletConnected(wallet);

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
                        {wallet.wallet_type}
                      </span>
                    </div>
                  </td>
                  <td className="w-1/12 px-4">
                    <div className="truncate font-['Inter'] text-base text-neutral-200 flex items-center gap-3">
                      <span className="flex items-center gap-2 font-normal">
                        {wallet.address === mainEvm ? (
                          <div className="flex text-[13px] font-medium items-center py-[2.5px] px-[5px] rounded-sm bg-[#00FFB933] text-[#00FFB9]">
                            Primary
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
                        if (isConnected || wallet.address === mainEvm) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        setActionModalPosition({
                          x: rect.right + 5,
                          y: rect.top,
                        });
                        setSelectedWalletId(wallet.id);
                        setIsActionModalOpen(true);
                      }}
                      className={`rounded-md p-2 transition-colors ${
                        isConnected || wallet.address === mainEvm
                          ? 'text-neutral-500 cursor-not-allowed'
                          : 'text-neutral-200 hover:bg-idos-grey2 cursor-pointer'
                      }`}
                      disabled={isConnected || wallet.address === mainEvm}
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
      />
    </div>
  );
}
