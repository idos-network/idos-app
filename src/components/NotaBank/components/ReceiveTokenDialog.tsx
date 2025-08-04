import { ReceiveIcon } from '@/components/icons';
import CopyIcon from '@/components/icons/copy';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import NeobankLogoIcon from '@/components/icons/neobank-logo';

export function ReceiveTokenDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            className={`flex items-center gap-2 px-6! py-3 h-[45px] rounded-2xl font-medium text-sm transition-all duration-200 hover:scale-105 bg-neutral-100 text-black hover:bg-neutral-500`}
          >
            <ReceiveIcon /> Receive{' '}
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
            <Label className="font-medium text-muted text-neutral-400">
              Your wallet address
            </Label>
            <Input
              type="text"
              placeholder="0x89421209823492i3u4902u30"
              value={''}
              onChange={() => {}}
              className="h-16 border-0 bg-[#26262699] pr-40 pl-6 font-medium text-white text-xl placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className=" text-white h-12 w-full rounded-lg bg-[#404040B2] flex items-center gap-2 mt-3">
                <CopyIcon color="#FFFFFF" />
                Copy
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
