import ActionToolbar from '../components/ActionToolbar';
import FaceSignBanner from '../components/FaceSignBanner';
import PerformanceChart from '../components/PerformanceChart';
import TransactionHistory from '../components/TransactionHistory';
import UserBalance from '../components/UserBalance';

export const LandingCoreUI = () => (
  <>
    <div className="flex flex-col justify-center w-full max-w-4xl mx-auto gap-10">
      <FaceSignBanner />
      <div className="flex justify-between items-center w-full h-[60px] gap-5">
        <UserBalance />
        <ActionToolbar />
      </div>
    </div>

    <div className="flex justify-between mt-10 gap-5 max-w-4xl mx-auto">
      <TransactionHistory />
      <PerformanceChart />
    </div>
  </>
);

export default function Landing() {
  return <LandingCoreUI />;
}
