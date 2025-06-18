import { useNearWallet } from '@/hooks/useNearWallet';
import WalletIcon from './icons/wallet';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';

export function NearHeader() {
  const hasProfile = useIdOSLoginStatus();
  const nearWallet = useNearWallet();

  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2 rounded-md border border-idos-grey4 bg-idos-grey1 px-2 py-1 font-semibold text-idos-seasalt text-sm">
        <div className="h-4 w-4 overflow-hidden rounded-full flex items-center bg-idos-grey2 justify-center">
          <img
            alt="NEAR icon"
            src="/near_icon.svg"
            className="h-4 w-4 overflow-hidden rounded-full brightness-0 invert"
          />
        </div>
        NEAR
      </div>

      <div className="flex items-center gap-2">
        {/* todo check for non "ens"-style addresses and truncate it */}
        <div className="flex items-center gap-2 rounded-md border border-idos-grey4 bg-idos-grey1 px-2 py-1 font-semibold text-idos-seasalt text-sm">
          <WalletIcon className="fill-idos-seasalt" />
          {nearWallet.accountId}
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
