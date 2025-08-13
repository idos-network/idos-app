import { Button } from '@/components/ui/button';

export default function FaceSignBanner() {
  return (
    <div className="mx-auto flex-1">
      <div
        className="relative overflow-hidden rounded-3xl border border-green-600/40 p-8"
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
            backgroundSize: '25px 25px',
          }}
        />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
            backgroundSize: '12px 12px',
          }}
        />

        {/* Main content */}
        <div className="relative flex items-center justify-between gap-10">
          {/* Left side - Icon and text */}
          <div className="flex items-center sm:gap-10 flex-1">
            {/* Icon */}
            <div className="flex flex-col">
              <div className="flex gap-2.5 items-center">
                <img
                  src="/idos-face-sign.svg"
                  alt="idOS FaceSign"
                  className="w-[150px] h-auto"
                />
              </div>
              <span className="text-xl font-light text-white/90 ml-auto">
                FaceSign
              </span>
            </div>

            {/* Text content */}
            <div className="flex flex-col gap-1 text-left">
              <h2 className="text-2xl font-medium text-white text-left!">
                One Look. Full Control.
              </h2>
              <p className="text-base text-white/90 font-light">
                Create your idOS FaceSign wallet to access your data without
                passwords. Your face, your control.
              </p>
            </div>
          </div>

          {/* Right side - Button */}
          <div className="flex-shrink-0">
            <Button
              className="bg-aquamarine-400 hover:bg-aquamarine-300 text-green-900 font-medium  text-base rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-green-400/25"
              size="lg"
              //   onClick={() => navigate({ to: buttonLink })}
            >
              Create
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
