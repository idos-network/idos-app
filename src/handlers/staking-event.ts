import { rewardLockTokenVaultAbi } from '@/abis/RewardLockTokenVault';
import type { WalletConnectorContextValue } from '@/context/wallet-connector-context';
import { env } from '@/env';
import { parseUnits } from 'viem';

interface StakeETHParams {
  address: `0x${string}`;
  amount: string;
  lockupDays: number;
  writeContractAsync: any;
}

interface StakeNEARParams {
  amount: string;
  lockupDays: number;
  walletConnector: WalletConnectorContextValue;
}

export const stakeETH = async ({
  address,
  amount,
  lockupDays,
  writeContractAsync,
}: StakeETHParams): Promise<void> => {
  if (!address) {
    throw new Error('ETH address is required');
  }

  try {
    await writeContractAsync({
      address: env.VITE_ETH_STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: rewardLockTokenVaultAbi,
      functionName: 'lockETH',
      args: [BigInt(lockupDays)],
      value: parseUnits(amount, 18),
    });
  } catch (error) {
    console.error('ETH staking failed:', error);
    throw new Error('Failed to stake ETH. Please try again.');
  }
};

export const stakeNEAR = async ({
  amount,
  lockupDays,
  walletConnector,
}: StakeNEARParams): Promise<any> => {
  if (!walletConnector.nearWallet.accountId) {
    throw new Error('NEAR wallet is not connected');
  }

  const wallet = await walletConnector.nearWallet.selector.wallet();
  const tx = await wallet.signAndSendTransaction({
    receiverId: env.VITE_NEAR_STAKING_CONTRACT_ADDRESS,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: 'lock_near',
          args: {
            days: lockupDays,
          },
          gas: '30000000000000',
          deposit: parseUnits(amount, 24).toString(),
        },
      },
    ],
  });
  return tx;
};

export interface StakeParams {
  selectedAsset: string;
  amount: string;
  lockupDays: number;
  address?: `0x${string}`;
  writeContractAsync?: any;
  walletConnector: WalletConnectorContextValue;
}

export const handleStake = async ({
  selectedAsset,
  amount,
  lockupDays,
  address,
  writeContractAsync,
  walletConnector,
}: StakeParams): Promise<any> => {
  if (selectedAsset === 'ETH') {
    if (!address || !writeContractAsync) {
      throw new Error('ETH wallet connection required');
    }
    await stakeETH({
      address,
      amount,
      lockupDays,
      writeContractAsync,
    });
    return null;
  } else if (selectedAsset === 'NEAR') {
    const tx = await stakeNEAR({
      amount,
      lockupDays,
      walletConnector,
    });
    return tx;
  } else {
    throw new Error(`Unsupported asset: ${selectedAsset}`);
  }
};
