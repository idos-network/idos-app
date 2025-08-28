import { env } from '@/env';
import { useSpecificCredential } from '@/hooks/useCredentials';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';
import { useUserMainEvm } from '@/hooks/useUserMainEvm';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import {
  clearUserDataFromLocalStorage,
  getCurrentUserFromLocalStorage,
} from '@/storage/idos-profile';
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

export default function OnboardingStepper({
  onComplete,
}: OnboardingStepperProps) {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const hasProfile = useIdOSLoginStatus();
  const walletConnector = useWalletConnector();
  const { mainEvm } = useUserMainEvm();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const { hasCredential: hasStakingCredential, isLoading } =
    useSpecificCredential(env.VITE_ISSUER_SIGNING_PUBLIC_KEY);

  const steps = [
    { id: 'step-one', component: GetStarted }, // Get started
    { id: 'step-two', component: CreatePrivateKey }, // Create your private key
    { id: 'step-three', component: VerifyIdentity }, // Verify identity after which idOS profile is created
    { id: 'step-four', component: AddCredential }, // Add a credential
    { id: 'step-five', component: AddEVMWallet }, // Set up primary EVM wallet only for non EVM wallets
  ];
  useEffect(() => {
    if (isLoading) return;

    const currentUser = getCurrentUserFromLocalStorage();

    if (currentUser && wallet) {
      if (currentUser.mainAddress !== wallet.address) {
        clearUserDataFromLocalStorage();
      }

      if (!hasProfile) {
        setActiveStep('step-one');
        return;
      }

      if (currentUser.humanVerified && !hasStakingCredential) {
        setActiveStep('step-four');
        return;
      } else if (currentUser.idosKey) {
        setActiveStep('step-three');
        return;
      }
    } else if (hasProfile && !hasStakingCredential) {
      setActiveStep('step-four');
      return;
    } else if (hasProfile && hasStakingCredential && !mainEvm) {
      setActiveStep('step-five');
      return;
    }

    setActiveStep('step-one');
  }, [isLoading, hasProfile, wallet, hasStakingCredential, mainEvm]);

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
