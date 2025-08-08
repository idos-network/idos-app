import SmallPrimaryButton from '@/components/SmallPrimaryButton';
import AddIcon from '@/components/icons/add';
import { useIdOSLoggedIn } from '@/context/idos-context';
import { verifySignature } from '@/utils/verify-signatures';
import type { idOSClientLoggedIn, idOSWallet } from '@idos-network/client';
import { useEffect, useState } from 'react';
import invariant from 'tiny-invariant';

interface WalletAddButtonProps {
  onWalletAdded?: () => void;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

const createWalletParamsFactory = ({
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

export default function WalletAddButton({
  onWalletAdded,
  onError,
  onSuccess,
}: WalletAddButtonProps) {
  const [walletPayload, setWalletPayload] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);
  const idOSLoggedIn = useIdOSLoggedIn();

  // Listen for wallet signature messages from the popup
  useEffect(() => {
    const abortController = new AbortController();
    const handleMessage = (event: MessageEvent) => {
      const allowedOrigin = import.meta.env.VITE_EMBEDDED_WALLET_APP_URL;
      if (!allowedOrigin) return;
      const allowedOriginUrl = new URL(allowedOrigin);
      if (event.origin !== allowedOriginUrl.origin) return;
      if (event.data?.type === 'WALLET_SIGNATURE') {
        setWalletPayload(event.data.data);
        setIsLoading(false);
      }
    };
    window.addEventListener('message', handleMessage, {
      signal: abortController.signal,
    });
    return () => abortController.abort();
  }, []);

  // Close popup if user closes it manually
  useEffect(() => {
    if (!popupWindow) return;
    const checkPopupClosed = setInterval(() => {
      if (popupWindow.closed) {
        setIsLoading(false);
        setPopupWindow(null);
        clearInterval(checkPopupClosed);
      }
    }, 1000);
    return () => clearInterval(checkPopupClosed);
  }, [popupWindow]);

  // When a wallet payload is received, verify and add wallet
  useEffect(() => {
    if (!walletPayload) return;
    (async () => {
      setIsLoading(true);
      const isValid = await verifySignature(walletPayload);
      if (!isValid) {
        onError?.('The signature does not match the wallet address');
        setIsLoading(false);
        setWalletPayload(null);
        return;
      }
      try {
        await createWallet(idOSLoggedIn!, {
          id: crypto.randomUUID(),
          address: walletPayload.address || 'unknown',
          public_key: walletPayload.public_key,
          signature: walletPayload.signature,
          message:
            walletPayload.message ||
            'Sign this message to prove you own this wallet',
          user_id: idOSLoggedIn!.user.id,
          wallet_type: walletPayload.wallet_type || 'unknown',
        });
        onSuccess?.('The wallet has been added to your idOS profile');
        onWalletAdded?.();
      } catch (error) {
        onError?.('Failed to add wallet to your idOS profile');
      } finally {
        setIsLoading(false);
        setWalletPayload(null);
      }
    })();
  }, [walletPayload, onWalletAdded, onError, onSuccess, idOSLoggedIn]);

  // Open the embedded wallet popup
  const handleOpenWalletPopup = () => {
    const url = import.meta.env.VITE_EMBEDDED_WALLET_APP_URL;
    invariant(url, 'VITE_EMBEDDED_WALLET_APP_URL is not set');
    setIsLoading(true);
    const popupWidth = 400;
    const popupHeight = 620;
    const left = (window.screen.width - popupWidth) / 2;
    const top = (window.screen.height - popupHeight) / 2;
    const popup = window.open(
      url,
      'wallet-connection',
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=no`,
    );
    if (popup) {
      setPopupWindow(popup);
      if (popup.closed || typeof popup.closed === 'undefined') {
        onError?.('Please allow popups for this site to connect your wallet');
        setIsLoading(false);
      }
    } else {
      onError?.('Please allow popups for this site to connect your wallet');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      <SmallPrimaryButton
        icon={<AddIcon />}
        onClick={handleOpenWalletPopup}
        disabled={isLoading}
        className="bg-aquamarine-400 text-neutral-950 hover:bg-aquamarine-600"
      >
        {isLoading ? 'Connecting...' : 'Add Wallet'}
      </SmallPrimaryButton>
    </div>
  );
}
