import * as GemWallet from '@gemwallet/api';
import { type PropsWithChildren, useContext, useEffect } from 'react';

import { WalletConnectorContext } from '@/context/wallet-connector-context';
import { handleSaveUserWallets } from '@/handlers/user-wallets';
import { useProfileStore } from '@/stores/profile-store';
import { useEthersSigner } from '@/hooks/useEthersSigner';
import type { IdosWallet } from '@/interfaces/idos-profile';
import { _idOSClient, useIdosStore } from '@/stores/idosStore';
import { useQuery } from '@tanstack/react-query';
import { saveNewUserToLocalStorage } from '@/storage/idos-profile';
import { useHasStakingCredential } from '@/components/onboarding/OnboardingStepper';
import { useCompleteQuest } from '@/hooks/useCompleteQuest';
import { useProfileQuestCompleted } from '@/hooks/useProfileQuestCompleted';
import { useAuth } from '@/hooks/useAuth';

const useSigner = () => {
  const walletConnector = useContext(WalletConnectorContext);
  const evmSigner = useEthersSigner();

  const enabledCondition = walletConnector?.isConnected
    ? walletConnector?.connectedWallet?.type === 'evm'
      ? !!evmSigner
      : !!walletConnector.connectedWallet
    : false;

  return useQuery({
    queryKey: ['signer', walletConnector?.connectedWallet?.address],
    enabled: enabledCondition,
    queryFn: async () => {
      try {
        if (
          !walletConnector?.isConnected ||
          !walletConnector?.connectedWallet
        ) {
          return null;
        }

        let _signer: any = null;
        if (walletConnector.connectedWallet.type === 'evm' && evmSigner) {
          _signer = evmSigner;
        }
        if (walletConnector.connectedWallet.type === 'near') {
          const nearWallet = walletConnector.nearWallet;
          if (nearWallet?.selector.isSignedIn()) {
            _signer = await nearWallet.selector.wallet();
          }
        }
        if (walletConnector.connectedWallet.type === 'stellar') {
          const stellarWallet = walletConnector.stellarWallet;
          if (
            stellarWallet?.isConnected &&
            stellarWallet.address &&
            stellarWallet.kit
          ) {
            _signer = stellarWallet.kit
          }
        }
        if (walletConnector.connectedWallet.type === 'xrpl') {
          const xrplWallet = walletConnector.xrplWallet;
          if (xrplWallet?.isConnected && xrplWallet.address) {
            return GemWallet;
          }
        }
        console.log('signer', _signer);
        return _signer;
      } catch (error) {
        console.error('Failed to get signer:', error);
        return null;
      }
    },
  });
};

export function IDOSClientProvider({ children }: PropsWithChildren) {
  const { data: signer, isLoading: isLoadingSigner } = useSigner();
  const { isAuthenticated, isLoadingAuth: isLoadingAuth } = useProfileStore();
  const { authenticate } = useAuth();
  const { data: stakingCreds } = useHasStakingCredential();
  const { idOSClient, setIdOSClient, initializing, setSettingSigner } =
    useIdosStore();
  const { completeQuest } = useCompleteQuest();
  const {
    isCompleted: profileQuestCompleted,
    isLoading: isLoadingProfileQuest,
  } = useProfileQuestCompleted();
  useEffect(() => {
    if (idOSClient || !signer || isLoadingSigner) return;

    const setupClient = async () => {
      try {
        setSettingSigner(true);
        console.log('setupClient');
        const client = await _idOSClient.createClient();
        console.log('client', client);
        if (client.state === 'idle') {
          const _withSigner = await client.withUserSigner(signer);
          // setWithSigner(_withSigner);
          if (await _withSigner.hasProfile()) {
            const client = await _withSigner.logIn();
            const userWallets = await client.getWallets();
            const walletsArray = userWallets as IdosWallet[];

            const userPayload = {
              id: client.user.id as string,
              mainAddress: client.walletIdentifier as string,
              userEncryptionPublicKey: client.user
                .recipient_encryption_public_key as string,
            };

            saveNewUserToLocalStorage(userPayload as any);
            handleSaveUserWallets(client.user.id, walletsArray);

            if (!isAuthenticated) {
              await authenticate();
            }

            setIdOSClient(client);
          } else {
            console.log('setting idOS client with signer', _withSigner);
            setIdOSClient(_withSigner);
          }
        }
      } catch (error) {
        console.error('Failed to initialize idOS client:', error);
      } finally {
        setSettingSigner(false);
      }
    };
    setupClient();
    // Removing wallet dependencies to prevent reinitialization on connection failures
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, isLoadingSigner, idOSClient]);

  useEffect(() => {
    const hasStakingCredential =
      Array.isArray(stakingCreds) && !!stakingCreds?.length;
    if (
      !idOSClient ||
      isLoadingAuth ||
      isAuthenticated ||
      !hasStakingCredential
    )
      return;
    if (idOSClient.state === 'logged-in') {
      authenticate();
    }
  }, [idOSClient, authenticate, isAuthenticated, isLoadingAuth, stakingCreds]);

  useEffect(() => {
    if (!idOSClient || isLoadingAuth || isLoadingProfileQuest) return;
    if (idOSClient.state !== 'logged-in') return;

    const hasStakingCredential =
      Array.isArray(stakingCreds) && !!stakingCreds?.length;
    if (isAuthenticated && hasStakingCredential && !profileQuestCompleted) {
      console.log('completeQuest', idOSClient!.user.id);
      completeQuest(idOSClient!.user.id, 'create_idos_profile');
    }
  }, [
    idOSClient,
    authenticate,
    isAuthenticated,
    isLoadingProfileQuest,
    isLoadingAuth,
    profileQuestCompleted,
    stakingCreds,
  ]);

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <h1>initializing idOS...</h1>
      </div>
    );
  }

  return <>{children}</>;
}
