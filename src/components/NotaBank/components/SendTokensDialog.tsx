import { SendIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import NeobankLogoIcon from '@/components/icons/neobank-logo';
import TokenWithBalanceInput from './TokenWithBalanceInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SendTokensDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            className={`flex items-center gap-2 px-6! py-3 h-[45px] rounded-2xl font-medium text-sm transition-all duration-200 hover:scale-105 bg-neutral-100 text-black hover:bg-neutral-500`}
          >
            <SendIcon /> Send{' '}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-none">
          <DialogHeader>
            <DialogTitle>
              <NeobankLogoIcon />
            </DialogTitle>
            <DialogDescription className="text-white text-2xl font-medium mt-5">
              Send Tokens
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-4 mt-4">
              <Label className="font-medium text-muted text-neutral-400">
                Recipient
              </Label>
              <Input
                type="text"
                placeholder="0x89421209823492i3u4902u30"
                value={''}
                onChange={() => {}}
                className="h-16 border-0 bg-[#26262699] pr-40 pl-6 font-medium text-white text-xl placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
            <TokenWithBalanceInput />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="h-12 w-full rounded-lg bg-[#74FB5B] text-black">
                Continue
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
