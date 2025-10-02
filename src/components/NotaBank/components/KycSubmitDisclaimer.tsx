import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import PersonaIcon from '@/components/icons/persona';
import { useNavigate } from '@tanstack/react-router';

export default function KycSubmitDisclaimer({
  spendAmount,
  buyAmount,
  selectedCurrency,
  selectedToken,
}: {
  spendAmount: number;
  buyAmount: number;
  selectedCurrency: string;
  selectedToken: string;
}) {
  const navigate = useNavigate();

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            disabled={
              !+spendAmount ||
              !+buyAmount ||
              !selectedCurrency ||
              !selectedToken
            }
            className="h-12 w-full rounded-lg bg-[#74FB5B] text-black"
          >
            Continue
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-none">
          <div className="flex flex-col gap-4 my-4 items-center">
            <div className="w-[56px] h-[56px] bg-neutral-100 rounded-lg flex items-center justify-center">
              <PersonaIcon />
            </div>
            <span className="text-neutral-50 text-2xl font-medium">
              Persona
            </span>
          </div>
          <div className="flex flex-col gap-4 text-center px-6">
            <p className="text-neutral-400 text-sm">
              You’re about to submit mock sensitive data to our identity
              verification provider, Persona.
            </p>
            <p className="text-neutral-400 text-sm">
              By confirming, you agree to the Users’ Agreement, and confirm
              you’ve read the Privacy Policy and Transparency Document.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className=" text-white h-12 w-full rounded-lg bg-[#404040B2] flex items-center gap-2 mt-3"
                // onClick={() => navigate({ to: '/notabank/kyc' })}
                onClick={() => navigate({ to: '/' })}
              >
                Continue
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
