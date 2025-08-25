import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSharedStore } from '@/stores/shared-store';
import { useNavigate } from '@tanstack/react-router';

const onrampProviderIcon = {
  noah: { icon: '/noah-logo.svg', name: 'Noah', color: '#FF5703' },
  transak: { icon: '/transak.svg', name: 'Transak', color: '#177DFE' },
};

export default function OnRampDialog() {
  const navigate = useNavigate();
  const { selectedProvider } = useSharedStore();
  const { icon, name, color } =
    onrampProviderIcon[selectedProvider as keyof typeof onrampProviderIcon];

  const handleContinueClick = () => {
    navigate({ to: '/notabank/onramp' });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary">
          Continue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-[#1A1A1A] border-none pt-10">
        <>
          <DialogHeader>
            <DialogTitle>
              <div className="flex w-full justify-center">
                <div
                  className={`w-[56px] h-[56px] rounded-lg flex items-center justify-center`}
                  style={{ backgroundColor: color }}
                >
                  <img
                    src={icon}
                    alt="onramp-provider"
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-normal text-neutral-50 text-center">
              {name.toUpperCase()}
            </p>
            <p className="text-sm text-neutral-400 text-center mt-2">
              This application uses {name} to securely connect accounts and move
              funds.
            </p>
            <p className="text-sm text-neutral-400 text-center">
              By clicking "Continue" you agree to {name.toUpperCase()}'s
              <a
                href="https://noah.com/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1"
              >
                <u>Terms of Service</u>
              </a>
              and
              <a
                href="https://noah.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1"
              >
                <u>Privacy Policy</u>
              </a>
              .
            </p>
          </div>
        </>
        <DialogFooter>
          <Button
            className="w-full rounded-lg bg-[#404040B2] text-neutral-50 mt-4"
            onClick={handleContinueClick}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
