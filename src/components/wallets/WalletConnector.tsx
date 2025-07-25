import { useWalletConnector } from '@/hooks/useWalletConnector';

function WalletConnectorButton({
  onClick,
  label,
  iconSrc,
}: {
  onClick: () => void;
  label: string;
  iconSrc: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-[399px] h-12 justify-between items-center bg-[#3b3b3b] hover:bg-[#4a4a4a] text-[#f8f8f8] font-semibold py-2 px-6 rounded-xl border border-[#4a4a4a] transition-colors"
    >
      <span
        className="font-normal text-base leading-6 tracking-normal"
        style={{ fontFamily: 'Inter' }}
      >
        {label}
      </span>
      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
        <img src={iconSrc} className="object-cover w-full h-full" />
      </div>
    </button>
  );
}

export function WalletConnector() {
  const walletConnector = useWalletConnector();

  return (
    <div className="flex flex-col gap-3 w-80">
      <WalletConnectorButton
        onClick={() => walletConnector.connectEthereum()}
        label="Connect a EVM Wallet"
        iconSrc="/evm.png"
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
        label="Connect with XRP"
        iconSrc="/xrpl.png"
      />
    </div>
  );
}
