import { useWalletConnector } from '@/hooks/useWalletConnector';

export function WalletConnector() {
  const walletConnector = useWalletConnector();

  return (
    <div className="flex flex-col gap-3 w-80">
      <button
        onClick={() => walletConnector.connectEthereum()}
        className="bg-[#3b3b3b] hover:bg-[#4a4a4a] text-[#f8f8f8] font-semibold py-3 px-4 rounded-md text-lg border border-[#4a4a4a] transition-colors"
      >
        Connect a EVM Wallet
      </button>
      <button
        onClick={() => walletConnector.connectNear()}
        className="bg-[#3b3b3b] hover:bg-[#4a4a4a] text-[#f8f8f8] font-semibold py-3 px-4 rounded-md text-lg border border-[#4a4a4a] transition-colors"
      >
        Connect with NEAR
      </button>
    </div>
  );
}
