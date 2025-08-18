import { useToast } from '@/hooks/useToast';
import CredentialIcon from '@/icons/credential';
import KeyIcon from '@/icons/key';
import PersonIcon from '@/icons/person';
import { useEffect, useState } from 'react';
import GetStartedTextBlock from '../components/GetStartedCards';
import StepperButton from '../components/StepperButton';

interface GetStartedProps {
  onNext: () => void;
}

export default function GetStarted({ onNext }: GetStartedProps) {
  const { showToast } = useToast();
  const [hasShownToast, setHasShownToast] = useState(() => {
    return localStorage.getItem('onboardingToastShown') === 'true';
  });

  useEffect(() => {
    if (!hasShownToast) {
      setTimeout(() => {
        showToast({
          type: 'onboarding',
          message: '',
          duration: 45000,
        });
        localStorage.setItem('onboardingToastShown', 'true');
      }, 750);
      setHasShownToast(true);
    }
  }, [showToast, hasShownToast]);

  return (
    <div className="relative w-[910px] h-full rounded-[40px] bg-gradient-to-r from-[#292929] to-idos-grey1 p-[1px] overflow-hidden">
      <div className="h-full w-full bg-idos-grey1/90 flex flex-col gap-10 p-10 rounded-[40px]">
        <img
          src="/idOS-cubes-1.png"
          alt="Cubes 1"
          className="absolute top-4 right-50 w-40 h-40 select-none z-1 scale-80"
        />
        <img
          src="/idOS-cubes-2.png"
          alt="Cubes 2"
          className="absolute top-16 right-6 w-46 h-46 select-none z-1 scale-80"
        />
        <div className="z-5 flex flex-col gap-6 mt-4 mb-4">
          <div className="text-aquamarine-400 text-xl font-light">
            Get started
          </div>
          <div className="text-neutral-50 text-5xl font-light">
            Create your
            <br />
            idOS Profile
          </div>
        </div>
        <div className="flex flex-row gap-5 z-5 mb-auto flex-1">
          <GetStartedTextBlock
            icon={<KeyIcon color="#181A20" className="w-7 h-7" />}
            title="1. Create your private key"
            subtitle="Generate a unique key to protect your idOS profile and encrypt your data."
          />
          <GetStartedTextBlock
            icon={<PersonIcon color="#181A20" className="w-7 h-7" />}
            title="2. Verify your identity"
            subtitle="Complete a light identity verification check with one of our trusted providers."
          />
          <GetStartedTextBlock
            icon={<CredentialIcon color="#181A20" />}
            title="3. Add a credential"
            subtitle="Add a credential with your identity data to your idOS Profile. idOS won’t have access, unless you share an Access Grant."
          />
        </div>
        <div className="flex justify-center z-5">
          <StepperButton onClick={onNext}>Create idOS profile</StepperButton>
        </div>
      </div>
    </div>
  );
}
