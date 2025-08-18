import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertCircleIcon } from 'lucide-react';

export default function FaceSignSetupDialog() {
  return (
    <Dialog>
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
            <img src="/idos-face-sign-logo.svg" alt="Face Sign" />
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 mt-12">
          <div className="flex flex-col justify-center items-center gap-12">
            <img
              src="/face-sign-creation.svg"
              alt="Face Sign"
              className="max-w-[136px]"
            />
            <div className="flex flex-col items-center text-center">
              <h3 className="text-neutral-50 text-2xl font-medium">
                Set Up idOS FaceSign
              </h3>
              <p className="text-neutral-400 text-sm mt-3 max-w-[270px]">
                First, position your face in the camera frame. Then follow the
                instructions given.
              </p>
              <Alert variant="default" className="mt-6 text-left">
                <AlertCircleIcon />
                <AlertTitle>Unable to process your payment.</AlertTitle>
                <AlertDescription>
                  <p>
                    Learn about idOS FaceSign Terms & Conditions and Privacy
                    Policy.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
