import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

export function useRainbowKit() {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { address, isConnected, status, chainId } = useAccount();
  const { disconnect } = useDisconnect();

  return {
    address,
    isConnected,
    chainId,
    isConnecting: status === 'connecting',
    openConnectModal,
    openAccountModal,
    openChainModal,
    disconnect,
  };
}
