import { useIdOS } from '@/context/idos-context';
import { env } from '@/env';
import { useSpecificCredential } from '@/hooks/useCredentials';
import { useUserMainEvm } from '@/hooks/useUserMainEvm';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  AddCredential,
  AddEVMWallet,
  CreatePrivateKey,
  GetStarted,
  VerifyIdentity,
} from './steps';

interface OnboardingStepperProps {
  onComplete?: () => void;
}

const useHasProfile = () => {
  const { idOSClient } = useIdOS();

  return useQuery({
    queryKey: [],
    queryFn: () => {
      return idOSClient.state === 'logged-in'
        ? !!idOSClient.user.id
        : idOSClient.state === 'with-user-signer' && idOSClient.hasProfile();
    },
    staleTime: 0,
    gcTime: 0,
  });
};

const useHasStakingCredential = () => {
  const { idOSClient } = useIdOS();
  return useQuery({
    queryKey: ['hasStakingCredential'],
    queryFn: () => {
      if (['with-user-signer', 'logged-in'].includes(idOSClient.state)) {
        if ('filterCredentials' in idOSClient)
          return idOSClient.filterCredentials({
            acceptedIssuers: [
              {
                authPublicKey: env.VITE_ISSUER_SIGNING_PUBLIC_KEY,
              },
            ],
          });
      }
    },
  });
};

export default function OnboardingStepper({
  onComplete,
}: OnboardingStepperProps) {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const { mainEvm } = useUserMainEvm();
  const { idOSClient } = useIdOS();
  const isLoggedIn = idOSClient.state === 'logged-in' && idOSClient.user.id;
  const {
    hasCredential: _hasStakingCredential,
    isLoading: isLoadingStakingCredential,
  } = useSpecificCredential(env.VITE_ISSUER_SIGNING_PUBLIC_KEY);

  const { data: stakingCredentials } = useHasStakingCredential();
  const hasStakingCredential = !!stakingCredentials?.length;
  const { data: hasProfile, isLoading: isLoadingHasProfile } = useHasProfile();
  const steps = [
    { id: 'step-one', component: GetStarted }, // Get started
    { id: 'step-two', component: CreatePrivateKey }, // Create your private key
    { id: 'step-three', component: VerifyIdentity }, // Verify identity after which idOS profile is created
    { id: 'step-four', component: AddCredential }, // Add a credential
    { id: 'step-five', component: AddEVMWallet }, // Set up primary EVM wallet only for non EVM wallets
  ];
  useEffect(() => {
    if (isLoadingHasProfile) return;
    if (isLoggedIn && hasStakingCredential) {
      if (mainEvm) {
        onComplete?.();
        return;
      }
      setActiveStep('step-four');
      return;
    }

    if (!hasProfile) {
      setActiveStep('step-one');
      return;
    }

    if (isLoggedIn && !hasStakingCredential) {
      setActiveStep('step-four');
      return;
    }
  }, [
    isLoadingStakingCredential,
    isLoggedIn,
    hasStakingCredential,
    mainEvm,
    hasProfile,
  ]);

  function getCurrentStepComponent() {
    const currentStep = steps.find((step) => step.id === activeStep);
    if (!currentStep) return null;
    const StepComponent = currentStep.component;

    const isCompletionStep =
      currentStep.id === 'step-four' || currentStep.id === 'step-five';
    return (
      <StepComponent
        onNext={handleNext}
        onComplete={isCompletionStep ? onComplete : undefined}
      />
    );
  }

  function handleNext() {
    if (!activeStep) return;
    const currentIndex = steps.findIndex((step) => step.id === activeStep);
    setActiveStep(steps[currentIndex + 1]?.id ?? null);
  }

  if (!activeStep) return null;

  return (
    <div className="w-[900px] h-[720px] rounded-[40px] bg-neutral-950 flex flex-col items-center gap-24">
      {getCurrentStepComponent()}
    </div>
  );
}
