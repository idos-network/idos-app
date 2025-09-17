import { saveUser } from '@/api/user';
import FaceSignSetupDialog from '@/components/NotaBank/components/FaceSignSetupDialog';
import Spinner from '@/components/Spinner';
import { useIdOS } from '@/context/idos-context';
import { env } from '@/env';
import { handleCreateIdOSProfile } from '@/handlers/idos-profile';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import FrameIcon from '@/icons/frame';
import PersonIcon from '@/icons/person';
import { queryClient } from '@/providers/tanstack-query/query-client';
import {
  getCurrentUserFromLocalStorage,
  updateUserStateInLocalStorage,
} from '@/storage/idos-profile';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import StepperButton from '../components/StepperButton';
import StepperCards from '../components/StepperCards';
import TextBlock from '../components/TextBlock';
import TopBar from '../components/TopBar';
import { useStepState } from './useStepState';

const useLogin = () => {
  const { idOSClient, setIdOSClient } = useIdOS();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async () => {
      if (idOSClient && idOSClient.state === 'with-user-signer') {
        const loggedIn = await idOSClient.logIn();
        if (loggedIn) {
          setIdOSClient(loggedIn);
        }
      }
      return Promise.resolve(undefined);
    },
  });
};

export default function VerifyIdentity() {
  const { state, setState } = useStepState();
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const walletType = (wallet && wallet.type) || '';
  const { mutate: login } = useLogin();
  const [faceSignInProgress, setFaceSignInProgress] = useState(false);
  const { idOSClient } = useIdOS();

  const currentUser = getCurrentUserFromLocalStorage();
  const userId =
    idOSClient?.state === 'logged-in'
      ? idOSClient?.user.id
      : currentUser?.id || '';
  const userAddress = currentUser?.mainAddress || '';
  const userEncryptionPublicKey = currentUser?.userEncryptionPublicKey || '';
  const ownershipProofSignature = currentUser?.ownershipProofSignature || '';
  const publicKey = currentUser?.publicKey || '';
  const encryptionPasswordStore =
    currentUser?.encryptionPasswordStore || 'user';

  const handleFaceSignSuccess = useCallback(async () => {
    updateUserStateInLocalStorage(userAddress, { humanVerified: true });
    setState('creating');
    const response = await handleCreateIdOSProfile(
      userId,
      userEncryptionPublicKey,
      userAddress,
      env.VITE_OWNERSHIP_PROOF_MESSAGE,
      ownershipProofSignature,
      publicKey,
      walletType,
      encryptionPasswordStore,
    );
    if (!response) {
      updateUserStateInLocalStorage(userAddress, { humanVerified: false });
      setState('idle');
    } else {
      await login();
      await saveUser({
        id: userId,
        mainEvm: walletType === 'evm' ? userAddress : '',
        referrerCode: '',
        faceSignHash: '',
        faceSignUserId: null,
        faceSignTokenCreatedAt: null,
      });
      queryClient.invalidateQueries({ queryKey: ['hasFaceSign', userId] });
    }
  }, [
    userId,
    userAddress,
    userEncryptionPublicKey,
    ownershipProofSignature,
    publicKey,
    walletType,
    encryptionPasswordStore,
    login,
    saveUser,
    setState,
    updateUserStateInLocalStorage,
    handleCreateIdOSProfile,
  ]);

  return (
    <div className="flex flex-col gap-10 h-[600px] w-[740px]">
      <TopBar activeStep="step-three" />
      <div className="flex flex-col flex-1 justify-between">
        {state !== 'verifying' &&
          state !== 'creating' &&
          state !== 'verified' && (
            <>
              <div className="flex flex-col gap-8 w-full items-center">
                <TextBlock
                  title="Verify you are a human"
                  subtitle={
                    <>
                      In a moment, we'll ask you to follow some instructions for
                      a liveness check.
                      <br />
                      This will let us know that this is you, without exposing
                      your identity.
                    </>
                  }
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
                <span className="text-neutral-400 w-[860px] text-base text-center font-normal font-['Urbanist']">
                  For privacy, idOS allows{' '}
                  <span className="text-aquamarine-400">
                    multiple profiles system-wide
                  </span>{' '}
                  but lets users prove uniqueness when needed. <br />{' '}
                  <span className="text-aquamarine-400">This app </span>{' '}
                  prevents quest farming and sybil attacks by limiting each
                  human to one idOS profile.
                </span>
              </div>
            </>
          )}
        {state === 'idle' && (
          <div className="flex justify-center mt-auto">
            <StepperButton
              onClick={() => {
                setFaceSignInProgress(true);
              }}
            >
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
      {faceSignInProgress && (
        <FaceSignSetupDialog
          userId={userId}
          onDone={() => {
            setFaceSignInProgress(false);
            handleFaceSignSuccess();
          }}
        />
      )}
    </div>
  );
}
