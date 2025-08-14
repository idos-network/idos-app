import GasIcon from '@/components/icons/Gas';
import NeobankLogoIcon from '@/components/icons/neobank-logo';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGasFees } from '@/hooks/useGasFees';
import { getTokenInfo } from '@/utils/coins';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRightIcon, Loader2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { erc20Abi, parseUnits } from 'viem';
import { useAccount, useBalance, useWriteContract } from 'wagmi';
import { TokenAmountInput, tokens, type TokenInfo } from './TokenAmountInput';

const useTokenInfo = (selectedToken: TokenInfo) =>
  useQuery({
    queryKey: ['token-decimals', selectedToken.value],
    queryFn: () => getTokenInfo(selectedToken.value, 'ethereum'),
  });

export function SendTokensDialog() {
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(tokens[0]);
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const { writeContractAsync, isPending, isError } = useWriteContract();
  const { data: tokenContractInfo } = useTokenInfo(selectedToken);
  const { address } = useAccount();

  const { data: tokenBalance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: tokenContractInfo?.address as `0x${string}`,
    query: {
      enabled: !!address && !!tokenContractInfo?.address,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  const transactionConfig = useMemo(() => {
    if (
      !tokenContractInfo?.address ||
      !recipient ||
      !amount ||
      !tokenContractInfo?.decimals
    ) {
      return undefined;
    }

    try {
      return {
        address: tokenContractInfo.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer' as const,
        args: [
          recipient as `0x${string}`,
          parseUnits(amount, tokenContractInfo.decimals),
        ],
        account: address,
      };
    } catch {
      return undefined;
    }
  }, [tokenContractInfo, recipient, amount, address]);

  const { gasFee, isLoading: isGasLoading } = useGasFees({ transactionConfig });

  const hasInsufficientBalance = useMemo(() => {
    if (!tokenBalance || !amount || !tokenContractInfo?.decimals) return false;
    try {
      const amountBigInt = parseUnits(amount, tokenContractInfo.decimals);
      return amountBigInt > tokenBalance.value;
    } catch {
      return false;
    }
  }, [tokenBalance, amount, tokenContractInfo?.decimals]);

  const sendTokens = useCallback(async () => {
    if (!selectedToken) return;
    writeContractAsync({
      address: tokenContractInfo?.address as `0x${string}`,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [
        recipient as `0x${string}`,
        parseUnits(amount, tokenContractInfo?.decimals as number),
      ],
    });
  }, [selectedToken, tokenContractInfo, recipient, amount, writeContractAsync]);

  const formattedBalance = useMemo(() => {
    if (isBalanceLoading) return 'Loading...';
    if (!tokenBalance) return '0';
    return parseFloat(tokenBalance.formatted).toFixed(3);
  }, [tokenBalance, isBalanceLoading]);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>
            <ArrowUpRightIcon className="size-5" /> Send
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-none">
          <DialogHeader>
            <DialogTitle>
              <NeobankLogoIcon />
            </DialogTitle>
            <DialogDescription className="text-white text-2xl font-medium mt-5">
              Send Tokens
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-4 mt-4">
              <Label className="font-medium text-muted">Recipient</Label>
              <Input
                type="text"
                placeholder="0x5d4f2C8258f3F77B7365B60745Eb821D696DB777"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="h-16 border-0 bg-[#26262699] pl-6 font-medium text-white text-xl placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
            <div className="flex flex-col">
              <TokenAmountInput
                selectOptions={[...tokens]}
                amount={amount}
                onAmountChange={setAmount}
                selectedToken={selectedToken}
                onSelect={(value) =>
                  setSelectedToken(
                    tokens.find((token) => token.value === value) ?? tokens[0],
                  )
                }
                label="Amount"
              />
              <div className="flex flex-col gap-2 mt-2">
                <span
                  className={`text-sm font-medium ${hasInsufficientBalance ? 'text-red-400' : ''}`}
                >
                  Balance: {formattedBalance} {selectedToken?.label}
                  {hasInsufficientBalance && (
                    <span className="text-red-400 ml-2">
                      (Insufficient Balance)
                    </span>
                  )}
                </span>
                <div className="w-full flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">Estimated Gas Fee</span>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <GasIcon />
                    {gasFee && !isGasLoading ? (
                      <>
                        <span>${gasFee.usd.toFixed(2)}</span>
                        <span className="text-sm text-neutral-400">
                          ({gasFee.eth.toFixed(4)} ETH)
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-neutral-400">
                        Calculating...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="h-12 w-full rounded-lg bg-[#74FB5B] text-black disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                isPending || !recipient || !amount || hasInsufficientBalance
              }
              onClick={sendTokens}
            >
              {isPending && !isError ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : hasInsufficientBalance ? (
                'Insufficient Balance'
              ) : (
                'Continue'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
