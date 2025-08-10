import { getEthPriceInUSD } from "@/utils/coins";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatEther, formatUnits } from "viem";
import { useEstimateFeesPerGas, useEstimateGas } from "wagmi";

// Hook to get ETH price with caching
const useEthPrice = () => useQuery({
    queryKey: ['eth-price'],
    queryFn: () => getEthPriceInUSD(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
});

interface UseGasFeesParams {
    transactionConfig?: {
        address: `0x${string}`;
        abi: any;
        functionName: string;
        args: any[];
        account?: `0x${string}`;
    };
}

export const useGasFees = ({ transactionConfig }: UseGasFeesParams = {}) => {
    const { data: gasPrice } = useEstimateFeesPerGas();
    const { data: estimatedGas } = useEstimateGas(transactionConfig);
    const { data: ethPrice } = useEthPrice();

    const gasFee = useMemo(() => {
        if (!estimatedGas || !gasPrice || !ethPrice) return null;

        const totalFee = estimatedGas * (gasPrice.gasPrice || gasPrice.maxFeePerGas || 0n);
        const ethAmount = parseFloat(formatEther(totalFee));
        const usdAmount = ethAmount * ethPrice;

        return {
            wei: totalFee,
            eth: ethAmount,
            usd: usdAmount,
            gwei: formatUnits(totalFee, 9)
        };
    }, [estimatedGas, gasPrice, ethPrice]);

    return {
        gasPrice,
        estimatedGas,
        gasFee,
        ethPrice,
        isLoading: !gasPrice || !estimatedGas || !ethPrice
    };
}