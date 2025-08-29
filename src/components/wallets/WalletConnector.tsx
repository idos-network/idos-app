import { useWalletConnector } from '@/hooks/useWalletConnector';

function WalletConnectorButton({
  onClick,
  label,
  iconSrc,
  evmWallet = false,
}: {
  onClick: () => void;
  label: string;
  iconSrc?: string;
  evmWallet?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-[399px] h-12 justify-between items-center font-semibold py-2 px-6 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 text-neutral-50 cursor-pointer"
    >
      <span
        className="font-normal text-base leading-6 tracking-normal"
        style={{ fontFamily: 'Inter' }}
      >
        {label}
      </span>
      <div className="w-fit h-8 rounded-full overflow-hidden flex items-center justify-center">
        {evmWallet ? (
          <div className="flex items-center">
            <img
              src="/arbitrum.png"
              className="border-2 border-[#1a1a1a] rounded-full object-cover w-9 h-9 group-hover:border-neutral-800"
            />
            <img
              src="/ethereum.png"
              className="border-2 border-[#1a1a1a] rounded-full object-cover w-9 h-9 -ml-2 group-hover:border-neutral-800"
            />
            <img
              src="/wallet-connect-icon.png"
              className="border-2 border-[#1a1a1a] rounded-full object-cover w-9 h-9 -ml-2 group-hover:border-neutral-800"
            />
          </div>
        ) : (
          <img src={iconSrc || ''} className="object-cover w-full h-full" />
        )}
      </div>
    </button>
  );
}

export function WalletConnector() {
  const walletConnector = useWalletConnector();

  return (
    <div className="flex flex-col items-center gap-3 w-80">
      <WalletConnectorButton
        onClick={() => walletConnector.connectEthereum()}
        label="Connect an EVM Wallet"
        evmWallet={true}
      />

      <WalletConnectorButton
        onClick={() => walletConnector.connectNear()}
        label="Connect with NEAR"
        iconSrc="/near.png"
      />

      <WalletConnectorButton
        onClick={() => walletConnector.connectStellar()}
        label="Connect with Stellar"
        iconSrc="/stellar.png"
      />

      <WalletConnectorButton
        onClick={() => walletConnector.connectXRPL()}
        label="Connect with XRPL"
        iconSrc="/xrpl.png"
      />
    </div>
  );
}
