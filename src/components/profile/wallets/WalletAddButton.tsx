import { useState, useEffect } from 'react';
import SmallPrimaryButton from '@/components/SmallPrimaryButton';
import AddIcon from '@/components/icons/add';
import { useIdOS } from '@/context/idos-context';
import { verifySignature } from '@/utils/verify-signatures';
import type { idOSWallet } from '@idos-network/client';
import invariant from 'tiny-invariant';

interface WalletAddButtonProps {
  onWalletAdded?: () => void;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

const createWalletParamsFactory = ({
  address,
  public_key,
  signature,
  message,
}: {
  address: string;
  public_key?: string;
  signature: string;
  message: string;
}) => ({
  id: crypto.randomUUID() as string,
  address,
  public_key: public_key ?? null,
  message,
  signature,
});

const createWallet = async (
  idOSClient: any,
  params: {
    address: string;
    public_key?: string;
    signature: string;
    message: string;
  },
): Promise<idOSWallet> => {
  const walletParams = createWalletParamsFactory(params);
  await idOSClient.addWallet(walletParams);
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
  const { withSigner } = useIdOS();

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
        const idOSClient = await withSigner.logIn();
        await createWallet(idOSClient, {
          address: walletPayload.address || 'unknown',
          public_key: walletPayload.public_key,
          signature: walletPayload.signature,
          message:
            walletPayload.message ||
            'Sign this message to prove you own this wallet',
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
  }, [walletPayload, onWalletAdded, onError, onSuccess, withSigner]);

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
