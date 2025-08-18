import OnboardingStepper from '@/components/onboarding/OnboardingStepper';
import { CredentialsCard, WalletsCard } from '@/components/profile';
import Spinner from '@/components/Spinner';
import { useIdOS, useIdOSLoggedIn } from '@/context/idos-context';
import { env } from '@/env';
import { useCompleteQuest } from '@/hooks/useCompleteQuest';
import { useSpecificCredential } from '@/hooks/useCredentials';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';
import { useProfileQuestCompleted } from '@/hooks/useProfileQuestCompleted';
import { useToast } from '@/hooks/useToast';
import { useUserMainEvm } from '@/hooks/useUserMainEvm';
import { useReferralCode } from '@/providers/quests/referral-provider';
import { getQuestByName } from '@/utils/quests';
import { useEffect, useState } from 'react';

export function IdosProfile() {
  const [isMounted, setIsMounted] = useState(false);
  const { isLoading: idosLoading } = useIdOS();
  const hasProfile = useIdOSLoginStatus();
  console.log('hasProfile', hasProfile);
  const { isCompleted: profileQuestCompleted, isLoading: profileQuestLoading } =
    useProfileQuestCompleted();
  const { hasCredential: hasStakingCredential, isLoading } =
    useSpecificCredential(env.VITE_ISSUER_SIGNING_PUBLIC_KEY);
  const { mainEvm, isLoading: mainEvmLoading } = useUserMainEvm();
  const { showToast } = useToast();
  const idOSLoggedIn = useIdOSLoggedIn();
  const { completeQuest } = useCompleteQuest();
  const { referralCode, clearReferralCode } = useReferralCode();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const completeToastData = localStorage.getItem('showCompleteToast');
    const rewardPoints = getQuestByName('create_idos_profile')?.pointsReward;

    if (completeToastData && idOSLoggedIn) {
      try {
        const { completeType, completeMessage } = JSON.parse(completeToastData);
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
  }, [idOSLoggedIn, showToast, completeQuest, referralCode, clearReferralCode]);

  const isStillLoading =
    idosLoading || profileQuestLoading || isLoading || mainEvmLoading;

  const shouldShowProfile =
    isMounted &&
    profileQuestCompleted &&
    hasProfile &&
    !isStillLoading &&
    hasStakingCredential &&
    mainEvm;

  const shouldShowLoading = !isMounted || isStillLoading;

  return (
    <div className="flex items-start justify-center">
      {shouldShowProfile ? (
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
      ) : shouldShowLoading ? (
        <div className="container mx-auto flex justify-center items-center h-screen -translate-y-20">
          <Spinner />
        </div>
      ) : (
        <div className="container mx-auto flex justify-center pt-10">
          <OnboardingStepper />
        </div>
      )}
    </div>
  );
}
