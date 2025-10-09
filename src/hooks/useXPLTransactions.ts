import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
  getXPLTransaction,
  getXPLTransactionReceipt,
  getXPLTransactionsForAddress,
  getRecentXPLTransactions,
  type XPLTransaction,
  type XPLTransactionReceipt,
} from '@/web3/xpl-transactions';

/**
 * Hook to fetch a specific XPL transaction by hash
 * @param txHash - The transaction hash
 * @param enabled - Whether the query should be enabled
 * @returns Transaction data, loading state, and error state
 */
export function useXPLTransaction(txHash?: string, enabled = true) {
  return useQuery<XPLTransaction | null>({
    queryKey: ['xpl-transaction', txHash],
    queryFn: () => (txHash ? getXPLTransaction(txHash) : Promise.resolve(null)),
    enabled: enabled && !!txHash,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch XPL transaction receipt by hash
 * @param txHash - The transaction hash
 * @param enabled - Whether the query should be enabled
 * @returns Transaction receipt data, loading state, and error state
 */
export function useXPLTransactionReceipt(txHash?: string, enabled = true) {
  return useQuery<XPLTransactionReceipt | null>({
    queryKey: ['xpl-transaction-receipt', txHash],
    queryFn: () =>
      txHash ? getXPLTransactionReceipt(txHash) : Promise.resolve(null),
    enabled: enabled && !!txHash,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch XPL transactions for the connected wallet address
 * @param limit - Number of transactions to fetch (default: 10)
 * @param enabled - Whether the query should be enabled
 * @returns Transactions data, loading state, and error state
 */
export function useXPLTransactionsForAddress(limit = 10, enabled = true) {
  const { address } = useAccount();

  return useQuery<XPLTransaction[]>({
    queryKey: ['xpl-transactions-address', address, limit],
    queryFn: () =>
      address
        ? getXPLTransactionsForAddress(address, limit)
        : Promise.resolve([]),
    enabled: enabled && !!address,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 10 * 1000, // 10 seconds
  });
}

/**
 * Hook to fetch recent XPL transactions from the network
 * @param limit - Number of transactions to fetch (default: 10)
 * @param enabled - Whether the query should be enabled
 * @returns Recent transactions data, loading state, and error state
 */
export function useRecentXPLTransactions(limit = 10, enabled = true) {
  return useQuery<XPLTransaction[]>({
    queryKey: ['xpl-recent-transactions', limit],
    queryFn: () => getRecentXPLTransactions(limit),
    enabled,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 10 * 1000, // 10 seconds
  });
}
