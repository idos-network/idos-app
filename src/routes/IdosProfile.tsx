import OnboardingStepper from '@/components/onboarding/OnboardingStepper';
import { CredentialsCard, WalletsCard } from '@/components/profile';
import { useIdOSLoggedIn } from '@/context/idos-context';
import { env } from '@/env';
import { useCompleteQuest } from '@/hooks/useCompleteQuest';
import { useSpecificCredential } from '@/hooks/useCredentials';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';
import { useToast } from '@/hooks/useToast';
import { useUserMainEvm } from '@/hooks/useUserMainEvm';
import { useEffect } from 'react';

export function IdosProfile() {
  const hasProfile = useIdOSLoginStatus();
  const { hasCredential: hasStakingCredential, isLoading } =
    useSpecificCredential(env.VITE_ISSUER_SIGNING_PUBLIC_KEY);
  const { mainEvm } = useUserMainEvm();
  const { showToast } = useToast();
  const idOSLoggedIn = useIdOSLoggedIn();
  const { completeQuest } = useCompleteQuest();

  useEffect(() => {
    const toastData = localStorage.getItem('showToast');
    if (toastData && idOSLoggedIn) {
      try {
        const { type, message } = JSON.parse(toastData);
        showToast({ type, message: message });
        setTimeout(() => {
          completeQuest(idOSLoggedIn.user.id, 'create_idos_profile');
        }, 2000);
      } catch (e) {
        // ignore parse errors
      }
      localStorage.removeItem('showToast');
    }
  }, [idOSLoggedIn, showToast, completeQuest]);

  return (
    <div className="flex items-start justify-center">
      {hasProfile && !isLoading && hasStakingCredential && mainEvm ? (
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
