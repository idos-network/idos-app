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
import { ArrowDownLeftIcon } from 'lucide-react';

export default function SelectCryptoDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>
            <ArrowDownLeftIcon className="size-5" /> Select Crypto
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-none">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription className="text-white text-2xl font-medium mt-5">
              Receive Tokens
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <Label className="font-medium text-muted">
              Your wallet address
            </Label>
            <div className="flex py-4 px-6 w-full rounded-xl border-0 bg-[#26262699] text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0"></div>
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
