import { useIdOSLoggedIn } from '@/context/idos-context';
import { verifySignature } from '@/utils/verify-signatures';
import type { idOSWallet } from '@idos-network/client';
import { useEffect, useState } from 'react';
import invariant from 'tiny-invariant';
import StepperButton from './StepperButton';

interface WalletAddButtonProps {
  onWalletAdded?: (walletAddress?: string) => void;
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
  idOSClient: any,
  params: {
    address: string;
    public_key?: string;
    signature: string;
    message: string;
    id: string;
    user_id: string;
    wallet_type: string;
  },
  setIsLoading: (isLoading: boolean) => void,
): Promise<idOSWallet> => {
  const walletParams = createWalletParamsFactory(params);
  try {
    setIsLoading(true);
    await idOSClient.addWallet(walletParams);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
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

export default function EVMWalletAdd({
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
      const allowedOrigin = import.meta.env
        .VITE_ONBOARDING_EMBEDDED_WALLET_APP_URL;
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
        const walletAddress = walletPayload.address || 'unknown';
        await createWallet(
          idOSLoggedIn!,
          {
            id: crypto.randomUUID() as string,
            address: walletAddress,
            public_key: walletPayload.public_key,
            message:
              walletPayload.message ||
              'Sign this message to prove you own this wallet',
            signature: walletPayload.signature,
            user_id: idOSLoggedIn!.user.id,
            wallet_type: walletPayload.wallet_type || 'unknown',
          },
          setIsLoading,
        );
        onSuccess?.('The wallet has been added to your idOS profile');
        onWalletAdded?.(walletAddress);
      } catch (error) {
        onError?.('Failed to add wallet to your idOS profile');
      } finally {
        setIsLoading(false);
        setWalletPayload(null);
      }
    })();
  }, [walletPayload, onWalletAdded, onError, onSuccess, idOSLoggedIn]);

  // Open the embedded wallet popup
  const handleOpenWalletPopup = (hiddenWallets?: string) => {
    const url = import.meta.env.VITE_ONBOARDING_EMBEDDED_WALLET_APP_URL;
    invariant(url, 'VITE_ONBOARDING_EMBEDDED_WALLET_APP_URL is not set');
    setIsLoading(true);
    const popupWidth = 400;
    const popupHeight = 620;
    const left = (window.screen.width - popupWidth) / 2;
    const top = (window.screen.height - popupHeight) / 2;
    const popup = window.open(
      `${url}?hidden_wallets=${hiddenWallets}`,
      'wallet-connection',
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=no`,
    );
    if (popup) {
      setPopupWindow(popup);
      setIsLoading(true);
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
    <StepperButton
      onClick={() => handleOpenWalletPopup()}
      disabled={isLoading}
    >
      {isLoading ? 'Waiting for wallet...' : 'Add EVM wallet'}
    </StepperButton>
  );
}
