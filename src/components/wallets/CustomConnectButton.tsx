import { useIdOS } from '@/context/idos-context';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { useEffect } from 'react';
import WalletIcon from '@/icons/wallet';

// TODO maybe update the openaccountmodal to use wallet.disconnectAll() instead
export default function CustomConnectButton() {
  const { idOSClient } = useIdOS();
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      if (idOSClient.state !== 'logged-in') {
        setHasProfile(false);
        return;
      }
      setHasProfile(true);
    }

    checkProfile();
  }, [idOSClient]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 16 }}>
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 rounded-md border border-idos-grey4 bg-idos-grey1 px-2 py-1 font-semibold text-idos-seasalt text-sm"
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        className="mr-1 h-5 w-5 overflow-hidden rounded-full"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="h-5 w-5 overflow-hidden rounded-full"
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={openAccountModal}
                      className="flex items-center gap-2 rounded-md border border-idos-grey4 bg-idos-grey1 px-2 py-1 font-semibold text-idos-seasalt text-sm"
                      type="button"
                    >
                      <WalletIcon className="fill-idos-seasalt" />
                      {account.displayName}
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
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
