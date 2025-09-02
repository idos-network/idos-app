import { useIdOS } from '@/context/idos-context';
import { env } from '@/env';
import { useSpecificCredential } from '@/hooks/useCredentials';
import { getCurrentUserFromLocalStorage } from '@/storage/idos-profile';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  AddCredential,
  AddEVMWallet,
  CreatePrivateKey,
  GetStarted,
  VerifyIdentity,
} from './steps';

const savedUser = getCurrentUserFromLocalStorage();

export const useHasStakingCredential = () => {
  const { idOSClient } = useIdOS();
  return useQuery({
    queryKey: ['has-staking-credentials'],
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
  return useQuery({
    queryKey: [],
    queryFn: () => {
      if (!idOSClient) return null;
      return idOSClient.state === 'logged-in' ? idOSClient.user.id : null;
    },
    enabled: !!idOSClient && idOSClient.state === 'logged-in',
    staleTime: 0,
    gcTime: 0,
  });
};

export default function OnboardingStepper() {
  const { hasCredential: _hasStakingCredential } = useSpecificCredential(
    env.VITE_ISSUER_SIGNING_PUBLIC_KEY,
  );
  const { stepIndex, setStepIndex } = useOnboardingStore();
  const { data: userId } = useUserId();
  const steps = [
    { id: 'step-one', component: <GetStarted /> }, // Get started
    { id: 'step-two', component: <CreatePrivateKey /> }, // Create your private key
    { id: 'step-three', component: <VerifyIdentity /> }, // Verify identity after which idOS profile is created
    { id: 'step-four', component: <AddCredential /> }, // Add a credential
    { id: 'step-five', component: <AddEVMWallet /> }, // Set up primary EVM wallet only for non EVM wallets
  ];

  const initialeStep = userId ? 3 : savedUser ? 2 : 0;

  useEffect(() => {
    if (initialeStep < stepIndex) return;
    setStepIndex(initialeStep);
  }, [initialeStep]);

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
