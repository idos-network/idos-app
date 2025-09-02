import { getUserById, saveUser, updateUser } from '@/api/user';
import { useIdOSLoggedIn } from '@/context/idos-context';
import { useToast } from '@/hooks/useToast';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import AirdropIcon from '@/icons/airdrop';
import WalletIcon from '@/icons/wallet';
import { useReferralCode } from '@/providers/quests/referral-provider';
import { queryClient } from '@/providers/tanstack-query/query-client';
import { useEffect, useState } from 'react';
import EVMWalletAdd from '../components/EVMWalletAdd';
import StepperButton from '../components/StepperButton';
import StepperCards from '../components/StepperCards';
import TextBlock from '../components/TextBlock';
import TopBar from '../components/TopBar';
import { useStepState } from './useStepState';

export default function AddEVMWallet() {
  const { state, setState, error } = useStepState();
  const { showToast } = useToast();
  const idOSLoggedIn = useIdOSLoggedIn();
  const { referralCode } = useReferralCode();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const walletConnector = useWalletConnector();
  const wallet = walletConnector.isConnected && walletConnector.connectedWallet;

  useEffect(() => {
    const saveUserAndCompleteQuest = async () => {
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
      queryClient.invalidateQueries({ queryKey: ['has-staking-credentials'] });
    };
    if (error) {
      setState('idle');
    }
    saveUserAndCompleteQuest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, error]);

  return (
    <div className="flex flex-col gap-10 h-[600px] w-[740px]">
      {state !== 'created' && (
        <>
          <TopBar activeStep="step-five" />
          <TextBlock
            title="Set up your primary wallet"
            subtitle="This is required to participate in airdrops"
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
