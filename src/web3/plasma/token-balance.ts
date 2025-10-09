import { createPublicClient, http, formatUnits } from 'viem';
import { config } from '@/config/wagmi.config';

// Create a public client for Plasma chain
const plasmaClient = createPublicClient({
  chain: config.chains.find((chain) => chain.id === 9745)!,
  transport: http('https://rpc.plasma.to'),
});

/**
 * Fetch XPL token balance for a given address on Plasma chain
 * @param address - The wallet address to fetch balance for
 * @returns Promise<bigint> - The balance in wei
 */
export async function getXPLBalance(address: `0x${string}`): Promise<bigint> {
  try {
    const balance = await plasmaClient.getBalance({
      address,
    });
    return balance;
  } catch (error) {
    console.error('Error fetching XPL balance:', error);
    return 0n;
  }
}

/**
 * Fetch XPL token balance formatted as a string
 * @param address - The wallet address to fetch balance for
 * @param decimals - Number of decimal places (default: 18)
 * @returns Promise<string> - The formatted balance string
 */
export async function getXPLBalanceFormatted(
  address: `0x${string}`,
  decimals = 18,
): Promise<string> {
  try {
    const balance = await getXPLBalance(address);
    return formatUnits(balance, decimals);
  } catch (error) {
    console.error('Error formatting XPL balance:', error);
    return '0';
  }
}
