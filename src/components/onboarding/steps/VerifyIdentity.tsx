import { saveUser } from '@/api/user';
import FaceSignSetupDialog from '@/components/NotaBank/components/FaceSignSetupDialog';
import Spinner from '@/components/Spinner';
import { useIdOS } from '@/context/idos-context';
import { env } from '@/env';
import { handleCreateIdOSProfile } from '@/handlers/idos-profile';
import { handleSaveUserWallets } from '@/handlers/user-wallets';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import FrameIcon from '@/icons/frame';
import PersonIcon from '@/icons/person';
import type { IdosWallet } from '@/interfaces/idos-profile';
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
import { useAuth } from '@/hooks/useAuth';
import { useWalletIdentifier } from '../OnboardingStepper';

const useLogin = () => {
  const { idOSClient, setIdOSClient } = useIdOS();

  return useMutation({
    mutationKey: ['login'],
    mutationFn: async () => {
      if (idOSClient && idOSClient.state === 'with-user-signer') {
        let loggedIn = null;
        while (!loggedIn) {
          try {
            loggedIn = await idOSClient.logIn();
          } catch (error) {
            continue;
          }
        }
        if (loggedIn) {
          setIdOSClient(loggedIn);
          const userWallets = await loggedIn.getWallets();
          const walletsArray = userWallets as IdosWallet[];
          handleSaveUserWallets(loggedIn.user.id, walletsArray);
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
  const { mutateAsync: login } = useLogin();
  const [faceSignInProgress, setFaceSignInProgress] = useState(false);
  const { idOSClient } = useIdOS();
  const { authenticate } = useAuth();

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
  const isLogged = idOSClient?.state === 'logged-in';
  const { data: walletIdentifier } = useWalletIdentifier();

  const handleFaceSignSuccess = useCallback(async () => {
    // in case user already have a profile (cleared db or having profile from another platform) just check if faceSignUserId exists again
    if (isLogged) {
      queryClient.invalidateQueries({ queryKey: ['hasFaceSign', userId] });
      return;
    }
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

      let authenticated = false;
      while (!authenticated) {
        authenticated = await authenticate();
      }

      await saveUser({
        id: userId,
        mainEvm: walletType === 'evm' ? userAddress : '',
        referrerCode: '',
      });
      queryClient.invalidateQueries({ queryKey: ['hasFaceSign', userId] });
      queryClient.invalidateQueries({
        queryKey: ['has-staking-credentials', walletIdentifier],
      });
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
    isLogged,
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
                      In a moment, we’ll ask you to follow some instructions for
                      a privacy-preserving proof of personhood and uniqueness
                      check using idOS FaceSign. This will prove your wallet is
                      controlled by a unique human.
                    </>
                  }
                />
                <div className="w-full h-full flex flex-row gap-5 min-h-[120px]">
                  <StepperCards
                    icon={<FrameIcon color="var(--color-aquamarine-400)" />}
                    description={
                      <>
                        All biometric data is solely processed in a secure
                        enclave and idOS or other third parties have no access
                        to it (unless you grant it) as described in more details
                        here in the{' '}
                        <a
                          href="https://www.idos.network/legal/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-aquamarine-400 underline text-sm"
                        >
                          Privacy Policy
                        </a>
                      </>
                    }
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
                <span className="text-neutral-400 block mb-2 w-[860px] text-base text-center font-normal font-['Urbanist']">
                  Learn more about idOS FaceSign{' '}
                  <a
                    href="https://docs.idos.network/how-it-works/biometrics-and-idos-facesign-beta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-aquamarine-400 underline"
                  >
                    here
                  </a>
                  .
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
          onDone={(success) => {
            setFaceSignInProgress(false);
            if (success) {
              handleFaceSignSuccess();
            }
          }}
        />
      )}
    </div>
  );
}
