import { useIdOS } from '@/context/idos-context';
import { env } from '@/env';
import { useUserMainEvm } from '@/hooks/useUserMainEvm';
import { useStepperStore } from '@/stores/stepper-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
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

export const useHasProfile = () => {
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

export const useIdosUserInfo = () => {
  const { idOSClient } = useIdOS();
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: () => {
      return idOSClient.state === 'logged-in' && idOSClient.user;
    },
    enabled: idOSClient.state === 'logged-in',
  });
};

export const useUserWallets = () => {
  const { idOSClient } = useIdOS();
  return useQuery({
    queryKey: ['userWallets'],
    queryFn: () => {
      return idOSClient.state === 'logged-in' ? idOSClient.getWallets() : [];
    },
    enabled: idOSClient.state === 'logged-in',
  });
};

export const useHasStakingCredential = () => {
  const { idOSClient } = useIdOS();
  return useQuery({
    queryKey: ['_hasStakingCredential'],
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
    enabled: ['with-user-signer', 'logged-in'].includes(idOSClient.state),
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
  const { step, nextStep, prevStep, setStep } = useStepperStore();
  const { mainEvm } = useUserMainEvm();
  const { idOSClient } = useIdOS();
  const isLoggedIn = idOSClient.state === 'logged-in' && idOSClient.user.id;

  const { data: stakingCredentials } = useHasStakingCredential();
  const hasStakingCredential = !!stakingCredentials?.length;
  const { data: hasProfile } = useHasProfile();
  console.log({ step });

  const component = useMemo(() => steps[2].component, [step]);
  useEffect(() => {
    debugger;

    // if (isLoggedIn) {
    //   if (mainEvm) {
    //     setStep(4);
    //     return;
    //   }
    //   if (!hasStakingCredential) {
    //     setStep(3);
    //     return;
    //   }
    //   setStep(2);
    // }
  }, [isLoggedIn, hasStakingCredential, mainEvm, hasProfile]);

  // function getCurrentStepComponent() {
  //   const currentStep = steps.find((step) => step.id === step);
  //   if (!currentStep) return null;

  //   const StepComponent = currentStep.component;

  //   const isCompletionStep =
  //     currentStep.id === 'step-four' || currentStep.id === 'step-five';
  //   return (
  //     <StepComponent
  //       onNext={handleNext}
  //       onComplete={isCompletionStep ? onComplete : undefined}
  //     />
  //   );
  // }

  // function handleNext() {
  //   if (!activeStep) return;
  //   const currentIndex = steps.findIndex((step) => step.id === activeStep);
  //   setActiveStep(steps[currentIndex + 1]?.id ?? null);
  // }

  return (
    <div className="w-[900px] h-[720px] rounded-[40px] bg-neutral-950 flex flex-col items-center gap-24">
      {component}
    </div>
  );
}
