import ActionToolbar from '../components/ActionToolbar';
import FaceSignBanner from '../components/FaceSignBanner';
import PerformanceChart from '../components/PerformanceChart';
import TransactionHistory from '../components/TransactionHistory';
import UserBalance from '../components/UserBalance';

export const LandingCoreUI = () => (
  <>
    <div className="flex justify-between items-center mt-10 md:px-20">
      <UserBalance />
      <ActionToolbar />
    </div>

    <div className="flex justify-between mt-10 md:px-20 gap-5">
      <TransactionHistory />
      <PerformanceChart />
    </div>
  </>
);

export default function Landing() {
  return (
    <>
      <div className="flex flex-col gap-10">
        <FaceSignBanner />
      </div>
      <LandingCoreUI />
    </>
  );
}
