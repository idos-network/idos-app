import CopyIcon from '@/components/icons/copy';
import NeobankLogoIcon from '@/components/icons/neobank-logo';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import { ArrowDownLeftIcon } from 'lucide-react';
import { useState } from 'react';

export function ReceiveTokenDialog() {
  const [isCopied, setIsCopied] = useState(false);
  const { connectedWallet } = useWalletConnector();
  const recipient = connectedWallet?.address;
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>
            <ArrowDownLeftIcon className="size-5" /> Receive
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-none">
          <DialogHeader>
            <DialogTitle>
              <NeobankLogoIcon />
            </DialogTitle>
            <DialogDescription className="text-white text-2xl font-medium mt-5">
              Receive Tokens
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <Label className="font-medium text-muted">
              Your wallet address
            </Label>
            <div className="flex py-4 px-6 w-full rounded-xl border-0 bg-[#26262699] text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0">
              {recipient}
            </div>
          </div>
          <DialogFooter>
            <Button
              className=" text-neutral-50 h-12 w-full rounded-lg bg-[#404040B2] flex items-center gap-2 mt-3"
              onClick={() => {
                navigator.clipboard.writeText(recipient || '');
                setIsCopied(true);
                setTimeout(() => {
                  setIsCopied(false);
                }, 2000);
              }}
            >
              <CopyIcon color="#FFFFFF" />
              {isCopied ? 'Copied' : 'Copy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
