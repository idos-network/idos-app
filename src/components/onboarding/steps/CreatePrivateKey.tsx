import Spinner from '@/components/Spinner';
import { useIdOS } from '@/context/idos-context';
import type { ConnectedWallet } from '@/context/wallet-connector-context';
import { useHandleSaveIdOSProfile } from '@/hooks/useHandleSaveIdOSProfile';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import EncryptedIcon from '@/icons/encrypted';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useEffect } from 'react';
import StepperButton from '../components/StepperButton';
import TextBlock from '../components/TextBlock';
import TopBar from '../components/TopBar';
import { useStepState } from './useStepState';

export default function CreatePrivateKey() {
  const { state, setState, loading, error } = useStepState();
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const { nextStep } = useOnboardingStore();

  const { mutate: handleSaveIdOSProfile } = useHandleSaveIdOSProfile({
    onNext: nextStep,
    wallet: wallet as ConnectedWallet,
    setState,
  });
  const { idOSClient } = useIdOS();

  useEffect(() => {
    if (!idOSClient) return;
    if (idOSClient.state !== 'with-user-signer' || !wallet) return;
    handleSaveIdOSProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOSClient, wallet]);

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
            title="Create your idOS Private Key"
            subtitle="idOS is a self-sovereign decentralized storage network for your sensitive personal data. Data is only read from and written to your idOS Profile with your consent, and is encrypted with your idOS private key."
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
              Create an idOS Private Key and either store it with a wallet signature in our idOS TSS-MPC Native Module for key abstraction powered by Partisia Blockchain. Learn more{" "}
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
