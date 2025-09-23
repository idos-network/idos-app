import { handleSaveUserWallets } from '@/handlers/user-wallets';
import { useToast } from '@/hooks/useToast';
import type { IdosWallet } from '@/interfaces/idos-profile';
import { useIdosStore } from '@/stores/idosStore';
import { verifySignature } from '@/utils/verify-signatures';
import type { idOSClientLoggedIn, idOSWallet } from '@idos-network/client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import invariant from 'tiny-invariant';

const allowedOrigin = import.meta.env.VITE_EMBEDDED_WALLET_APP_URL;

// hidden_wallet example: "evm,near"
export const handleOpenWalletPopup = (hiddenWallets: string = '') => {
  const url = allowedOrigin;
  invariant(url, 'VITE_EMBEDDED_WALLET_APP_URL is not set');
  const popupWidth = 400;
  const popupHeight = 620;
  const left = (window.screen.width - popupWidth) / 2;
  const top = (window.screen.height - popupHeight) / 2;
  window.open(
    `${url}?hidden_wallets=${hiddenWallets}`,
    'wallet-connection',
    `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=no`,
  );
};

export const createWalletParamsFactory = ({
  id,
  address,
  public_key,
  message,
  signature,
  user_id,
  wallet_type,
}: {
  id: string;
  address: string;
  public_key?: string;
  message: string;
  signature: string;
  user_id: string;
  wallet_type: string;
}) => ({
  id,
  address,
  public_key: public_key?.toString() ?? null,
  message,
  signature,
  user_id,
  wallet_type,
});

const createWallet = async (
  idOSClient: idOSClientLoggedIn,
  params: {
    address: string;
    public_key?: string;
    signature: string;
    message: string;
    id: string;
    user_id: string;
    wallet_type: string;
  },
): Promise<idOSWallet> => {
  const walletParams = createWalletParamsFactory(params);
  try {
    await idOSClient.addWallet(walletParams as any);
  } catch (error) {
    console.error(error);
  }
  const insertedWallet = (await idOSClient.getWallets()).find(
    (w: any) => w.id === walletParams.id,
  );
  invariant(
    insertedWallet,
    '`insertedWallet` is `undefined`, `idOSClient.addWallet` must have failed',
  );
  return insertedWallet;
};

export default function WalletAdder() {
  const [walletPayload, setWalletPayload] = useState<any>(null);
  const { idOSClient, setAddingWallet } = useIdosStore();
  const queryClient = useQueryClient();

  const { showToast } = useToast();

  useEffect(() => {
    const abortController = new AbortController();
    const handleMessage = (event: MessageEvent) => {
      if (!allowedOrigin) return;
      const allowedOriginUrl = new URL(allowedOrigin);
      if (event.origin !== allowedOriginUrl.origin) return;
      if (event.data?.type === 'WALLET_SIGNATURE') {
        setWalletPayload(event.data.data);
        setAddingWallet(false);
      }
    };
    window.addEventListener('message', handleMessage, {
      signal: abortController.signal,
    });
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (!walletPayload || !idOSClient) return;
    if (idOSClient.state !== 'logged-in') return;
    (async () => {
      setAddingWallet(true);
      const isValid = await verifySignature(walletPayload);
      if (!isValid) {
        showToast({
          type: 'error',
          message: 'The signature does not match the wallet address',
        });
        setAddingWallet(false);
        setWalletPayload(null);
        return;
      }
      try {
        await createWallet(idOSClient!, {
          id: crypto.randomUUID(),
          address: walletPayload.address || 'unknown',
          public_key: walletPayload.public_key,
          signature: walletPayload.signature,
          message:
            walletPayload.message ||
            'Sign this message to prove you own this wallet',
          user_id: idOSClient.user.id,
          wallet_type: walletPayload.wallet_type || 'unknown',
        });
        showToast({
          type: 'success',
          message: 'The wallet has been added to your idOS profile',
        });

        const wallets = (await idOSClient.getWallets()) as IdosWallet[];
        queryClient.invalidateQueries({ queryKey: ['user-wallets'] });
        handleSaveUserWallets(idOSClient.user.id, wallets);
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to add wallet to your idOS profile',
        });
      } finally {
        setAddingWallet(false);
        setWalletPayload(null);
      }
    })();
  }, [walletPayload, idOSClient]);

  return <></>;
}
