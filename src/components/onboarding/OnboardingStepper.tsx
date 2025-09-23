import { getUserById } from '@/api/user';
import { useIdOS } from '@/context/idos-context';
import { env } from '@/env';
import { useOnboardingStore } from '@/stores/onboarding-store';
import type {
  idOSClient,
  idOSClientWithUserSigner,
} from '@idos-network/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useUserWallets } from '../profile/wallets/WalletsCard';
import {
  AddCredential,
  AddEVMWallet,
  CreatePrivateKey,
  GetStarted,
  VerifyIdentity,
} from './steps';

const canAccessWalletIdentifier = (idOSClient: idOSClient | null) =>
  !!idOSClient && ['with-user-signer', 'logged-in'].includes(idOSClient.state);

export const useWalletIdentifier = () => {
  const { idOSClient } = useIdOS();
  const withSigner = idOSClient as idOSClientWithUserSigner;

  const _canAccessWalletIdentifier = canAccessWalletIdentifier(idOSClient);

  return useQuery({
    queryKey: [
      'wallet-identifier',
      _canAccessWalletIdentifier ? withSigner?.walletIdentifier : null,
    ],
    queryFn: () => {
      return _canAccessWalletIdentifier ? withSigner.walletIdentifier : null;
    },
    enabled: _canAccessWalletIdentifier,
  });
};

export const useHasStakingCredential = () => {
  const { idOSClient } = useIdOS();
  const { data: walletIdentifier } = useWalletIdentifier();
  return useQuery({
    queryKey: ['has-staking-credentials', walletIdentifier],
    queryFn: async () => {
      if (idOSClient && idOSClient.state === 'logged-in') {
        const result = await idOSClient.filterCredentials({
          acceptedIssuers: [
            {
              authPublicKey: env.VITE_ISSUER_SIGNING_PUBLIC_KEY,
            },
          ],
        });
        return result;
      }
      return [];
    },
    enabled:
      !!idOSClient &&
      ['logged-in', 'with-user-signer'].includes(idOSClient.state),
    staleTime: 1000,
    gcTime: 1000,
  });
};

export const useUserId = () => {
  const { idOSClient } = useIdOS();
  const { data: walletIdentifier } = useWalletIdentifier();
  return useQuery({
    queryKey: ['userId', walletIdentifier],
    queryFn: () => {
      if (!idOSClient) return null;
      return idOSClient.state === 'logged-in' ? idOSClient.user.id : null;
    },
    enabled: !!idOSClient && idOSClient.state === 'logged-in',
    staleTime: 0,
    gcTime: 0,
  });
};

export const useHasFaceSign = () => {
  const { data: userId } = useUserId();
  return useQuery({
    queryKey: ['hasFaceSign', userId],
    queryFn: () => {
      return userId
        ? getUserById(userId)
            .then((res) => res[0].faceSignUserId !== null)
            .catch(() => null)
        : null;
    },
    enabled: !!userId,
  });
};

const steps = [
  { id: 'step-one', component: <GetStarted /> }, // Get started
  { id: 'step-two', component: <CreatePrivateKey /> }, // Create your private key
  { id: 'step-three', component: <VerifyIdentity /> }, // Verify identity after which idOS profile is created
  { id: 'step-four', component: <AddCredential /> }, // Add a credential
  { id: 'step-five', component: <AddEVMWallet /> }, // Set up primary EVM wallet only for non EVM wallets
];

export default function OnboardingStepper() {
  const { data: wallets = [] } = useUserWallets();
  const { data: stakingCreds } = useHasStakingCredential();
  const { data: hasFaceSign } = useHasFaceSign();
  const hasStakingCredential =
    Array.isArray(stakingCreds) && !!stakingCreds?.length;
  const hasEvmWallet = wallets.find((wallet) => wallet.wallet_type === 'EVM');
  const { stepIndex, setStepIndex } = useOnboardingStore();
  const { data: userId } = useUserId();

  const initialeStep = useMemo(
    () =>
      userId
        ? hasFaceSign
          ? hasStakingCredential
            ? hasEvmWallet
              ? null
              : 4 // no EVM wallet
            : 3 // no staking credential
          : 2 // no face sign
        : 0,
    [hasEvmWallet, hasStakingCredential, stepIndex, hasFaceSign],
  );

  console.log({
    initialeStep,
    hasFaceSign,
    hasStakingCredential,
    hasEvmWallet,
    stepIndex,
  });

  useEffect(() => {
    if (initialeStep === null) return;
    if (initialeStep > stepIndex) {
      setStepIndex(initialeStep);
    }
  }, [initialeStep, stepIndex]);

  useEffect(() => {
    return () => {
      console.log('unmount');
      setStepIndex(0);
    };
  }, []);

  return (
    <div className="w-[900px] h-[720px] rounded-[40px] bg-neutral-950 flex flex-col items-center gap-24">
      {steps[stepIndex].component}
    </div>
  );
}
