import { useEffect, useState } from 'react';

import TopBar from './components/TopBar';
import StepperButton from './components/StepperButton';
import TextBlock from './components/TextBlock';
import Spinner from './components/Spinner';
import GetStartedTextBlock from './components/GetStartedCards';
import StepperCards from './components/StepperCards';
import FrameIcon from '@/icons/frame';
import CredentialIcon from '@/icons/credential';
import PersonIcon from '@/icons/person';
import KeyIcon from '@/icons/key';
import EncryptedIcon from '@/icons/encrypted';
import GraphIcon from '@/icons/graph';
import { useIdOS } from '@/context/idos-context';
import {
  clearUserDataFromLocalStorage,
  getCurrentUserFromLocalStorage,
  updateUserStateInLocalStorage,
} from '@/storage/idos-profile';
import { env } from '@/env';
import { handleCreateIdOSProfile } from '@/handlers/idos-profile';
import { useCredentials } from '@/hooks/useCredentials';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';
import {
  handleDWGCredential,
  handleCreateIdOSCredential,
} from '@/handlers/idos-credential';
import type { IdosDWG } from '@/interfaces/idos-credential';
import { useToast } from '@/hooks/useToast';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import { useHandleSaveIdOSProfile } from '@/hooks/useHandleSaveIdOSProfile';
import { useNearWallet } from '@/hooks/useNearWallet';

function useStepState(initial = 'idle') {
  const [state, setState] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { state, setState, loading, setLoading, error, setError };
}

// Get started
function StepOne({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative w-[900px] h-full rounded-[40px] bg-gradient-to-r from-[#292929] to-idos-grey1 p-[1px] overflow-hidden mt-[-10px]">
      <div className="h-full w-full bg-idos-grey1/90 flex flex-col gap-10 p-10 rounded-[40px]">
        <img
          src="/idOS-cubes-1.png"
          alt="Cubes 1"
          className="absolute top-4 right-50 w-40 h-40 select-none z-1 scale-80"
          // style={{ zIndex: 1 }}
        />
        <img
          src="/idOS-cubes-2.png"
          alt="Cubes 2"
          className="absolute top-16 right-6 w-46 h-46 select-none z-1 scale-80"
          // style={{ zIndex: 1 }}
        />
        <div className="z-5 flex flex-col gap-6 mt-4 mb-4">
          <div className="text-aquamarine-400 text-xl font-normal">
            Get started
          </div>
          <div className="text-neutral-50 text-5xl font-normal">
            Create your
            <br />
            idOS Profile
          </div>
        </div>
        <div className="flex flex-row gap-5 z-5 mb-auto flex-1">
          <GetStartedTextBlock
            icon={<KeyIcon color="#181A20" className="w-7 h-7" />}
            title="1. Create your private key"
            subtitle="Create your private key to protect your idOS profile and encrypt your data."
          />
          <GetStartedTextBlock
            icon={<PersonIcon color="#181A20" className="w-7 h-7" />}
            title="2. Verify your identity"
            subtitle="Complete a light identity verification check with one of our trusted providers."
          />
          <GetStartedTextBlock
            icon={<CredentialIcon color="#181A20" />}
            title="3. Add a credential"
            subtitle="Add a Verifiable Credential with your identity data to your idOS Profile."
          />
        </div>
        <div className="flex justify-center z-5">
          <StepperButton onClick={onNext}>Create idOS profile</StepperButton>
        </div>
      </div>
    </div>
  );
}

// Create your privatekey
function StepTwo({ onNext }: { onNext: () => void }) {
  const { state, setState, loading, setLoading, error } = useStepState();
  const { withSigner } = useIdOS();
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const handleSaveIdOSProfile = useHandleSaveIdOSProfile();

  useEffect(() => {
    handleSaveIdOSProfile(setState, setLoading, withSigner, wallet, onNext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withSigner, wallet, onNext]);

  useEffect(() => {
    if (error) {
      setState('idle');
    }
  }, [error, setState]);

  return (
    <div className="flex flex-col h-[600px] w-[700px]">
      <TopBar activeStep="step-two" />
      {state !== 'created' && (
        <div className="pt-14 pb-10">
          <TextBlock
            title="Create your private key"
            subtitle="idOS is a self-sovereign solution, where data is only created and shared based on user consent, and encrypted with your key pair."
          />
        </div>
      )}
      {state === 'idle' && (
        <div className="flex flex-col gap-10">
          <div className="w-full flex flex-col flex-1 items-center">
            <div className="rounded-full bg-[#00382D66] w-39 h-39 flex items-center justify-center">
              <EncryptedIcon color="var(--color-aquamarine-400)" />
            </div>
            <span className="text-neutral-400 text-base text-center font-medium font-['Urbanist'] max-w-[560px] pt-8">
              Sign a message with your connected wallet to derive a secure
              private key from our MPC network, built together with
              PartisiaBlockchain.{' '}
              <a
                href="https://www.idos.network/blog/key-abstracted-self-sovereign-identity-idos-and-partisia-blockchain-mpc-tech-are-making-it-possible"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aquamarine-600 underline text-base text-center font-semibold font-['Urbanist']"
              >
                Learn more
              </a>
            </span>
          </div>
          <div className="flex justify-center">
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
          <div className="flex justify-center"></div>
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

// Verify your identity
function StepThree({ onNext }: { onNext: () => void }) {
  const { state, setState } = useStepState();
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const walletType = (wallet && wallet.type) || '';

  const currentUser = getCurrentUserFromLocalStorage();
  const userId = currentUser?.id || '';
  const userAddress = currentUser?.mainAddress || '';
  const userEncryptionPublicKey = currentUser?.userEncryptionPublicKey || '';
  const ownershipProofSignature = currentUser?.ownershipProofSignature || '';
  const publicKey = currentUser?.publicKey || '';

  useEffect(() => {
    if (state === 'verified') {
      updateUserStateInLocalStorage(userAddress, { humanVerified: true });
      const handleProfile = async () => {
        setState('creating');
        const response = await handleCreateIdOSProfile(
          userId,
          userEncryptionPublicKey,
          userAddress,
          env.VITE_OWNERSHIP_PROOF_MESSAGE,
          ownershipProofSignature,
          publicKey,
          walletType,
        );
        if (!response) {
          updateUserStateInLocalStorage(userAddress, { humanVerified: false });
          setState('idle');
        } else {
          onNext();
        }
      };
      handleProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state,
    onNext,
    userAddress,
    userId,
    userEncryptionPublicKey,
    ownershipProofSignature,
    publicKey,
    walletType,
  ]);

  // Auto-advance after 3 seconds when verifying
  useEffect(() => {
    if (state === 'verifying') {
      const timer = setTimeout(() => {
        setState('verified');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state, setState]);

  function handleProofOfHumanity() {
    setState('verifying');
  }

  return (
    <div className="flex flex-col gap-14 h-[600px] w-[700px]">
      <TopBar activeStep="step-three" />
      <div className="flex flex-col flex-1 justify-between">
        {state !== 'verifying' && (
          <>
            <div className="flex flex-col gap-14">
              <TextBlock
                title="Verify you are a human"
                subtitle="In a moment, we'll ask you to follow some instructions for a liveness check. This will let us know that this is you, without exposing your identity."
              />
              <div className="w-full h-full flex flex-row gap-5 min-h-[120px]">
                <StepperCards
                  icon={<FrameIcon color="var(--color-aquamarine-400)" />}
                  description="Pictures of your face and personal data stays encrypted and is never shared without your consent."
                />
                <StepperCards
                  icon={
                    <PersonIcon
                      color="var(--color-aquamarine-400)"
                      width="36"
                      height="36"
                    />
                  }
                  description="Once verified, your Proof of Personhood credential can be reused across other supported platforms."
                />
              </div>
            </div>
          </>
        )}
        {state === 'idle' && (
          <div className="flex justify-center mt-auto">
            <StepperButton onClick={handleProofOfHumanity}>
              Verify you are human
            </StepperButton>
          </div>
        )}
      </div>
      {state === 'verifying' && (
        <div className="flex flex-col gap-14 flex-1">
          <TextBlock
            title="Verify you are a human"
            subtitle="Please follow the instructions to complete your biometric enrollment."
          />
          <div className="flex justify-center flex-1 items-center">
            <Spinner />
          </div>
          <div className="flex justify-center">
            <StepperButton disabled={true}>
              Waiting for verification...
            </StepperButton>
          </div>
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

// Add a credential
function StepFour() {
  const { state, setState, loading, setLoading, error } = useStepState();
  const { withSigner } = useIdOS();
  const { showToast } = useToast();
  const { selector } = useNearWallet();
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;

  useEffect(() => {
    if (state === 'created') {
      window.location.href = '/';
    } else if (error) {
      setState('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, error]);

  async function handleAddCredential() {
    const withSignerLoggedIn = await withSigner.logIn();
    try {
      setState('creating');
      const idOSDWG: IdosDWG = await handleDWGCredential(
        setState,
        setLoading,
        withSignerLoggedIn,
        wallet,
        wallet && wallet.type === 'near' ? await selector.wallet() : undefined,
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
        clearUserDataFromLocalStorage();
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
    <div className="flex flex-col gap-14 h-[600px] w-[700px]">
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
              description="idOS Credentials are like digital documents that you control. The content of your idOS credentials is encrypted, and you are the only one that can see it, unless you grant access to others."
            />
            <StepperCards
              icon={<GraphIcon color="var(--color-aquamarine-400)" />}
              description="You may add multiple credentials from different issuers and of different types in your idOS profile. You choose which credentials to add, share and with whom you share them - with idOS you own and control your data."
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
            {error && <div className="text-red-500">Error</div>}
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
  const hasProfile = useIdOSLoginStatus();
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;

  const steps = [
    { id: 'step-one', component: StepOne },
    { id: 'step-two', component: StepTwo },
    { id: 'step-three', component: StepThree },
    { id: 'step-four', component: StepFour },
  ];

  useEffect(() => {
    if (isLoading) return;

    const currentUser = getCurrentUserFromLocalStorage();

    if (currentUser) {
      if (
        currentUser.mainAddress !== (wallet && wallet.address) &&
        !hasProfile
      ) {
        clearUserDataFromLocalStorage();
        setActiveStep('step-one');
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
  }, [credentials, isLoading, hasProfile, wallet]);

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
    <div className="w-[900px] h-[720px] rounded-[40px] bg-neutral-950 flex flex-col items-center gap-24">
      {getCurrentStepComponent()}
    </div>
  );
}
