import HeroCard from '../components/HeroCard';
import UserBalance from '../components/UserBalance';
import ActionToolbar from '../components/ActionToolbar';
import TransactionHistory from '../components/TransactionHistory';
import PerformanceChart from '../components/PerformanceChart';

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
      <div className="flex flex-wrap items-center gap-2">
        <HeroCard
          title="NotaCard"
          subtitle="Your digital bank"
          buttonText="Get Card"
          buttonLink="/notabank/notacard"
        />
        <HeroCard
          title="NotaWallet"
          subtitle="Your digital wallet"
          buttonText="Get Wallet"
          buttonLink="/"
        />
      </div>
      <LandingCoreUI />
    </>
  );
}
