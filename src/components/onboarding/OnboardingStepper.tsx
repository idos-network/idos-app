import { getUserById, saveUser, updateUser } from '@/api/user';
import { useIdOS, useIdOSLoggedIn } from '@/context/idos-context';
import { env } from '@/env';
import {
  handleCreateIdOSCredential,
  handleDWGCredential,
} from '@/handlers/idos-credential';
import { handleCreateIdOSProfile } from '@/handlers/idos-profile';
import { useCompleteQuest } from '@/hooks/useCompleteQuest';
import { useSpecificCredential } from '@/hooks/useCredentials';
import { useHandleSaveIdOSProfile } from '@/hooks/useHandleSaveIdOSProfile';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';
import { useNearWallet } from '@/hooks/useNearWallet';
import { useToast } from '@/hooks/useToast';
import { useUserMainEvm } from '@/hooks/useUserMainEvm';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import AirdropIcon from '@/icons/airdrop';
import CredentialIcon from '@/icons/credential';
import EncryptedIcon from '@/icons/encrypted';
import FrameIcon from '@/icons/frame';
import GraphIcon from '@/icons/graph';
import KeyIcon from '@/icons/key';
import PersonIcon from '@/icons/person';
import WalletIcon from '@/icons/wallet';
import type { IdosDWG } from '@/interfaces/idos-credential';
import { useReferralCode } from '@/providers/quests/referral-provider';
import {
  clearUserDataFromLocalStorage,
  getCurrentUserFromLocalStorage,
  updateUserStateInLocalStorage,
} from '@/storage/idos-profile';
import { useEffect, useState } from 'react';
import { useSignMessage } from 'wagmi';
import EVMWalletAdd from './components/EVMWalletAdd';
import GetStartedTextBlock from './components/GetStartedCards';
import Spinner from './components/Spinner';
import StepperButton from './components/StepperButton';
import StepperCards from './components/StepperCards';
import TextBlock from './components/TextBlock';
import TopBar from './components/TopBar';

function useStepState(initial = 'idle') {
  const [state, setState] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { state, setState, loading, setLoading, error, setError };
}

// Get started
function StepOne({ onNext }: { onNext: () => void }) {
  const { showToast } = useToast();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (!hasShownToast) {
      setTimeout(() => {
        showToast({
          type: 'onboarding',
          message: '',
          duration: 45000,
        });
      }, 750);
      setHasShownToast(true);
    }
  }, [showToast, hasShownToast]);

  return (
    <div className="relative w-[900px] h-full rounded-[40px] bg-gradient-to-r from-[#292929] to-idos-grey1 p-[1px] overflow-hidden">
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
    <div className="flex flex-col h-[600px] w-[740px]">
      <TopBar activeStep="step-two" />
      {state !== 'created' && (
        <div className="pt-10">
          <TextBlock
            title="Create your private key"
            subtitle="idOS is a self-sovereign solution, where data is only created and shared based on user consent, and encrypted with your key pair."
          />
        </div>
      )}
      {state === 'idle' && (
        <div className="flex flex-col gap-10 pt-10">
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
  const { refresh } = useIdOS();
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
          await refresh();
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
    <div className="flex flex-col gap-10 h-[600px] w-[740px]">
      <TopBar activeStep="step-three" />
      <div className="flex flex-col flex-1 justify-between">
        {state !== 'verifying' && state !== 'creating' && (
          <>
            <div className="flex flex-col gap-8 w-full items-center">
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
              <span className="text-neutral-400 w-[860px] text-base text-center font-medium font-['Urbanist']">
                For privacy, idOS allows multiple profiles system-wide but lets
                users prove uniqueness when needed. <br /> This{' '}
                <a
                  href="https://app.idos.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aquamarine-600 underline text-base text-center font-semibold font-['Urbanist']"
                >
                  app
                </a>{' '}
                prevents quest farming and sybil attacks by limiting each human
                to one idOS profile.
              </span>
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
        {state === 'verifying' && (
          <>
            <div className="flex flex-col gap-8 w-full items-center">
              <TextBlock
                title="Verify you are a human"
                subtitle="Please follow the instructions to complete your biometric enrollment."
              />
            </div>
            <div className="flex justify-center flex-1 items-center">
              <Spinner />
            </div>
            <div className="flex justify-center">
              <StepperButton disabled={true}>
                Waiting for verification...
              </StepperButton>
            </div>
          </>
        )}
        {state === 'creating' && (
          <>
            <div className="flex flex-col gap-8 w-full items-center">
              <TextBlock
                title="Verify you are a human"
                subtitle="Please follow the instructions to complete your biometric enrollment."
              />
            </div>
            <div className="flex justify-center flex-1 items-center">
              <Spinner />
            </div>

            <div className="flex justify-center">
              <StepperButton disabled={true}>
                Creating your idOS profile...
              </StepperButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Add a credential
function StepFour({ onNext }: { onNext: () => void }) {
  const { state, setState, loading, setLoading, error } = useStepState();
  const { refresh } = useIdOS();
  const idOSLoggedIn = useIdOSLoggedIn();
  const { showToast } = useToast();
  const { selector } = useNearWallet();
  const { referralCode } = useReferralCode();
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const { signMessageAsync } = useSignMessage();
  const { completeQuest } = useCompleteQuest();

  useEffect(() => {
    const saveUserAndCompleteQuest = async () => {
      if (state === 'created' && wallet && wallet.type !== 'evm') {
        onNext();
      } else if (state === 'created' && wallet && wallet.type === 'evm') {
        // Safeguard against a user that has a profile
        // but has not been registered on the db
        const user = await getUserById(idOSLoggedIn!.user.id);
        if (user[0]) {
          updateUser({
            id: idOSLoggedIn!.user.id,
            mainEvm: wallet.address,
            referrerCode: referralCode || '',
          });
        } else {
          saveUser({
            id: idOSLoggedIn!.user.id,
            mainEvm: wallet.address,
            referrerCode: referralCode || '',
          });
        }
        localStorage.setItem(
          'showCompleteToast',
          JSON.stringify({
            type: 'success',
            message: 'Onboarding completed successfully.',
          }),
        );
        completeQuest(idOSLoggedIn!.user.id, 'create_idos_profile');
        window.location.href = '/';
      } else if (error) {
        setState('idle');
      }
      return;
    };
    saveUserAndCompleteQuest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, error, refresh]);

  async function handleAddCredential() {
    try {
      setState('creating');
      const idOSDWG: IdosDWG = await handleDWGCredential(
        setState,
        setLoading,
        idOSLoggedIn!,
        wallet,
        wallet && wallet.type === 'near' ? await selector.wallet() : undefined,
        signMessageAsync,
      );
      if (!idOSDWG) {
        setState('idle');
        return;
      }
      setState('creating');

      const response = await handleCreateIdOSCredential(
        idOSDWG,
        idOSLoggedIn!.user.recipient_encryption_public_key,
        idOSLoggedIn!.user.id,
      );

      if (response) {
        setState('created');
        clearUserDataFromLocalStorage();
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
    <div className="flex flex-col gap-10 h-[600px] w-[740px]">
      {state !== 'created' && (
        <>
          <TopBar activeStep="step-four" />
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

// Add EVM wallet to idOS profile (default primary wallet)
function StepFive() {
  const { state, setState, error } = useStepState();
  const { refresh } = useIdOS();
  const { showToast } = useToast();
  const idOSLoggedIn = useIdOSLoggedIn();
  const { referralCode } = useReferralCode();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const { completeQuest } = useCompleteQuest();

  useEffect(() => {
    const saveUserAndCompleteQuest = async () => {
      if (state === 'created') {
        // Safeguard against a user that has a profile and a credential
        // but has not been registered on the db
        const user = await getUserById(idOSLoggedIn!.user.id);
        if (user[0]) {
          updateUser({
            id: idOSLoggedIn!.user.id,
            mainEvm: walletAddress,
            referrerCode: referralCode || '',
          });
        } else {
          saveUser({
            id: idOSLoggedIn!.user.id,
            mainEvm: walletAddress,
            referrerCode: referralCode || '',
          });
        }
        localStorage.setItem(
          'showCompleteToast',
          JSON.stringify({
            type: 'success',
            message: 'Onboarding completed successfully.',
          }),
        );
        completeQuest(idOSLoggedIn!.user.id, 'create_idos_profile');
        window.location.href = '/';
      }
      if (error) {
        setState('idle');
      }
    };
    saveUserAndCompleteQuest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, error, refresh]);

  return (
    <div className="flex flex-col gap-10 h-[600px] w-[740px]">
      {state !== 'created' && (
        <>
          <TopBar activeStep="step-five" />
          <TextBlock
            title="Set up your primary EVM wallet"
            subtitle="This is required to receive airdrops and rewards."
          />
        </>
      )}
      {state === 'idle' && (
        <div className="flex flex-col gap-14 flex-1">
          <div className="w-full h-full flex flex-row gap-5">
            <StepperCards
              icon={
                <WalletIcon
                  color="var(--color-aquamarine-400)"
                  className="w-8 h-8"
                />
              }
              description="Choose a primary EVM wallet. Once you complete onboarding, you can add more wallets to your idOS profile, and update your primary wallet."
            />
            <StepperCards
              icon={<AirdropIcon color="var(--color-aquamarine-400)" />}
              description="This will be your default wallet for all token distributions."
            />
          </div>
          <div className="flex justify-center mt-auto">
            {wallet && wallet.type === 'evm' ? (
              <StepperButton
                onClick={() => {
                  if (wallet.address) setWalletAddress(wallet.address);
                  setState('created');
                }}
              >
                Add EVM wallet
              </StepperButton>
            ) : (
              <EVMWalletAdd
                onWalletAdded={(address) => {
                  if (address) setWalletAddress(address);
                  setState('created');
                }}
                onError={(err) => showToast({ type: 'error', message: err })}
                // onSuccess={(msg) => showToast({ type: 'success', message: msg })}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OnboardingStepper() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const hasProfile = useIdOSLoginStatus();
  const walletConnector = useWalletConnector();
  const { mainEvm } = useUserMainEvm();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const { hasCredential: hasStakingCredential, isLoading } =
    useSpecificCredential(env.VITE_ISSUER_SIGNING_PUBLIC_KEY);

  const steps = [
    { id: 'step-one', component: StepOne },
    { id: 'step-two', component: StepTwo },
    { id: 'step-three', component: StepThree },
    { id: 'step-four', component: StepFour },
    { id: 'step-five', component: StepFive },
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
