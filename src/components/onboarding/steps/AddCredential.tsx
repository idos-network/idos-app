import { getUserById, saveUser, updateUser } from '@/api/user';
import Spinner from '@/components/Spinner';
import { useIdOS, useIdOSLoggedIn } from '@/context/idos-context';
import {
  handleCreateIdOSCredential,
  handleDWGCredential,
} from '@/handlers/idos-credential';
import { useCompleteQuest } from '@/hooks/useCompleteQuest';
import { useNearWallet } from '@/hooks/useNearWallet';
import { useToast } from '@/hooks/useToast';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import CredentialIcon from '@/icons/credential';
import GraphIcon from '@/icons/graph';
import type { IdosDWG } from '@/interfaces/idos-credential';
import { useReferralCode } from '@/providers/quests/referral-provider';
import { clearUserDataFromLocalStorage } from '@/storage/idos-profile';
import { useEffect } from 'react';
import { useSignMessage } from 'wagmi';
import StepperButton from '../components/StepperButton';
import StepperCards from '../components/StepperCards';
import TextBlock from '../components/TextBlock';
import TopBar from '../components/TopBar';
import { useStepState } from './useStepState';

interface AddCredentialProps {
  onNext: () => void;
}

export default function AddCredential({ onNext }: AddCredentialProps) {
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
          <TextBlock title="Add a credential to your idOS profile" />
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
