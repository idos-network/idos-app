import { useNavigate } from '@tanstack/react-router';
import { LandingCoreUI } from './Landing';
import { Button } from '@/components/ui/button';

export default function NotaCard() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Gradient box similar to the image */}
      <div className="bg-gradient-to-r from-[#A8FF7A] via-[#74FB5B] to-[#5FE041] rounded-3xl p-6 my-8 min-h-[200px] relative overflow-hidden flex flex-col">
        <h3 className="text-6xl font-medium text-neutral-950">NotaCard</h3>
        <p className="text-base text-neutral-950 mt-2">
          Self-custody meets real-world utilily.
        </p>
        <Button
          className="px-5 w-fit mt-10 bg-[#74FB5B] text-neutral-950"
          onClick={() =>
            // navigate({ to: '/notabank/notacard/terms-and-conditions' })
            navigate({ to: '/' })
          }
        >
          Get NotaCard
        </Button>
      </div>

      <LandingCoreUI />
    </div>
  );
}
