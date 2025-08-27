import { useSellTokenStore } from '@/stores/sell-token-store';
import ActionToolbar from '../components/ActionToolbar';
import CountriesSearch from '../components/Sell/CountriesSearch';
import SellTokens from '../components/Sell/SellTokens';
import UserBalance from '../components/UserBalance';

function SellModule() {
  const { selectedCountry } = useSellTokenStore();

  return (
    <div className="flex items-center place-content-center gap-5 w-full max-w-4xl mx-auto">
      {!selectedCountry ? (
        <div className="flex flex-col gap-5 p-6 bg-neutral-900 rounded-2xl flex-1 max-w-md border border-neutral-700/50">
          <CountriesSearch />
        </div>
      ) : (
        <SellTokens />
      )}
    </div>
  );
}

export default function Sell() {
  return (
    <div className="flex flex-col justify-center w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center w-full h-[60px] gap-5">
        <UserBalance />
        <ActionToolbar />
      </div>
      <div className="mt-10">
        <SellModule />
      </div>
    </div>
  );
}
