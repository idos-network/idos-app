import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { useSignMessage } from 'wagmi';

import TopBar from './components/TopBar';
import StepperButton from './components/StepperButton';
import TextBlock from './components/TextBlock';
import Spinner from './components/Spinner';
import KeylessEnroll from './components/KeylessEnroll';
import GetStartedTextBlock from './components/GetStartedCards';
import StepperCards from './components/StepperCards';
import { DevicesIcon } from '@/icons/devices';
import FrameIcon from '@/icons/frame';
import PortraitIcon from '@/icons/portrait';
import ShieldIcon from '@/icons/shield';
import CredentialIcon from '@/icons/credential';
import PersonIcon from '@/icons/person';
import KeyIcon from '@/icons/key';
import { GraphIcon } from '../icons/graph';
import { useIdOS } from '@/providers/idos/idos-client';
import { useEthersSigner } from '@/hooks/useEthersSigner';
import {
  clearUserData,
  getCurrentUser,
  updateUserState,
} from '@/storage/idos-profile';
import { verifyRecaptcha } from '@/api/idos-profile';
import { env } from '@/env';
import {
  handleCreateIdOSProfile,
  handleSaveIdOSProfile,
} from '@/handlers/idos-profile';
import useRecaptcha from '@/hooks/useRecaptcha';
import { useCredentials } from '@/hooks/useCredentials';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';
import {
  handleDWGCredential,
  handleCreateIdOSCredential,
} from '@/handlers/idos-credential';
import type { IdosDWG } from '@/interfaces/idos-credential';
import { useToast } from '@/hooks/useToast';

function StepOne({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative w-[900px] h-full rounded-[40px] bg-gradient-to-r from-[#292929] to-idos-grey1 p-[1px] overflow-hidden">
      <div className="h-full w-full bg-idos-grey1/90 flex flex-col gap-10 p-14 rounded-[40px]">
        <img
          src="/idOS-cubes-1.png"
          alt="Cubes 1"
          className="absolute top-10 right-58 w-40 h-40 select-none"
          style={{ zIndex: 1 }}
        />
        <img
          src="/idOS-cubes-2.png"
          alt="Cubes 2"
          className="absolute top-28 right-12 w-46 h-46 select-none"
          style={{ zIndex: 1 }}
        />
        <div className="z-10 flex flex-col gap-6 py-6">
          <div className="text-aquamarine-400 text-xl font-normal">
            Get started
          </div>
          <div className="text-neutral-50 text-6xl font-normal">
            Create your
            <br />
            idOS Profile
          </div>
        </div>
        <div className="flex flex-row gap-5 z-10 mb-auto flex-1">
          <GetStartedTextBlock
            icon={<KeyIcon color="#181A20" className="w-7 h-7" />}
            title="1. Private key"
            subtitle="Generate a unique key to protect your idOS profile."
          />
          <GetStartedTextBlock
            icon={<PersonIcon color="#181A20" className="w-7 h-7" />}
            title="2. Human verification"
            subtitle="Confirm you're human to access decentralized identity."
          />
          <GetStartedTextBlock
            icon={<CredentialIcon color="#181A20" />}
            title="3. Add a credential"
            subtitle="Add a credential to your idOS Profile"
          />
        </div>
        <div className="flex justify-center z-10">
          <StepperButton onClick={onNext}>Create idOS profile</StepperButton>
        </div>
      </div>
    </div>
  );
}

function StepTwo({ onNext }: { onNext: () => void }) {
  const [state, setState] = useState('idle');
  const { withSigner } = useIdOS();
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const signer = useEthersSigner();
  // const { isError, isSuccess, signMessage } = useSignMessage();

  useEffect(() => {
    handleSaveIdOSProfile(setState, setLoading, withSigner, signer, onNext);
  }, [onNext, signer, withSigner]);

  useEffect(() => {
    if (error) {
      setState('idle');
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-14 h-[675px] w-[700px]">
      <TopBar activeStep="step-two" />
      {state !== 'created' && (
        <>
          <TextBlock
            title="Create your idOS key"
            subtitle="Generate a unique key to protect your idOS profile."
          />
        </>
      )}
      {state === 'idle' && (
        <div className="flex flex-col gap-14 flex-1">
          <div className="w-full h-full flex flex-row gap-5">
            <StepperCards
              icon={<ShieldIcon color="var(--color-aquamarine-400)" />}
              title="Your keys, your data"
              description="idOS is a self-sovereign solution, where data is only created and shared based on user consent, and encrypted with your key pair."
            />
            <StepperCards
              icon={<PortraitIcon color="var(--color-aquamarine-400)" />}
              title="Manage your data with your face"
              description="Just like unlocking your phone. Alternatively, sign with your wallet or use a password. All options are secure and private."
            />
          </div>
          <div className="flex justify-center mt-auto">
            <StepperButton className="bg-none"></StepperButton>
          </div>
        </div>
      )}
      {state === 'creating' && (
        <>
          <div className="flex justify-center flex-1 items-center">
            {loading && <Spinner />}
            {error && <div className="text-red-500">{error}</div>}
          </div>
          <div className="flex justify-center">
            {/* <StepperButton>Creating your idOS key...</StepperButton> */}
          </div>
        </>
      )}
      {state === 'waiting_signature' && (
        <>
          <div className="flex justify-center flex-1 items-center">
            {loading && <Spinner />}
            {error && <div className="text-red-500">{error}</div>}
          </div>
          <div className="flex justify-center">
            <StepperButton disabled={true}>
              Waiting for signature...
            </StepperButton>
          </div>
        </>
      )}
    </div>
  );
}

function StepThree({ onNext }: { onNext: () => void }) {
  const [state, setState] = useState('idle');
  const { captchaToken, setCaptchaToken, recaptchaRef, handleRecaptcha } =
    useRecaptcha();

  const currentUser = getCurrentUser();
  const userId = currentUser?.id || '';
  const userAddress = currentUser?.mainAddress || '';
  const userEncryptionPublicKey = currentUser?.userEncryptionPublicKey || '';
  const ownershipProofSignature = currentUser?.ownershipProofSignature || '';

  // Button group for both states
  function ButtonGroup({
    primaryText,
    primaryOnClick,
    primaryDisabled = false,
    secondaryText,
    secondaryOnClick,
  }: {
    primaryText: string;
    primaryOnClick: () => void;
    primaryDisabled?: boolean;
    secondaryText: string;
    secondaryOnClick: () => void;
  }) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 mt-auto">
        <StepperButton onClick={primaryOnClick} disabled={primaryDisabled}>
          {primaryText}
        </StepperButton>
        <StepperButton
          className="bg-none text-aquamarine-50 hover:text-aquamarine-200"
          onClick={secondaryOnClick}
        >
          {secondaryText}
        </StepperButton>
      </div>
    );
  }

  useEffect(() => {
    if (state === 'verified') {
      updateUserState(userAddress, { humanVerified: true });
      const handleProfile = async () => {
        setState('creating');
        const response = await handleCreateIdOSProfile(
          userId,
          userEncryptionPublicKey,
          userAddress,
          env.VITE_OWNERSHIP_PROOF_MESSAGE,
          ownershipProofSignature,
        );
        if (!response) {
          setState('idle');
        } else {
          onNext();
        }
      };
      handleProfile();
    }
  }, [
    state,
    onNext,
    userAddress,
    userId,
    userEncryptionPublicKey,
    ownershipProofSignature,
  ]);

  function handleProofOfHumanity() {
    setState('verifying');
  }

  function handleKeylessError(error: any) {
    console.error('Keyless enrollment failed:', error);
    setState('idle');
  }

  function handleKeylessFinished() {
    setState('verified');
  }

  function handleKeylessCancel() {
    setState('idle');
  }

  function handleRecaptchaExpired() {
    console.warn('reCAPTCHA expired');
    setCaptchaToken('');
  }

  function handleRecaptchaError(error: any) {
    console.error('reCAPTCHA error:', error);
    setCaptchaToken('');
  }

  async function handleRecaptchaSubmit() {
    if (!captchaToken) {
      alert('Please complete the reCAPTCHA verification.');
      return;
    }

    try {
      const response = await verifyRecaptcha(captchaToken);

      if (response.success) {
        setState('verified');
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error) {
      console.error('reCAPTCHA verification failed:', error);
      alert('Verification failed. Please try again.');
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaToken('');
    }
  }

  return (
    <div className="flex flex-col gap-14 h-[675px] w-[700px]">
      <TopBar activeStep="step-three" />
      {/* Main content area, always flex-1, column, justify-between */}
      <div className="flex flex-col flex-1 justify-between">
        {/* Top content: cards or recaptcha */}
        {state !== 'verifying' && state !== 'recaptcha' && (
          <>
            <div className="flex flex-col gap-14">
              <TextBlock
                title="Verify you are a human"
                subtitle="In a moment, we'll ask you to follow some instructions for a liveness check. This will let us know that this is you, without exposing your identity."
              />
              <div className="w-full h-full flex flex-row gap-5 min-h-[120px]">
                <StepperCards
                  icon={<DevicesIcon color="var(--color-aquamarine-400)" />}
                  description="Biometric check happens on your device."
                />
                <StepperCards
                  icon={<FrameIcon color="var(--color-aquamarine-400)" />}
                  description="Pictures of your face are never stored."
                />
                <StepperCards
                  icon={
                    <PersonIcon
                      color="var(--color-aquamarine-400)"
                      width="36"
                      height="36"
                    />
                  }
                  description="Future authentication will work across any of your linked devices"
                />
              </div>
            </div>
          </>
        )}
        {state === 'recaptcha' && (
          <div className="flex flex-col gap-14 min-h-[220px]">
            <TextBlock
              title="Verify you are a human"
              subtitle="Prove your humanity to acess the decentralized identity system."
            />
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="recaptcha-wrapper">
                <ReCAPTCHA
                  className="g-recaptcha"
                  ref={recaptchaRef}
                  sitekey={env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptcha}
                  onExpired={handleRecaptchaExpired}
                  onError={handleRecaptchaError}
                  theme="dark"
                />
                <div className="rc-anchor-checkbox-label">I'm not a robot</div>
                <div className="recaptcha-info"></div>
                <div className="rc-anchor-logo-text">reCAPTCHA</div>
                <div className="rc-anchor-pt">
                  <a
                    href="https://www.google.com/intl/en/policies/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy
                  </a>
                  <span aria-hidden="true" role="presentation">
                    {' '}
                    -{' '}
                  </span>
                  <a
                    href="https://www.google.com/intl/en/policies/terms/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Button group, always at the bottom */}
        {state === 'idle' && (
          <div className="flex flex-col items-center justify-center gap-3 mt-auto">
            <ButtonGroup
              primaryText="Verify you are human"
              primaryOnClick={handleProofOfHumanity}
              secondaryText="Choose another method"
              secondaryOnClick={() => setState('recaptcha')}
            />
          </div>
        )}
        {state === 'recaptcha' && (
          <div className="flex flex-col items-center justify-center gap-3 mt-auto">
            <ButtonGroup
              primaryText="Verify with reCAPTCHA"
              primaryOnClick={handleRecaptchaSubmit}
              primaryDisabled={captchaToken === ''}
              secondaryText="Choose another method"
              secondaryOnClick={() => setState('idle')}
            />
          </div>
        )}
      </div>
      {state === 'verifying' && (
        <div className="flex flex-col gap-14 flex-1">
          <TextBlock
            title="Verify you are a human"
            subtitle="Please follow the instructions to complete your biometric enrollment."
          />
          <KeylessEnroll
            userId={userId}
            onError={handleKeylessError}
            onFinished={handleKeylessFinished}
            onCancel={handleKeylessCancel}
          />
        </div>
      )}
      {state === 'creating' && (
        <>
          <div className="flex justify-center">
            <StepperButton disabled={true}>
              Creating your idOS profile...
            </StepperButton>
          </div>
        </>
      )}
    </div>
  );
}

function StepFour() {
  const [state, setState] = useState('idle');
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const { withSigner } = useIdOS();
  const signer = useEthersSigner();
  const { isError, isSuccess } = useSignMessage();
  const { showToast } = useToast();

  useEffect(() => {
    if (isSuccess) {
      setState('created');
    } else if (isError) {
      setState('idle');
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (state === 'created') {
      window.location.href = '/';
    }
  }, [state]);

  async function handleAddCredential() {
    const withSignerLoggedIn = await withSigner.logIn();
    try {
      setState('creating');
      const idOSDWG: IdosDWG = await handleDWGCredential(
        setState,
        setLoading,
        withSignerLoggedIn,
        signer,
      );
      if (!idOSDWG) {
        setState('idle');
        return;
      }

      setState('creating');
      const response = await handleCreateIdOSCredential(
        idOSDWG,
        withSignerLoggedIn.user.recipient_encryption_public_key,
        withSignerLoggedIn.user.id,
      );
      if (response) {
        setState('created');
        localStorage.setItem(
          'showToast',
          JSON.stringify({
            type: 'success',
            message: 'Your credential has been added to your profile.',
          }),
        );
        window.location.reload();
      } else {
        setState('idle');
      }
    } catch (error) {
      console.error('Credential creation failed:', error);
      showToast({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      });
      setState('idle');
    }
  }

  return (
    <div className="flex flex-col gap-14 h-[675px] w-[700px]">
      <TopBar activeStep="step-four" />
      {state !== 'created' && (
        <>
          <TextBlock
            title="Add a credential to your idOS profile"
            subtitle="Link your credential to finish onboarding."
          />
        </>
      )}
      {state === 'idle' && (
        <div className="flex flex-col gap-14 flex-1">
          <div className="w-full h-full flex flex-row gap-5">
            <StepperCards
              icon={
                <CredentialIcon
                  color="var(--color-aquamarine-400)"
                  className="w-8 h-8"
                />
              }
              description="Your idOS credential is like a digital passport that you control. It stores your verified identity information securely in one place."
            />
            <StepperCards
              icon={<GraphIcon color="var(--color-aquamarine-400)" />}
              description="You choose exactly what information to share with different apps and services. You own and control your data."
            />
          </div>
          <div className="flex justify-center mt-auto">
            <StepperButton onClick={handleAddCredential}>
              Add Credential
            </StepperButton>
          </div>
        </div>
      )}
      {state === 'creating' && (
        <>
          <div className="flex justify-center flex-1 items-center">
            <Spinner />
          </div>
          <div className="flex justify-center">
            <StepperButton disabled={true}>
              Waiting for confirmation...
            </StepperButton>
          </div>
        </>
      )}
      {state === 'waiting_signature' && (
        <>
          <div className="flex justify-center flex-1 items-center">
            {loading && <Spinner />}
            {error && <div className="text-red-500">{error}</div>}
          </div>
          <div className="flex justify-center">
            <StepperButton disabled={true}>
              Waiting for signature...
            </StepperButton>
          </div>
        </>
      )}
    </div>
  );
}

export default function OnboardingStepper() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const { credentials, isLoading } = useCredentials();
  const signer = useEthersSigner();
  const hasProfile = useIdOSLoginStatus();

  const steps = [
    { id: 'step-one', component: StepOne },
    { id: 'step-two', component: StepTwo },
    { id: 'step-three', component: StepThree },
    { id: 'step-four', component: StepFour },
  ];

  useEffect(() => {
    if (isLoading) return;

    const currentUser = getCurrentUser();

    if (currentUser) {
      if (currentUser.mainAddress !== signer?.address && !hasProfile) {
        setActiveStep('step-one');
        clearUserData();
        return;
      } else if (hasProfile) {
        setActiveStep('step-four');
        return;
      }

      if (currentUser.humanVerified) {
        if (credentials.length === 0) {
          setActiveStep('step-four');
          return;
        }
      } else if (currentUser.idosKey) {
        setActiveStep('step-three');
        return;
      }
    } else if (hasProfile) {
      setActiveStep('step-four');
      return;
    }

    setActiveStep('step-one');
  }, [credentials, isLoading, hasProfile, signer?.address]);

  function getCurrentStepComponent() {
    const currentStep = steps.find((step) => step.id === activeStep);
    if (!currentStep) return null;
    const StepComponent = currentStep.component;
    return <StepComponent onNext={handleNext} />;
  }

  function handleNext() {
    if (!activeStep) return;
    const currentIndex = steps.findIndex((step) => step.id === activeStep);
    setActiveStep(steps[currentIndex + 1]?.id ?? null);
  }

  if (!activeStep) return null;

  return (
    <div className="w-[900px] h-[750px] rounded-[20px] bg-neutral-950 flex flex-col items-center  gap-24">
      {getCurrentStepComponent()}
    </div>
  );
}
