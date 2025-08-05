import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAccount } from 'wagmi';
import AppTag from './Tag';

const trimAddress = (addr: string | undefined) => {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-5)}`;
};

export default function GrantAccessDialog() {
  const { address } = useAccount();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-[#74FB5B] hover:bg-green-600 text-black py-2.5  font-medium max-w-[150px]">
          Agree
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[366px] bg-[#1A1A1A] border-none">
        <DialogHeader>
          <DialogTitle>
            <div className="flex w-full justify-center">
              <div className="w-[56px] h-[56px] rounded-lg bg-neutral-950 flex items-center justify-center">
                <img src="/idos.svg" alt="idos" className="w-10 h-10" />
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between bg-[#26262680] border border-neutral-800 rounded-full p-2">
            <div className="px-2.5 py-1 bg-neutral-700 rounded-full">
              <span>idOS Profile</span>
            </div>
            <span className="text-neutral-400">{trimAddress(address)}</span>
            <AppTag variant="success" className="text-xs!">
              <span>Verified</span>
            </AppTag>
          </div>
          <div className="">
            <p className="text-sm text-neutral-400 text-center">
              You are already <span className="text-white">verified</span> by
              NotABank, and can choose to add your NotACard by idOS, provided by
              Kulipa. Terms and conditions may apply.
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full rounded-lg bg-[#404040B2] text-neutral-50 mt-4">
              Grant KYC Access
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
