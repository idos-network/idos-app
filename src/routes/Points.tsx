import PointsFrame from '@/components/points/PointsFrame';
import QuestsCard from '@/components/points/QuestsCard';
import ReferralLink from '@/components/points/ReferralLink';
// import PointsButton from '@/components/points/PointsButton';

export function Points() {
  return (
    <div className="flex items-start justify-center">
      <div className="container mx-auto max-w-[1050px] flex flex-col px-32 pt-18">
        <div className="gap-3 flex flex-col mb-10">
          {/* <PointsButton /> */}
          <div className="text-2xl font-medium text-neutral-50">
            idOS Points
          </div>
          <p className="text-neutral-400 text-base font-normal font-['Inter']">
            Global overview of your idOS Points.{' '}
          </p>
        </div>
        <div className="flex gap-5 justify-between">
          <PointsFrame />
          <ReferralLink />
        </div>
        <div className="flex gap-5 justify-between mt-10">
          <QuestsCard />
        </div>
      </div>
    </div>
  );
}
