import LogoutIcon from '@/components/icons/logout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useIdOS } from '@/context/idos-context';
import { CopyIcon } from 'lucide-react';
import { useState } from 'react';
import { formatEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import DeactiviateFaceSignDialog from './DeactiviateFaceSignDialog';
import FaceSignTag from './FaceSignTag';
import AppTag from './Tag';

export default function FaceSignInfoDialog() {
  const [isDeactivating, setIsDeactivating] = useState(false);
  const { address } = useAccount();
  const { idOSClient } = useIdOS();
  // get eth balance
  const { data: balance } = useBalance({
    address,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FaceSignTag />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-none">
        <DialogHeader>
          <DialogTitle className="flex justify-center mt-9">
            <img src="/idos-face-sign-logo.svg" alt="Face Sign" />
          </DialogTitle>
        </DialogHeader>
        <div className="mt-12">
          <div className="flex flex-col justify-center items-center gap-3">
            {isDeactivating ? (
              <DeactiviateFaceSignDialog
                onCancel={() => setIsDeactivating(false)}
                onDeactivate={() => {
                  console.log('deactivate ');
                }}
              />
            ) : (
              <>
                {/* FaceSign Logo */}
                <img
                  src="/idos-face-sign-raw.svg"
                  alt="Face Sign"
                  className="max-w-[136px]"
                />
                {/* Address and ETH balance */}
                <div className="flex flex-col items-center text-center mb-1">
                  <p className="text-neutral-50 text-xl mt-3 max-w-[270px]">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                  <p className="text-neutral-400 text-sm mt-1 max-w-[270px]">
                    {formatEther(balance?.value || 0n)} ETH
                  </p>
                </div>
                {/* Verification Status */}
                <div className="flex flex-col items-center text-center mb-3">
                  {(idOSClient.state === 'logged-in' && (
                    <AppTag variant="success">
                      <span className="text-sm">Verified</span>
                    </AppTag>
                  )) || (
                    <AppTag variant="pending">
                      <span className="text-sm">Not Verified</span>
                    </AppTag>
                  )}
                </div>

                {/* Divider*/}
                <div className="w-full h-[1px] bg-neutral-800"></div>

                {/* FaceSign Description */}
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-neutral-400 text-sm text-left">
                    Enable and disable your idOS FaceSign, to manage your
                    biometric authentication.
                  </h3>
                </div>

                {/* FaceSign Toggle as primary wallet */}
                <div className="flex items-center justify-between text-center w-full">
                  <Label htmlFor="primary-wallet">
                    Set has primary EVM wallet
                  </Label>
                  <Switch
                    id="primary-wallet"
                    className="data-[state=checked]:bg-aquamarine-400 data-[state=unchecked]:bg-aquamarine-400/30 h-8 w-14 rounded-full [&>span]:size-6 [&>span]:data-[state=checked]:translate-x-[1.5rem] [&>span]:data-[state=unchecked]:translate-x-1"
                  />
                </div>
                {/* Copy and deactivite actions*/}
                <div className="flex gap-3 w-full mt-2">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white"
                  >
                    <CopyIcon className="w-5 h-5" />
                    Copy Address
                  </Button>
                  <Button
                    onClick={() => setIsDeactivating(true)}
                    variant="secondary"
                    size="lg"
                    className="flex-1 bg-neutral-700 hover:bg-red-600 text-red-400 hover:text-white"
                  >
                    <LogoutIcon className="w-5 h-5" />
                    Deactivate
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
