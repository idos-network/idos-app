const apiKey = import.meta.env.VITE_COIN_GECKO_API_KEY;

declare global {
    interface Window {
        coinList: Coin[]
        ethPrice: { price: number; timestamp: number } | null
    }
}

interface Coin {
    id: string;
    symbol: string;
    name: string;
    platforms: {
        [key: string]: string;
    };
}

const fetchCoinList = async () => {
    if (!apiKey) throw new Error("API key is not set");
    if (window.coinList) return window.coinList;
    const coinList = await fetch(`https://api.coingecko.com/api/v3/coins/list?include_platform=true`, {
        headers: {
            'x-cg-demo-api-key': apiKey ?? "",
        },
    }).then(res => res.json());
    window.coinList = coinList;
    return coinList;
}

export const getTokenInfo = async (name: string, chainName = "ethereum") => {
    const coinList = await fetchCoinList();
    const token: Coin | undefined = coinList.find((coin: Coin) => coin.name === name);

    if (!token || !token.platforms[chainName]) {
        throw new Error(`Token ${name} not found`);
    }

    const tokenContractInfo = await getTokenContractInfo(token.platforms[chainName], chainName);
    const chainDecimals = tokenContractInfo.detail_platforms[chainName].decimal_place;
    return {
        address: token.platforms[chainName],
        decimals: chainDecimals,
        symbol: token.symbol,
    };
};

export const getTokenContractInfo = async (address: string, chainName = "ethereum") => {
    const coinList = await fetch(`https://api.coingecko.com/api/v3/coins/${chainName}/contract/${address}`, {
        headers: {
            'x-cg-demo-api-key': apiKey,
        },
    }).then(res => res.json());
    return coinList;
}

export const getEthPriceInUSD = async (): Promise<number> => {
    // Cache price for 5 minutes to avoid excessive API calls
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (window.ethPrice && (Date.now() - window.ethPrice.timestamp) < CACHE_DURATION) {
        return window.ethPrice.price;
    }

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`, {
            headers: {
                'x-cg-demo-api-key': apiKey,
            },
        });

        const data = await response.json();
        const price = data.ethereum?.usd;

        if (!price) {
            throw new Error('ETH price not found in response');
        }

        window.ethPrice = {
            price,
            timestamp: Date.now()
        };

        return price;
    } catch (error) {
        console.error('Failed to fetch ETH price:', error);
        return 4000; // Fallback ETH price
    }
};