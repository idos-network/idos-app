import { Button } from '@/components/ui/button';
import ActionToolbar from '../components/ActionToolbar';
import UserBalance from '../components/UserBalance';

function SellModule() {
  return (
    <div className="flex flex-col gap-5 p-6 bg-neutral-900 rounded-2xl flex-1 max-w-md border border-neutral-700/50">
      <h3 className="text-xl font-heading">Sell Tokens</h3>
      <form className="flex flex-col gap-5">
        <Button type="button" variant="secondary">
          Continue
        </Button>
      </form>
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
      <div className="mt-10 flex items-center place-content-center gap-5 w-full max-w-4xl mx-auto">
        <SellModule />
      </div>
    </div>
  );
}
