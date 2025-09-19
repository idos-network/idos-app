import PointsFrame from '@/components/points/PointsFrame';
import QuestsCard from '@/components/points/QuestsCard';
import ReferralCard from '@/components/points/ReferralCard';
import Spinner from '@/components/Spinner';
import { useProfileQuestCompleted } from '@/hooks/useProfileQuestCompleted';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

const PointsDisclaimer = () => (
  <div className="text-xs text-neutral-400 text-center mt-7">
    Points have no monetary value, cannot be traded or exchanged, confer no
    rights, and are only issued for social reputation building, linked to
    reusing credentials and interaction with the App. The program may change
    and/or be discontinued. You are not eligible if, in the jurisdiction of your
    nationality or residence, such a program would be illegal.{' '}
    <a
      href="https://www.idos.network/legal/user-agreement"
      target="_blank"
      rel="noopener noreferrer"
      className="text-aquamarine-600 underline"
    >
      Terms apply
    </a>
  </div>
);

export function Points() {
  const { isCompleted: profileQuestCompleted, isLoading } =
    useProfileQuestCompleted();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !profileQuestCompleted) {
      navigate({ to: '/idos-profile', replace: true });
    }
  }, [profileQuestCompleted, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center">
      <div className="container mx-auto max-w-[1250px] flex flex-col px-32 pt-10">
        <div className="gap-3 flex flex-col mb-10">
          <div className="text-2xl font-medium text-neutral-50">
            idOS Points*
          </div>
          <p className="text-neutral-400 text-base font-normal font-['Inter']">
            Global overview of your idOS Points.{' '}
          </p>
        </div>
        <div className="flex gap-5 justify-between">
          <PointsFrame />
        </div>

        <div className="flex flex-col gap-6 justify-between">
          <div className="flex gap-5 font-medium text-xl text-neutral-50 justify-between mt-10">
            Complete quests and refer your friens to get Quest Points
          </div>
          <div className="flex gap-5">
            <QuestsCard />
            <ReferralCard />
          </div>
        </div>
        <PointsDisclaimer />
      </div>
    </div>
  );
}
