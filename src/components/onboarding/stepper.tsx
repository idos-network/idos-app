import { useState } from 'react';

import {
  TopBar,
  TextBlock,
  StepperButton,
  DoneIcon,
  BulletList,
  StepperContainer,
} from './stepper-components';

function StepOne({ onNext }: { onNext: () => void }) {
  return (
    <>
      <TopBar activeStep="step-one" />

      <TextBlock
        title="Welcome to the idOS Network"
        subtitle="Complete these steps to create your decentralized identity profile"
      />

      <img className="w-96 h-96 grayscale" src="/idos_scalable.png" />
      <StepperButton onClick={onNext}>Create my idOS profile</StepperButton>
    </>
  );
}

function StepTwo({ onNext }: { onNext: () => void }) {
  // todo implement idos profile creation using enclave
  return (
    <>
      <TopBar activeStep="step-two" />

      <TextBlock
        title="Create your idOS key"
        subtitle="This key is the key to your idOS data. Be careful not to lose it: you'll need it later to view or share your idOS data."
      />

      <div className="w-[419px] h-[421px] flex items-center justify-center">
        {/* when confirmed */}
        <DoneIcon />
      </div>

      {/* TODO implement stepped approach: trigger profile creation > if has profile moves to next step */}
      <StepperButton onClick={onNext}>Create idOS key</StepperButton>
    </>
  );
}

export function StepThree({ onNext }: { onNext: () => void }) {
  // todo impl camera and / or file upload for human verification

  return (
    <>
      <TopBar activeStep="step-three" />
      <TextBlock
        title="Verify you are a human"
        subtitle="Complete a Proof of Personhood (PoP) verification."
      />
      <div className="w-[734px] h-[395px] flex flex-col items-center justify-center gap-5">
        <img
          src="/human_check.png"
          alt="idOS Scalable"
          className="object-contain w-[419px] h-[300px]"
        />

        <BulletList
          items={[
            'Complete a liveness check to prove you are a human',
            'No biometric data will be stored idOS relies on Keyless´zkBiometrics: learn more',
            'You will be able to authenticate with idOS in the future just showing your face',
          ]}
        />
      </div>
      <StepperButton onClick={onNext}>Verify you are human</StepperButton>
    </>
  );
}

export function StepFour() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-[782px] h-[746px] rounded-[20px] bg-idos-grey1 p-6 flex flex-col items-center justify-center gap-10">
        <div className="flex w-[734px] h-[56px] rounded-[100px] justify-between p-1"></div>

        <TopBar />

        <div className="w-[520px] h-[61px] flex flex-col gap-1">
          Bing bong. All done.
        </div>

        <StepperButton onClick={() => (window.location.href = '/')}>
          Continue
        </StepperButton>
      </div>
    </div>
  );
}

export default function OnboardingStepper() {
  const [activeStep, setActiveStep] = useState('step-one');

  const steps = [
    { id: 'step-one', component: StepOne },
    { id: 'step-two', component: StepTwo },
    { id: 'step-three', component: StepThree },
    { id: 'step-four', component: StepFour },
  ];

  function getCurrentStepComponent() {
    const currentStep = steps.find((step) => step.id === activeStep);

    if (!currentStep) {
      return null;
    }

    const StepComponent = currentStep.component;

    return <StepComponent onNext={handleNext} />;
  }

  function handleNext() {
    const currentIndex = steps.findIndex((step) => step.id === activeStep);

    setActiveStep(steps[currentIndex + 1].id);
  }

  // todo: maybe blur out the background
  return <StepperContainer>{getCurrentStepComponent()}</StepperContainer>;
}
