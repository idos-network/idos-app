import { updateUser } from '@/api/user';
import { handleOpenWalletPopup } from '@/components/profile/wallets/WalletAdder';
import { useUserWallets } from '@/components/profile/wallets/WalletsCard';
import { useIdOSLoggedIn } from '@/context/idos-context';
import AirdropIcon from '@/icons/airdrop';
import WalletIcon from '@/icons/wallet';
import { useReferralCode } from '@/providers/quests/referral-provider';
import { queryClient } from '@/providers/tanstack-query/query-client';
import { useIdosStore } from '@/stores/idosStore';
import { useEffect } from 'react';
import StepperButton from '../components/StepperButton';
import StepperCards from '../components/StepperCards';
import TextBlock from '../components/TextBlock';
import TopBar from '../components/TopBar';
import { useStepState } from './useStepState';

export default function AddEVMWallet() {
  const { state } = useStepState();
  const idOSLoggedIn = useIdOSLoggedIn();
  const { referralCode } = useReferralCode();
  const { addingWallet } = useIdosStore();
  const { data: wallets = [] } = useUserWallets();
  const hasEvmWallet = wallets.find((wallet) => wallet.wallet_type === 'EVM');
  console.log('RENDER ADD EVM WALLET', state);

  useEffect(() => {
    if (hasEvmWallet) {
      updateUser({
        id: idOSLoggedIn!.user.id,
        mainEvm: hasEvmWallet?.address,
        referrerCode: referralCode || '',
      });
      queryClient.invalidateQueries({ queryKey: ['has-staking-credentials'] });
    }
  }, [hasEvmWallet]);

  return (
    <div className="flex flex-col gap-10 h-[600px] w-[740px]">
      {state !== 'created' && (
        <>
          <TopBar activeStep="step-five" />
          <TextBlock
            title="Set up your primary wallet"
            subtitle="This is required to receive token allocations*"
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
            <StepperButton
              onClick={handleOpenWalletPopup}
              disabled={addingWallet}
            >
              {addingWallet ? 'Waiting for wallet...' : 'Add EVM wallet'}
            </StepperButton>
          </div>
        </div>
      )}
    </div>
  );
}
