import OnboardingStepper, {
  useHasStakingCredential,
} from '@/components/onboarding/OnboardingStepper';
import { CredentialsCard, WalletsCard } from '@/components/profile';
import Spinner from '@/components/Spinner';
import { useToast } from '@/hooks/useToast';
import { useUserMainEvm } from '@/hooks/useUserMainEvm';

export function IdosProfile() {
  const { refetch: refetchMainEvm } = useUserMainEvm();
  const { showToast } = useToast();
  const { data: stakingCreds, isLoading: stakingCredsLoading } =
    useHasStakingCredential();
  const hasStakingCredential =
    Array.isArray(stakingCreds) && !!stakingCreds?.length;

  const newLoading = stakingCredsLoading;

  if (newLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center h-screen -translate-y-20">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex items-start justify-center">
      {hasStakingCredential ? (
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
            {/* <FaceSignBanner /> */}
            <WalletsCard refetchMainEvm={refetchMainEvm} />
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
