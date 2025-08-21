import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon } from 'lucide-react';

export default function DeactiviateFaceSignDialog({
  onCancel,
  onDeactivate,
}: {
  onCancel: () => void;
  onDeactivate: () => void;
}) {
  return (
    <div className="">
      <div className="flex flex-col justify-center items-center gap-4">
        {/* FaceSign Logo */}
        <img
          src="/idos-deactiviate-face-sign.svg"
          alt="Face Sign"
          className="max-w-[136px]"
        />

        {/* FaceSign Description */}
        <div className="flex flex-col items-center text-center gap-3">
          <h3 className="text-neutral-50 text-xl text-center">
            Are you sure you want to deactivate your idOS FaceSign wallet?
          </h3>
          <p className="text-neutral-400 text-sm text-center">
            You’re going to disable or disconnect your idOS FaceSign wallet.
          </p>
        </div>

        {/* danger Alert */}
        <Alert variant="destructive" className="text-left bg-[#E2363633]">
          <AlertCircleIcon />
          <AlertDescription>
            <p>Deactivating idOS FaceSign will disable facial signing.</p>
          </AlertDescription>
        </Alert>

        {/* actions*/}
        <div className="flex gap-3 w-full mt-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white"
            onClick={onCancel}
          >
            No, keep it.
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 bg-neutral-700 hover:bg-red-600 text-red-400 hover:text-white"
            onClick={onDeactivate}
          >
            Yes, deactivate
          </Button>
        </div>
      </div>
    </div>
  );
}
