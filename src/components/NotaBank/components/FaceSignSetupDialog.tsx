import {
  getFaceSignMobileUrl,
  getFaceSignStatus,
  getPublicKey,
} from '@/api/face-sign';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useIdOSLoggedIn } from '@/context/idos-context';
import { AlertCircleIcon, ChevronLeftIcon } from 'lucide-react';
import encodeQR from 'qr';
import { useEffect, useState } from 'react';
import { faceTec } from '../../../utils/facetec';

function QRCode({ userId }: { userId: string }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!qrCodeUrl && userId) {
      getFaceSignMobileUrl(userId).then(setQrCodeUrl);
    }
  }, [qrCodeUrl, userId]);

  let body = <div className="text-xl text-center">Loading QR Code...</div>;

  if (qrCodeUrl !== null) {
    body = (
      <div className="bg-white rounded-2xl w-[210px] h-[210px] mb-6 flex items-center justify-center">
        {/* Placeholder for QR code */}
        <div
          className="w-[190px] h-[190px] bg-white rounded-lg flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: encodeQR(qrCodeUrl, 'svg') }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      {/* QR Code - replace the placeholder with actual QR */}
      {body}
      <h3 className="text-neutral-50 text-2xl font-medium">
        Set Up idOS FaceSign
      </h3>
      <p className="text-neutral-400 text-sm max-w-[270px] text-center">
        Scan the QR code with your smartphone to continue the face scan and
        verification on your mobile.
      </p>
      <p className="text-center mb-5 text-idos-grey5">
        We are waiting for confirmation
        <span className="inline-block text-2xl ml-1">
          <span className="animate-pulse">.</span>
          <span className="animate-pulse delay-200">.</span>
          <span className="animate-pulse delay-500">.</span>
        </span>
      </p>
    </div>
  );
}

export default function FaceSignSetupDialog({
  mobile = false,
  userId,
  onDone,
}: {
  mobile?: boolean;
  userId?: string;
  onDone: (success: boolean) => void;
}) {
  const [qrCodeView, setQrCodeView] = useState(false);
  const [faceSignInProgress, setFaceSignInProgress] = useState(false);
  const [faceSignResult, setFaceSignResult] = useState<null | boolean>(null);
  const [faceSignError, setFaceSignError] = useState<string | null>(null);
  const [faceSignDuplicate, setFaceSignDuplicate] = useState(false);
  const idOSLoggedIn = useIdOSLoggedIn();
  const [faceTecInitialized, setFaceTecInitialized] = useState(false);
  const currentUserId = userId ?? idOSLoggedIn?.user.id ?? undefined;

  if (!currentUserId) {
    throw new Error('FaceSignSetupDialog: No user ID available');
  }

  useEffect(() => {
    // Initialize FaceTec when component mounts
    getPublicKey().then((publicKey) => {
      faceTec.init(currentUserId, publicKey, () => {
        console.log('FaceTec initialized');
        setFaceTecInitialized(true);
      });
    });

    const checkFaceSignStatus = (interval?: any) =>
      getFaceSignStatus(currentUserId)
        .then((result) => {
          if (result.faceSignDone) {
            if (interval) {
              clearInterval(interval);
            }
            setQrCodeView(false);
            setFaceSignResult(true);
            onDone(true);
          }
        })
        .catch((error) => {
          console.error('Error checking face sign status:', error);
        });

    // Also get the state from current user
    const interval = setInterval(() => {
      checkFaceSignStatus(interval);
    }, 5000);
    checkFaceSignStatus();

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLivenessCheck = () => {
    setFaceSignInProgress(true);

    faceTec.onLivenessCheckClick((status, duplicate, errorMessage?: string) => {
      setFaceSignInProgress(false);
      setFaceSignResult(status);
      setFaceSignError(errorMessage || null);
      setFaceSignDuplicate(duplicate);
    });
  };

  if (faceSignInProgress) {
    return (
      <div className="fixed inset-0 bg-[#090909] opacity-80 transition-opacity ease-in-out delay-150 duration-300 z-10"></div>
    );
  }

  let body = null;

  if (qrCodeView) {
    body = <QRCode userId={currentUserId} />;
  } else {
    body = (
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
                Learn about idOS{' '}
                <a
                  href="https://docs.idos.network/how-it-works/biometrics-and-idos-facesign-beta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  FaceSign
                </a>
                {', '} {' view our '}
                <a
                  href="https://www.idos.network/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Privacy Policy
                </a>
                {' and our '}
                <a
                  href="https://www.idos.network/legal/user-agreement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Terms & Conditions
                </a>
                {'.'}
              </p>
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex flex-col gap-5 w-full mt-2">
            <Button
              className="bg-aquamarine-400"
              disabled={!faceTecInitialized}
              onClick={() =>
                mobile ? handleLivenessCheck() : setQrCodeView(true)
              }
            >
              {mobile ? 'Start Liveness Check' : 'Continue on Mobile'}
            </Button>
            {!mobile && (
              <Button
                variant="underline"
                disabled={!faceTecInitialized}
                className="bg-neutral-700 hover:bg-neutral-600"
                onClick={() => handleLivenessCheck()}
              >
                <span className="text-neutral-100 text-xs font-medium">
                  Continue on this device
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (faceSignResult === false) {
    body = (
      <div className="flex flex-col justify-center items-center gap-6">
        <h3 className="text-neutral-50 text-2xl font-medium">
          FaceSign Failed
        </h3>
        <Alert variant="destructive" className="mt-3 text-left">
          <AlertCircleIcon />
          <AlertDescription>
            <p>
              {faceSignError ||
                'An unknown error occurred during the FaceSign process.'}
            </p>
          </AlertDescription>
        </Alert>
        {!faceSignDuplicate && (
          <>
            <Button
              className="bg-aquamarine-400"
              onClick={() => setFaceSignResult(null)}
            >
              Retry
            </Button>
            <p className="text-neutral-400 text-sm max-w-[270px] text-center">
              Unfortunately, we couldn't verify your identity. Please try again.
            </p>
          </>
        )}
      </div>
    );
  }

  if (faceSignResult === true && mobile) {
    body = (
      <div className="flex flex-col justify-center items-center gap-6">
        <h3 className="text-neutral-50 text-2xl font-medium">
          FaceSign Successful
        </h3>
        <Alert variant="success" className="mt-3 text-left">
          <AlertCircleIcon />
          <AlertDescription>
            <p>
              FaceSign has been successfully set up. You can now return to your
              browser to continue.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (faceSignResult === true && !mobile) {
    // Let's ask for DWG
    body = (
      <div className="flex flex-col justify-center items-center gap-6">
        <h3 className="text-neutral-50 text-2xl font-medium">
          FaceSign Successful
        </h3>
        <Alert variant="success" className="mt-3 text-left">
          <AlertCircleIcon />
          <AlertDescription>
            <p>
              FaceSign has been captured successfully. You will be now asked for
              a credentials creation.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setQrCodeView(false);
          onDone(false);
        }
      }}
      open={!faceSignInProgress}
    >
      <DialogContent
        className="sm:max-w-[425px] bg-[#1A1A1A] border-none"
        showCloseButton={!(faceSignResult === true && mobile)}
      >
        <DialogHeader>
          <DialogTitle className="flex justify-center mt-9">
            {qrCodeView && faceSignResult === null && (
              <Button
                variant="underline"
                size="icon"
                className="absolute left-4 top-6 -translate-y-1/2 text-neutral-400 hover:text-white"
                onClick={() => setQrCodeView(false)}
              >
                <ChevronLeftIcon className="min-h-5 min-w-5" />
              </Button>
            )}
            <img src="/idos-face-sign-logo.svg" alt="Face Sign" />
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 mt-12">{body}</div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
