import { getXPLBalanceFormatted } from '@/web3/plasma/token-balance';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

/**
 * Hook to fetch XPL token balance for the Plasma chain
 * @param address - The wallet address to fetch balance for
 * @param enabled - Whether the query should be enabled
 * @returns Balance data, loading state, and error state
 */
export function useXPLBalance() {
  const { address } = useAccount();
  return useQuery({
    queryKey: ['xpl-balance', address],
    queryFn: () => getXPLBalanceFormatted(address as `0x${string}`),
    enabled: !!address,
  });
}
