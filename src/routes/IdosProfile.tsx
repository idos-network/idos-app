import OnboardingStepper from '@/components/onboarding/OnboardingStepper';
import { CredentialsCard, WalletsCard } from '@/components/profile';
import Spinner from '@/components/Spinner';
import { useIdOS, useIdOSLoggedIn } from '@/context/idos-context';
import { env } from '@/env';
import { useSpecificCredential } from '@/hooks/useCredentials';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';
import { useProfileQuestCompleted } from '@/hooks/useProfileQuestCompleted';
import { useToast } from '@/hooks/useToast';
import { useUserMainEvm } from '@/hooks/useUserMainEvm';
import { useReferralCode } from '@/providers/quests/referral-provider';
import { getQuestByName } from '@/utils/quests';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

export function IdosProfile() {
  const [isMounted, setIsMounted] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const { isLoading: idosLoading } = useIdOS();
  const hasProfile = useIdOSLoginStatus();
  const { isCompleted: profileQuestCompleted, isLoading: profileQuestLoading } =
    useProfileQuestCompleted();
  const { hasCredential: hasStakingCredential, isLoading } =
    useSpecificCredential(env.VITE_ISSUER_SIGNING_PUBLIC_KEY);
  const {
    mainEvm,
    isLoading: mainEvmLoading,
    refetch: refetchMainEvm,
  } = useUserMainEvm();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const idOSLoggedIn = useIdOSLoggedIn();
  const { referralCode, clearReferralCode } = useReferralCode();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const isStillLoading =
    idosLoading || profileQuestLoading || isLoading || mainEvmLoading;

  const shouldShowProfile =
    isMounted &&
    profileQuestCompleted &&
    hasProfile &&
    !isStillLoading &&
    hasStakingCredential &&
    !!mainEvm;

  const shouldShowLoading = !isMounted || isStillLoading;

  const handleOnboardingComplete = useCallback(() => {
    setOnboardingCompleted(true);

    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.invalidateQueries({ queryKey: ['userPoints'] });
    refetchMainEvm();

    setIsMounted(false);
    setTimeout(() => {
      setIsMounted(true);
    }, 1000);

    const completeToastData = localStorage.getItem('showCompleteToast');

    if (completeToastData && idOSLoggedIn) {
      try {
        const { type: completeType, message: completeMessage } =
          JSON.parse(completeToastData);
        const rewardPoints = getQuestByName(
          'create_idos_profile',
        )?.pointsReward;
        setTimeout(() => {
          showToast({ type: completeType, message: completeMessage });
        }, 2000);
        setTimeout(() => {
          showToast({
            type: 'quest',
            message: 'You earned',
            points: rewardPoints || 0,
            icon: false,
          });
        }, 3000);
      } catch (e) {
        // ignore parse errors
      }
      localStorage.removeItem('showCompleteToast');
      if (referralCode) {
        clearReferralCode();
      }
    }
  }, [
    queryClient,
    refetchMainEvm,
    idOSLoggedIn,
    showToast,
    referralCode,
    clearReferralCode,
  ]);

  return (
    <div className="flex items-start justify-center">
      {shouldShowProfile || onboardingCompleted ? (
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
      ) : shouldShowLoading ? (
        <div className="container mx-auto flex justify-center items-center h-screen -translate-y-20">
          <Spinner />
        </div>
      ) : (
        <div className="container mx-auto flex justify-center pt-10">
          <OnboardingStepper onComplete={handleOnboardingComplete} />
        </div>
      )}
    </div>
  );
}
