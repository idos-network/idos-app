import { createPublicClient, http, formatUnits } from 'viem';
import { config } from '@/config/wagmi.config';

// Create a public client for Plasma chain
const plasmaClient = createPublicClient({
  chain: config.chains.find((chain) => chain.id === 9745)!,
  transport: http('https://rpc.plasma.to'),
});

export interface XPLTransaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  valueFormatted: string;
  gasUsed: bigint;
  gasPrice: bigint;
  blockNumber: bigint;
  blockHash: string;
  transactionIndex: number;
  status: 'success' | 'failed';
  timestamp: number;
  type: 'send' | 'receive' | 'contract';
}

export interface XPLTransactionReceipt {
  transactionHash: string;
  from: string;
  to: string;
  value: bigint;
  valueFormatted: string;
  gasUsed: bigint;
  effectiveGasPrice: bigint;
  blockNumber: bigint;
  blockHash: string;
  transactionIndex: number;
  status: 'success' | 'failed';
  timestamp: number;
  logs: any[];
}

/**
 * Get transaction details by hash
 * @param txHash - The transaction hash
 * @returns Promise<XPLTransaction | null>
 */
export async function getXPLTransaction(
  txHash: string,
): Promise<XPLTransaction | null> {
  try {
    const tx = await plasmaClient.getTransaction({
      hash: txHash as `0x${string}`,
    });
    const receipt = await plasmaClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });
    const block = await plasmaClient.getBlock({ blockNumber: tx.blockNumber! });

    if (!tx || !receipt || !block) return null;

    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to || '',
      value: tx.value,
      valueFormatted: formatUnits(tx.value, 18),
      gasUsed: receipt.gasUsed,
      gasPrice: tx.gasPrice || 0n,
      blockNumber: tx.blockNumber!,
      blockHash: tx.blockHash!,
      transactionIndex: tx.transactionIndex,
      status: receipt.status === 'success' ? 'success' : 'failed',
      timestamp: Number(block.timestamp),
      type: tx.to ? 'send' : 'contract',
    };
  } catch (error) {
    console.error('Error fetching XPL transaction:', error);
    return null;
  }
}

/**
 * Get transaction receipt by hash
 * @param txHash - The transaction hash
 * @returns Promise<XPLTransactionReceipt | null>
 */
export async function getXPLTransactionReceipt(
  txHash: string,
): Promise<XPLTransactionReceipt | null> {
  try {
    const receipt = await plasmaClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });
    const block = await plasmaClient.getBlock({
      blockNumber: receipt.blockNumber,
    });

    if (!receipt || !block) return null;

    return {
      transactionHash: receipt.transactionHash,
      from: receipt.from,
      to: receipt.to || '',
      value: 0n, // Transaction receipts don't have value, need to get from transaction
      valueFormatted: '0',
      gasUsed: receipt.gasUsed,
      effectiveGasPrice: receipt.effectiveGasPrice,
      blockNumber: receipt.blockNumber,
      blockHash: receipt.blockHash,
      transactionIndex: receipt.transactionIndex,
      status: receipt.status === 'success' ? 'success' : 'failed',
      timestamp: Number(block.timestamp),
      logs: receipt.logs,
    };
  } catch (error) {
    console.error('Error fetching XPL transaction receipt:', error);
    return null;
  }
}

/**
 * Get recent transactions for an address
 * @param address - The wallet address
 * @param limit - Number of transactions to fetch (default: 10)
 * @returns Promise<XPLTransaction[]>
 */
export async function getXPLTransactionsForAddress(
  address: `0x${string}`,
  limit = 10,
): Promise<XPLTransaction[]> {
  try {
    // Get recent blocks and scan for transactions
    const latestBlock = await plasmaClient.getBlockNumber();
    const transactions: XPLTransaction[] = [];

    // Scan last 100 blocks for transactions (adjust based on network activity)
    const blocksToScan = Math.min(100, Number(latestBlock));

    for (let i = 0; i < blocksToScan && transactions.length < limit; i++) {
      const blockNumber = latestBlock - BigInt(i);
      const block = await plasmaClient.getBlock({
        blockNumber,
        includeTransactions: true,
      });

      if (!block.transactions) continue;

      for (const tx of block.transactions) {
        if (
          typeof tx === 'object' &&
          tx.hash &&
          (tx.from.toLowerCase() === address.toLowerCase() ||
            tx.to?.toLowerCase() === address.toLowerCase())
        ) {
          const txData = await getXPLTransaction(tx.hash);
          if (txData) {
            transactions.push(txData);
            if (transactions.length >= limit) break;
          }
        }
      }
    }

    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching XPL transactions for address:', error);
    return [];
  }
}

/**
 * Get recent transactions from the latest blocks
 * @param limit - Number of transactions to fetch (default: 10)
 * @returns Promise<XPLTransaction[]>
 */
export async function getRecentXPLTransactions(
  limit = 10,
): Promise<XPLTransaction[]> {
  try {
    const latestBlock = await plasmaClient.getBlockNumber();
    const transactions: XPLTransaction[] = [];

    // Scan last 50 blocks for recent transactions
    const blocksToScan = Math.min(50, Number(latestBlock));

    for (let i = 0; i < blocksToScan && transactions.length < limit; i++) {
      const blockNumber = latestBlock - BigInt(i);
      const block = await plasmaClient.getBlock({
        blockNumber,
        includeTransactions: true,
      });

      if (!block.transactions) continue;

      for (const tx of block.transactions) {
        if (typeof tx === 'object' && tx.hash) {
          const txData = await getXPLTransaction(tx.hash);
          if (txData) {
            transactions.push(txData);
            if (transactions.length >= limit) break;
          }
        }
      }
    }

    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching recent XPL transactions:', error);
    return [];
  }
}
