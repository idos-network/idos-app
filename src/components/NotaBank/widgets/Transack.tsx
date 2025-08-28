import { env } from '@/env';
import { useSharedStore } from '@/stores/shared-store';
import { useNavigate } from '@tanstack/react-router';
import { Transak } from '@transak/transak-sdk';
import { useEffect, useRef } from 'react';
import invariant from 'tiny-invariant';

export function TransakProvider({ transakToken }: { transakToken: string }) {
  const navigate = useNavigate();
  const { selectedToken, buyAmount, selectedCurrency, spendAmount } =
    useSharedStore();
  const transak = useRef<Transak | null>(null);

  useEffect(() => {
    const apiKey = env.VITE_TRANSAK_API_KEY;
    if (!transak.current && transakToken) {
      invariant(apiKey, 'TRANSAK_API_KEY is not set');

      transak.current = new Transak({
        apiKey,
        environment: Transak.ENVIRONMENTS.STAGING,
        kycShareTokenProvider: 'SUMSUB',
        kycShareToken: transakToken,
        defaultCryptoCurrency: selectedToken,
        defaultCryptoAmount: +buyAmount || 0,
        defaultFiatCurrency: selectedCurrency,
        defaultFiatAmount: +spendAmount || 0,
      });
      transak.current.init();
      Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
        console.log('Transak widget closed:', orderData);
        navigate({ to: '/notabank/buy' });
        transak.current?.close();
        transak.current?.logoutUser();
        transak.current?.cleanup();
        transak.current = null;
      });

      Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        console.log('Transak order successful:', orderData);
        // @todo: switch to dashboard UI (show user the change)
      });

      Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, (orderData) => {
        console.log('Transak order failed:', orderData);
      });
    }
  }, [transakToken, transak.current]);

  // Cleanup Transak on unmount
  useEffect(() => {
    return () => {
      if (transak.current) {
        transak.current.close();
        transak.current = null;
      }
    };
  }, []);

  return null;
}
