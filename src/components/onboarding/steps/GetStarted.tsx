import { useToast } from '@/hooks/useToast';
import CredentialIcon from '@/icons/credential';
import KeyIcon from '@/icons/key';
import PersonIcon from '@/icons/person';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useEffect } from 'react';
import GetStartedTextBlock from '../components/GetStartedCards';
import StepperButton from '../components/StepperButton';

export default function GetStarted() {
  const { showToast } = useToast();
  const { nextStep } = useOnboardingStore();

  useEffect(() => {
    const onboardingToastShown = localStorage.getItem('onboardingToastShown');
    if (!onboardingToastShown) {
      setTimeout(() => {
        showToast({
          type: 'onboarding',
          message: '',
          duration: 45000,
        });
        localStorage.setItem('onboardingToastShown', 'true');
      }, 750);
    }
  }, []);

  return (
    <div className="relative w-[910px] h-full rounded-[40px] bg-gradient-to-r  from-[#292929] to-idos-grey1 p-[1px] overflow-hidden">
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
            title="1. Create your idOS Private Key"
            subtitle="Sign to generate a unique key to encrypt your idOS Profile data."
          />
          <GetStartedTextBlock
            icon={<PersonIcon color="#181A20" className="w-7 h-7" />}
            title="2. Verify you are a human"
            subtitle="Complete privacy-preserving biometric proof of personhood with idOS FaceSign to finish creating your profile."
          />
          <GetStartedTextBlock
            icon={<CredentialIcon color="#181A20" />}
            title="3. Add a credential"
            subtitle="Add the anonymized proof of personhood credential to your idOS Profile. Nobody can see this data unless you give them access."
          />
        </div>
        <div className="flex justify-center z-5">
          <StepperButton onClick={nextStep}>
            👤 Create idOS Profile
          </StepperButton>
        </div>
      </div>
    </div>
  );
}
