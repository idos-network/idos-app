import type { Config, Context } from '@netlify/functions';
import { goTry } from 'go-try';
import invariant from 'tiny-invariant';

type Provider = 'noah' | 'transak' | 'hifi';

type NoahResponse = {
  Items: {
    PaymentMethodCategory: 'Card' | 'Bank';
    Rate: string;
    UpdatedAt: string;
  }[];
};

type TransakResponse = {
  response: {
    quoteId: string;
    conversionPrice: number;
    marketConversionPrice: number;
    slippage: number;
    fiatCurrency: string;
    cryptoCurrency: string;
    paymentMethod: string;
    fiatAmount: number;
    cryptoAmount: number;
    isBuyOrSell: string;
    network: string;
    feeDecimal: number;
    totalFee: number;
    feeBreakdown: {
      name: string;
      value: number;
      id: string;
      ids: string[];
    }[];
  };
};

type HifiResponse = {
  fromCurrency: string;
  toCurrency: string;
  conversionRate: string;
};

export type QuoteRateResponse = {
  name: Provider;
  rate: string;
};

type CurrencyArgs = {
  sourceCurrency: string;
  destinationCurrency: string;
};

async function getNoahQuote({
  sourceCurrency,
  destinationCurrency,
}: CurrencyArgs): Promise<QuoteRateResponse> {
  const noahApiKey = process.env.NOAH_API_KEY;
  const noahApiUrl = process.env.NOAH_API_URL;
  invariant(noahApiKey, '`NOAH_API_KEY` is not set');
  invariant(noahApiUrl, '`NOAH_API_URL` is not set');

  const url = `${noahApiUrl}/v1/prices?SourceCurrency=${sourceCurrency}&DestinationCurrency=${destinationCurrency}`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-Api-Key': noahApiKey,
    },
  };

  const [error, data] = await goTry<QuoteRateResponse>(async () => {
    const response = await fetch(url, options);

    const result = (await response.json()) as NoahResponse;

    const rate =
      result.Items.find((item) => item.PaymentMethodCategory === 'Bank')
        ?.Rate ?? '';

    return { name: 'noah', rate };
  });

  if (error) {
    throw error;
  }

  return data;
}

async function getTransakQuote({
  sourceCurrency,
  destinationCurrency,
}: CurrencyArgs): Promise<QuoteRateResponse> {
  const transakApiKey = process.env.TRANSAK_API_KEY;
  const transakApiUrl = process.env.TRANSAK_API_URL;
  invariant(transakApiKey, '`TRANSAK_API_KEY` is not set');
  invariant(transakApiUrl, '`TRANSAK_API_URL` is not set');


  const url = `${transakApiUrl}/v1/pricing/public/quotes?partnerApiKey=${transakApiKey}&fiatCurrency=${sourceCurrency}&cryptoCurrency=${destinationCurrency}&isBuyOrSell=BUY&network=ethereum&paymentMethod=credit_debit_card&fiatAmount=100`;
  const options = { method: 'GET', headers: { accept: 'application/json' } };

  const [error, data] = await goTry(async () => {
    const response = await fetch(url, options);
    const result = (await response.json()) as TransakResponse;

    return result;
  });

  if (error) {
    throw error;
  }
  const { conversionPrice, fiatAmount, cryptoAmount } = data.response;
  const rate = (conversionPrice / fiatAmount) * cryptoAmount;

  return { name: 'transak', rate: rate.toString() };
}

async function getHifiQuote({
  sourceCurrency,
  destinationCurrency,
}: CurrencyArgs): Promise<QuoteRateResponse> {
  const hifiApiKey = process.env.HIFI_API_KEY;
  const hifiApiUrl = process.env.HIFI_API_URL;
  invariant(hifiApiKey, '`HIFI_API_KEY` is not set');
  invariant(hifiApiUrl, '`HIFI_API_URL` is not set');

  const url = `${hifiApiUrl}/v2/onramps/rates?fromCurrency=${sourceCurrency.toLowerCase()}&toCurrency=${destinationCurrency.toLowerCase()}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${hifiApiKey}`,
    },
  };

  const [error, data] = await goTry(async () => {
    const response = await fetch(url, options);
    const result = (await response.json()) as HifiResponse;
    return result;
  });

  if (error) {
    throw error;
  }

  const rate = data.conversionRate.toString();

  return { name: 'hifi', rate };
}

export default async (request: Request, _context: Context) => {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider') as Provider;
  const sourceCurrency = searchParams.get('sourceCurrency') as string;
  const destinationCurrency = searchParams.get('destinationCurrency') as string;


  const [error, data] = await goTry(async () => {
    switch (provider) {
      case 'noah':
        return getNoahQuote({ sourceCurrency, destinationCurrency });
      case 'transak':
        return getTransakQuote({ sourceCurrency, destinationCurrency });
      case 'hifi':
        return getHifiQuote({ sourceCurrency, destinationCurrency });
      default:
        throw new Error('Invalid provider');
    }
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
};
export const config: Config = {
  path: '/api/provider-quotes',
  method: 'GET',
};

