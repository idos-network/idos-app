import { useEffect, useState } from 'react';

import TopBar from './components/TopBar';
import StepperButton from './components/StepperButton';
import TextBlock from './components/TextBlock';
import ShieldIcon from '../icons/shield';
import PersonIcon from '../icons/person';
import { DevicesIcon } from '../icons/devices';
import PortraitIcon from '../icons/portrait';
import FrameIcon from '../icons/frame';
import Spinner from './components/Spinner';
import CheckIcon from '../icons/check';
import { useSignMessage } from 'wagmi';

function StepOne({ onNext }: { onNext: () => void }) {
  return (
    <>
      <TextBlock
        title="Welcome to the idOS Network"
        subtitle="Complete these steps to create your decentralized identity profile"
      />

      <img className="w-96 h-96 object-contain " src="/idos_scalable.png" />
      <StepperButton onClick={onNext}>Create my idOS profile</StepperButton>
    </>
  );
}

function StepTwo({ onNext }: { onNext: () => void }) {
  const [state, setState] = useState('idle');

  const { isError, isSuccess, signMessage } = useSignMessage();

  async function handleCreateAccount() {
    try {
      setState('creating');
      signMessage({ message: 'Create idOS key' });
    } catch (error) {
      console.error('Account creation failed:', error);
      setState('idle');
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setState('created');
    } else if (isError) {
      setState('idle');
    }
  }, [isSuccess, isError]);

  return (
    <>
      <TopBar activeStep="step-two" />
      {state === 'idle' && (
        <>
          <TextBlock
            title="Create your idOS key"
            subtitle="Generate a unique key to protect your idOS profile."
          />
          <div className="w-[716px] h-[296px] flex flex-row gap-5">
            <div className="w-[348px] h-[296px] rounded-[20px] p-10 flex flex-col gap-8 bg-neutral-900">
              <ShieldIcon color="var(--color-aquamarine-400)" />
              <div className="w-[268px] h-[152px] flex flex-col gap-4">
                <span className="font-['Inter'] text-2xl font-semibold text-neutral-200">
                  Your keys, your data
                </span>
                <span className="font-['Inter'] text-sm text-neutral-400 ">
                  idOS is a self-sovereign solution, where data is only created
                  and shared based on user consent, and encrypted with your key
                  pair.
                </span>
              </div>
            </div>

            <div className="w-[348px] h-[296px] rounded-[20px] p-10 flex flex-col gap-8 bg-neutral-900">
              <PortraitIcon color="var(--color-aquamarine-400)" />

              <div className="w-[268px] h-[152px] flex flex-col gap-4">
                <span className="font-['Inter'] text-2xl font-semibold text-neutral-200">
                  Manage your data with your face
                </span>
                <span className="font-['Inter'] text-sm text-neutral-400 ">
                  Just like unlocking your phone. Alternatively, sign with your
                  wallet or use a password. All options are secure and private.
                </span>
              </div>
            </div>
          </div>
          <StepperButton onClick={handleCreateAccount}>
            Create idOS Key
          </StepperButton>
        </>
      )}
      {state === 'creating' && (
        <>
          <TextBlock
            title="Create your idOS key"
            subtitle="Generate a unique key to protect your idOS profile."
          />
          <Spinner />
          <StepperButton className="bg-aquamarine-600 text-neutral-950">
            Waiting for signature...
          </StepperButton>
        </>
      )}
      {state === 'created' && (
        <>
          <TextBlock
            title="Create your idOS Key"
            subtitle="Your private key has been securely created"
          />
          <div className="w-[120px] h-[120px] bg-aquamarine-950 rounded-full flex items-center justify-center">
            <CheckIcon
              width="63"
              height="45"
              color="var(--color-aquamarine-400)"
            />
          </div>
          <StepperButton onClick={onNext}>Continue</StepperButton>
        </>
      )}
    </>
  );
}

function StepThree({ onNext }: { onNext: () => void }) {
  // todo impl camera and / or file upload for human verification
  const [state, setState] = useState('idle');

  async function handleProofOfHumanity() {
    try {
      setState('verifying');
      // Simulate a verification process using the keyless biometric system
      // TODO update this to receive the keyless response
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setState('verified');
    } catch (error) {
      console.error('Verification failed:', error);
      setState('idle');
    }
  }

  return (
    <>
      <TopBar activeStep="step-three" />

      {state === 'idle' && (
        <>
          <TextBlock
            title="Verify you are a human"
            subtitle="In a moment, we'll ask you to follow some instructions for a liveness check. This will let us know that this is you, without exposing your identity."
          />

          <div className="w-[716px] h-[152px] flex flex-row gap-5 font-['Inter'] text-neutral-200 font-light">
            <div className="w-[225px] h-[152px] rounded-[20px] p-5 flex flex-col gap-5 bg-neutral-900">
              <DevicesIcon color="var(--color-aquamarine-400)" />
              Biometric check happens on your device.
            </div>
            <div className="w-[225px] h-[152px] rounded-[20px] p-5 flex flex-col gap-5 bg-neutral-900">
              <FrameIcon color="var(--color-aquamarine-400)" />
              Pictures of your face are never stored.
            </div>
            <div className="w-[225px] h-[152px] rounded-[20px] p-5 flex flex-col gap-5 bg-neutral-900">
              <PersonIcon
                color="var(--color-aquamarine-400)"
                width="32"
                height="32"
              />
              Future authentication will work across any of your linked devices
            </div>
          </div>
          <div className="w-full flex flex-col items-center gap-5">
            <StepperButton onClick={handleProofOfHumanity}>
              Verify that you are human
            </StepperButton>
            <StepperButton className="bg-neutral-950 text-aquamarine-400">
              Choose another method
            </StepperButton>
          </div>
        </>
      )}

      {state === 'verifying' && (
        <>
          Proof of personhood in progress...
          <div className="w-[716px] h-[216px] flex flex-col gap-5 rounded-[20px] p-5 bg-neutral-900">
            <video
              ref={(video) => {
                if (video) {
                  navigator.mediaDevices
                    .getUserMedia({ video: true })
                    .then((stream) => {
                      video.srcObject = stream;
                      video.play();
                    })
                    .catch((err) =>
                      console.error('Camera access failed:', err),
                    );
                }
              }}
              className="w-full h-32 object-cover rounded-lg"
              autoPlay
              muted
            />
          </div>
          <StepperButton className="bg-aquamarine-600 text-neutral-950">
            Continue
          </StepperButton>
        </>
      )}

      {state === 'verified' && (
        <>
          <TextBlock
            title="Verification Complete"
            subtitle="You can now access the decentralized identity system."
          />
          <div className="w-[120px] h-[120px] bg-aquamarine-950 rounded-full flex items-center justify-center">
            <CheckIcon
              width="63"
              height="45"
              color="var(--color-aquamarine-400)"
            />
          </div>
          <StepperButton onClick={onNext}>Continue</StepperButton>
        </>
      )}
    </>
  );
}

function StepFour() {
  const [state, setState] = useState('idle');

  const { isError, isSuccess, signMessage } = useSignMessage();

  async function handleCreateCredential() {
    try {
      setState('creating');
      signMessage({ message: 'Create an idOS Credential' });
    } catch (error) {
      console.error('Account creation failed:', error);
      setState('idle');
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setState('created');
    } else if (isError) {
      setState('idle');
    }
  }, [isSuccess, isError]);

  return (
    <>
      <TopBar activeStep="step-four" />
      {state !== 'created' && (
        <TextBlock
          title="Add a credential to your idOS profile"
          subtitle="Link your credential to finish onboarding."
        />
      )}
      {state === 'idle' && (
        <>
          <StepperButton onClick={handleCreateCredential}>
            Add Credential
          </StepperButton>
        </>
      )}

      {state === 'creating' && (
        <>
          <Spinner />
          <StepperButton className="bg-aquamarine-600 text-neutral-950">
            Add Credential{' '}
          </StepperButton>
        </>
      )}

      {state === 'created' && (
        <>
          All done! Your credential has been added to your idOS profile.
          <div className="w-[120px] h-[120px] bg-aquamarine-950 rounded-full flex items-center justify-center">
            <CheckIcon
              width="63"
              height="45"
              color="var(--color-aquamarine-400)"
            />
          </div>
          <StepperButton onClick={() => (window.location.href = '/')}>
            Continue
          </StepperButton>
        </>
      )}
    </>
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

  return (
    <div className="w-[716px] h-[510px]  rounded-[20px] bg-neutral-950 p-6 flex flex-col items-center justify-center gap-24">
      {getCurrentStepComponent()}
    </div>
  );
}
