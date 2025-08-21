import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function HeroCard({
  title,
  subtitle,
  buttonText,
  buttonLink,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex-1">
      <div
        className="relative overflow-hidden rounded-3xl border border-green-600/40 p-6"
        style={{
          background: `
          linear-gradient(91.71deg, rgba(38, 38, 38, 0.6) -3.43%, rgba(0, 98, 77, 0.6) 97.67%), radial-gradient(73.41% 215.8% at 27.88% 12.72%, rgba(0, 98, 77, 0.8) 0%, rgba(0, 0, 0, 0.16) 100%) 
        `,
        }}
      >
        {/* Background grid patterns */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.8) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative p-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl  font-semibold text-white tracking-tight drop-shadow-lg font-heading">
                {title}
              </h1>

              <p className="text-base text-white/90 font-light drop-shadow-md max-w-lg">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right side - Button */}
          <div className="flex-shrink-0">
            <Button
              className="bg-green-400 hover:bg-green-300 text-green-900 font-semibold px-8 py-6 text-lg rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-green-400/25"
              size="lg"
              onClick={() => navigate({ to: buttonLink })}
            >
              {buttonText}
            </Button>
          </div>
        </div>

        {/* Decorative overlays */}
        <div className="absolute inset-0 rounded-3xl shadow-inner shadow-green-500/20 pointer-events-none"></div>
        <div className="absolute inset-0 rounded-3xl border border-green-400/20 pointer-events-none"></div>
      </div>
    </div>
  );
}
