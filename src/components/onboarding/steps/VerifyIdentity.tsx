import { useIdOS } from '@/context/idos-context';
import { env } from '@/env';
import { handleCreateIdOSProfile } from '@/handlers/idos-profile';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import FrameIcon from '@/icons/frame';
import PersonIcon from '@/icons/person';
import {
  getCurrentUserFromLocalStorage,
  updateUserStateInLocalStorage,
} from '@/storage/idos-profile';
import { useEffect } from 'react';
import Spinner from '../components/Spinner';
import StepperButton from '../components/StepperButton';
import StepperCards from '../components/StepperCards';
import TextBlock from '../components/TextBlock';
import TopBar from '../components/TopBar';
import { useStepState } from './useStepState';

interface VerifyIdentityProps {
  onNext: () => void;
}

export default function VerifyIdentity({ onNext }: VerifyIdentityProps) {
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
