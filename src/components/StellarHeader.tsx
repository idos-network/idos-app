import WalletIcon from './icons/wallet';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';
import { useStellarWallet } from '@/providers/wallet-providers/stellar-provider';

function truncateAddress(address: string): string {
  if (address.length <= 10) {
    return address;
  }
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

export function StellarHeader() {
  const hasProfile = useIdOSLoginStatus();
  const stellarWallet = useStellarWallet();

  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2 rounded-md border border-idos-grey4 bg-idos-grey1 px-2 py-1 font-semibold text-idos-seasalt text-sm">
        <div className="h-4 w-4 overflow-hidden rounded-full flex items-center bg-idos-grey2 justify-center">
          <img alt="Stellar icon" src="/stellar-icon.png" />
        </div>
        STELLAR
      </div>

      <div className="flex items-center gap-2">
        {/* todo check for non "ens"-style addresses and truncate it */}
        <div className="flex items-center gap-2 rounded-md border border-idos-grey4 bg-idos-grey1 px-2 py-1 font-semibold text-idos-seasalt text-sm">
          <WalletIcon className="fill-idos-seasalt" />
          {stellarWallet.address && truncateAddress(stellarWallet.address)}
          {hasProfile ? (
            <span className="flex items-center gap-1.5 rounded-lg bg-idos-grey2 px-2 py-[2px] font-medium text-idos-seasalt text-xs">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-semantic-success" />
              Verified Profile
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-lg bg-idos-grey2 px-2 py-[2px] font-medium text-idos-seasalt text-xs">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-semantic-warning" />
              Unverified Profile
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
