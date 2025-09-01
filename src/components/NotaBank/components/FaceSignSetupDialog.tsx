import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { isProduction } from '@/env';
import { AlertCircleIcon, ChevronLeftIcon } from 'lucide-react';
import { useState } from 'react';

const MobileFaceSign = () => (
  <div className="flex flex-col justify-center items-center gap-3">
    {/* QR Code - replace the placeholder with actual QR */}
    <div className="bg-white rounded-2xl w-[180px] h-[180px] mb-6 flex items-center justify-center">
      {/* Placeholder for QR code */}
      <div className="w-[160px] h-[160px] bg-black rounded-lg flex items-center justify-center">
        <span className="text-white text-xs">QR Code</span>
      </div>
    </div>
    <h3 className="text-neutral-50 text-2xl font-medium">
      Set Up idOS FaceSign
    </h3>
    <p className="text-neutral-400 text-sm max-w-[270px] text-center">
      Scan the QR code with your smartphone to continue the face scan and
      verification on your mobile.
    </p>
  </div>
);

export default function FaceSignSetupDialog() {
  if (isProduction) {
    return null;
  }

  const [isMobile, setIsMobile] = useState(false);
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setIsMobile(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-aquamarine-400 hover:bg-aquamarine-300 text-green-900 font-medium  text-base rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-green-400/25"
          size="lg"
        >
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-none">
        <DialogHeader>
          <DialogTitle className="flex justify-center mt-9">
            {isMobile && (
              <Button
                variant="underline"
                size="icon"
                className="absolute left-4 top-6 -translate-y-1/2 text-neutral-400 hover:text-white"
                onClick={() => setIsMobile(false)}
              >
                <ChevronLeftIcon className="min-h-5 min-w-5" />
              </Button>
            )}
            <img src="/idos-face-sign-logo.svg" alt="Face Sign" />
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 mt-12">
          {isMobile ? (
            <MobileFaceSign />
          ) : (
            <div className="flex flex-col justify-center items-center gap-12">
              {/* FaceSign Image */}
              <img
                src="/face-sign-creation.svg"
                alt="Face Sign"
                className="max-w-[136px]"
              />

              {/* FaceSign Description */}
              <div className="flex flex-col items-center text-center gap-3">
                <h3 className="text-neutral-50 text-2xl font-medium">
                  Set Up idOS FaceSign
                </h3>
                <p className="text-neutral-400 text-sm max-w-[270px]">
                  First, position your face in the camera frame. Then follow the
                  instructions given.
                </p>

                {/* Alerts */}
                <Alert variant="success" className="mt-3 text-left">
                  <AlertCircleIcon />
                  <AlertDescription>
                    <p>
                      Learn about idOS FaceSign Terms & Conditions and Privacy
                      Policy.
                    </p>
                  </AlertDescription>
                </Alert>

                {/* Actions */}
                <div className="flex flex-col gap-5 w-full mt-2">
                  <Button
                    className="bg-aquamarine-400"
                    onClick={() => setIsMobile(true)}
                  >
                    Continue in Mobile
                  </Button>
                  <Button
                    variant="underline"
                    className="bg-neutral-700 hover:bg-neutral-600"
                    onClick={() => setIsMobile(false)}
                  >
                    <span className="text-neutral-100 text-xs font-medium">
                      Continue on this device
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
