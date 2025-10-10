import { BuyIcon, SellIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ReceiveTokenDialog } from './ReceiveTokenDialog';
import { SendTokensDialog } from './SendTokensDialog';

export default function ActionToolbar() {
  return (
    <div className="">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link
              // to="/notabank/buy"
              to="/"
              activeProps={{
                className: 'bg-secondary!',
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-200 hover:scale-105 bg-white/90 text-black hover:bg-white"
            >
              <BuyIcon />
              <span>Buy</span>
            </Link>
          </Button>
          <Button asChild>
            <Link
              // to="/notabank/sell"
              to="/"
              activeProps={{
                className: 'bg-secondary!',
              }}
            >
              <SellIcon />
              <span>Sell</span>
            </Link>
          </Button>
          <SendTokensDialog />
          <ReceiveTokenDialog />
        </div>
      </div>
    </div>
  );
}
