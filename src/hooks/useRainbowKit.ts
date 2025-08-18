import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useDisconnect } from 'wagmi';

export function useRainbowKit() {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { address, isConnected, status, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    query: {
      enabled: isConnected,
    },
  });

  return {
    address,
    isConnected,
    chainId,
    balance: balance?.value ?? BigInt(0),
    isConnecting: status === 'connecting',
    openConnectModal,
    openAccountModal,
    openChainModal,
    disconnect,
  };
}
