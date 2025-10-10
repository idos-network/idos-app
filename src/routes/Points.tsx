import PointsDisclaimer from '@/components/points/PointsDisclaimer';
import PointsFrame from '@/components/points/PointsFrame';
import QuestsCard from '@/components/points/QuestsCard';
import ReferralCard from '@/components/points/ReferralCard';
import Spinner from '@/components/Spinner';
import { useProfileQuestCompleted } from '@/hooks/useProfileQuestCompleted';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import XCard from '@/components/points/XCard';
import { useUserXHandle } from '@/hooks/useUserXHandle';
import MindshareCard from '@/components/points/MindshareCard';

export function Points() {
  const { isCompleted: profileQuestCompleted, isLoading } =
    useProfileQuestCompleted();
  const { xHandle, isLoading: xHandleLoading } = useUserXHandle();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !profileQuestCompleted) {
      navigate({ to: '/idos-profile', replace: true });
    }
  }, [profileQuestCompleted, isLoading, navigate]);

  if (isLoading || xHandleLoading) {
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
          <span className="flex font-medium text-xl text-neutral-300 mt-10">
            Complete quests and refer your friends to get{' '}
            <span className="text-[#FFA015] ml-1">Quest Points</span>
          </span>
          <div className="flex gap-5">
            <QuestsCard />
            <ReferralCard />
          </div>
        </div>

        <div className="flex flex-col gap-6 justify-between">
          <span className="flex font-medium text-xl text-neutral-300 mt-10">
            Talk about idOS on X to get{' '}
            <span className="text-[#A0F73C] ml-1">Social Points</span>
          </span>
          <div className="flex items-center gap-5">
            <XCard />
            {xHandle ? <MindshareCard /> : null}
          </div>
        </div>

        <div className="flex flex-col gap-6 justify-between">
          <span className="flex font-medium text-xl text-neutral-300 mt-10">
            Contribute to idOS events to get{' '}
            <span className="text-[#00B3FF] ml-1">Contribution Points</span>
            <div className="flex text-sm font-normal items-center px-3 rounded-xl bg-[#00FFB933] text-aquamarine-400 ml-4">
              Coming soon
            </div>
          </span>
          <div className="flex gap-5"></div>
        </div>
        <PointsDisclaimer />
      </div>
    </div>
  );
}
