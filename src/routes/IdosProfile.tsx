import FaceSignBanner from '@/components/NotaBank/components/FaceSignBanner';
import OnboardingStepper, {
  useHasFaceSign,
  useHasStakingCredential,
  useUserId,
} from '@/components/onboarding/OnboardingStepper';
import { CredentialsCard, WalletsCard } from '@/components/profile';
import WalletAdder from '@/components/profile/wallets/WalletAdder';
import { useUserWallets } from '@/components/profile/wallets/WalletsCard';
import Spinner from '@/components/Spinner';
import { isProduction } from '@/env';
import { useToast } from '@/hooks/useToast';
import { useIdosStore } from '@/stores/idosStore';

export function IdosProfile() {
  const { showToast } = useToast();
  const { settingSigner } = useIdosStore();
  const { data: wallets = [] } = useUserWallets();
  const hasEvmWallet = wallets.find((wallet) => wallet?.wallet_type === 'EVM');
  const { data: stakingCreds, isLoading: stakingCredsLoading } =
    useHasStakingCredential();
  const { isLoading: isLoadingUserId } = useUserId();
  const hasStakingCredential =
    Array.isArray(stakingCreds) && !!stakingCreds?.length;
  const { data: hasFaceSign, isLoading: isLoadingFaceSign } = useHasFaceSign();

  const newLoading =
    stakingCredsLoading ||
    isLoadingUserId ||
    settingSigner ||
    isLoadingFaceSign;

  const showProfile = hasEvmWallet && hasStakingCredential && hasFaceSign;
  if (newLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center h-screen -translate-y-20">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex items-start justify-center">
      <WalletAdder />
      {showProfile ? (
        <div className="mx-auto flex flex-col px-32 pt-10 w-fit min-w-[1050px]">
          <div className="gap-3 flex flex-col mb-10">
            <div className="text-2xl font-medium text-neutral-50">
              idOS Profile
            </div>
            <p className="text-neutral-200 text-base font-['Inter']">
              View and manage your idOS identity and credentials
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <CredentialsCard
              onError={(err) => showToast({ type: 'error', message: err })}
              onSuccess={(msg) => showToast({ type: 'success', message: msg })}
            />
            {!isProduction && !hasFaceSign && <FaceSignBanner />}
            <WalletsCard />
          </div>
        </div>
      ) : (
        <div className="container mx-auto flex justify-center pt-10">
          <OnboardingStepper />
        </div>
      )}
    </div>
  );
}
