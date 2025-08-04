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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

export default function CardReadyDialog() {
  const [deliveryOption, setDeliveryOption] = useState('file-address');
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="flex-1 max-w-[150px] bg-[#404040B2] hover:bg-gray-700 text-white border-0 py-2.5  font-medium"
        >
          Disagree
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[366px] bg-[#1A1A1A] border-none">
        <DialogHeader>
          <DialogTitle>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-light mb-3">
                Your NotACard is ready!
              </h1>
              <p className="text-gray-400 text-base">
                Choose where you'd like to receive it.
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {/* Card Preview */}
          <div className="bg-white rounded-2xl p-6 mb-8 text-black">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">NeoBankCard</h2>
            </div>

            <div className="flex items-center gap-4 mb-8">
              {/* Chip */}
              <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center">
                <div className="w-8 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm"></div>
              </div>

              {/* Contactless Symbol */}
              <div className="flex">
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full -ml-3"></div>
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full -ml-3"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-lg font-medium">Jon Doe</div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-mono">•••• •••• •••• 4378</div>
                <div className="text-sm text-gray-600">by AcmeCard</div>
              </div>
            </div>
          </div>
          {/* Delivery Options */}
          <RadioGroup
            value={deliveryOption}
            onValueChange={setDeliveryOption}
            className=""
          >
            <div className="flex items-center  p-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors">
              <Label
                htmlFor="file-address"
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                <img src="/home.svg" alt="home" className="w-5 h-5" />
                Send to file address
              </Label>
              <RadioGroupItem
                value="file-address"
                id="file-address"
                className="bg-neutral-800 border-neutral-700 text-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
            </div>

            <div className="flex items-center  p-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors">
              <Label
                htmlFor="another-address"
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                <img src="/location.svg" alt="location" className="w-5 h-5" />
                Send to another address
              </Label>
              <RadioGroupItem
                value="another-address"
                id="another-address"
                className="bg-neutral-800 border-neutral-700 text-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
            </div>
          </RadioGroup>
        </DialogDescription>
        <DialogFooter className="flex flex-col! gap-4">
          <DialogClose asChild>
            <Button className="w-full rounded-lg bg-[#74FB5B] text-neutral-950 mt-4">
              Continue
            </Button>
          </DialogClose>
          <p className="text-xs text-[#F5F5F5] text-center mt-4">
            This information will only be stored in your encrypted Neobank
            account powered by{' '}
            <img
              src="/idos.svg"
              alt="idos"
              className="w-5 h-5 inline align-text-bottom"
            />{' '}
            <span className="text-sm font-body mx-1">idOS</span>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
