import Spinner from '@/components/Spinner';
import { useIdOS } from '@/context/idos-context';
import type { ConnectedWallet } from '@/context/wallet-connector-context';
import { useHandleSaveIdOSProfile } from '@/hooks/useHandleSaveIdOSProfile';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import EncryptedIcon from '@/icons/encrypted';
import { useEffect } from 'react';
import StepperButton from '../components/StepperButton';
import TextBlock from '../components/TextBlock';
import TopBar from '../components/TopBar';
import { useStepState } from './useStepState';

interface CreatePrivateKeyProps {
  onNext: () => void;
}

export default function CreatePrivateKey({ onNext }: CreatePrivateKeyProps) {
  const { state, setState, loading, setLoading, error } = useStepState();
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;
  const { mutate: handleSaveIdOSProfile } = useHandleSaveIdOSProfile({
    onNext,
    wallet: wallet as ConnectedWallet,
    setState,
    setLoading,
  });
  const { idOSClient } = useIdOS();

  useEffect(() => {
    handleSaveIdOSProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOSClient.state === 'with-user-signer']);

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
