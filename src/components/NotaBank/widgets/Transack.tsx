import { env } from '@/env';
import { useTransakToken } from '@/hooks/useTransakToken';
import { useSharedStore } from '@/stores/shared-store';
import { useNavigate } from '@tanstack/react-router';
import { Transak } from '@transak/transak-sdk';
import { memo, useCallback, useEffect, useState } from 'react';
import invariant from 'tiny-invariant';
const apiKey = env.VITE_TRANSAK_API_KEY;

const TransakTokenLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74FB5B]"></div>
    <p className="text-neutral-400 text-sm">Loading Transak token...</p>
    <p className="text-neutral-500 text-xs max-w-md text-center">
      Setting up secure payment processing with Transak.
    </p>
  </div>
);

export const TransakProvider = memo(function TransakProvider({
  grantId,
}: {
  grantId: string;
}) {
  const navigate = useNavigate();
  const { data: transakToken, isLoading: transakTokenLoading } =
    useTransakToken(grantId);
  const { selectedToken, buyAmount, selectedCurrency, spendAmount } =
    useSharedStore();
  const [transak, setTransak] = useState<Transak | null>(null);

  const updateTransak = useCallback((newTransak: Transak | null) => {
    setTransak(newTransak);
  }, []);

  useEffect(() => {
    console.log('RENDERED');
  }, [transak]);

  useEffect(() => {
    if (!transakToken || transak) return;
    invariant(apiKey, 'TRANSAK_API_KEY is not set');

    const newTransak = new Transak({
      apiKey,
      environment: Transak.ENVIRONMENTS.STAGING,
      kycShareTokenProvider: 'SUMSUB',
      kycShareToken: transakToken,
      defaultCryptoCurrency: selectedToken ?? 'USDC',
      defaultCryptoAmount: +buyAmount || 100,
      defaultFiatCurrency: selectedCurrency ?? 'USD',
      defaultFiatAmount: +spendAmount || 100,
    });
    newTransak.init();
    updateTransak(newTransak);
  }, [transakToken, transak]);

  useEffect(() => {
    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      console.log('Transak widget closed:', orderData);
      navigate({ to: '/notabank/buy' });
      transak?.close();
      updateTransak(null);
    });

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log('Transak order successful:', orderData);
      // @todo: switch to dashboard UI (show user the change)
    });

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, (orderData) => {
      console.log('Transak order failed:', orderData);
    });
  }, [transak]);

  // Cleanup Transak on unmount
  useEffect(() => {
    return () => {
      if (transak) {
        transak.close();
        setTransak(null);
      }
    };
  }, []);

  if (transakTokenLoading) {
    return <TransakTokenLoading />;
  }
  return null;
});
