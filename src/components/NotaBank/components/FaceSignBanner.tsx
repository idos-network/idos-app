import { isProduction } from '@/env';
import FaceSignSetupDialog from './FaceSignSetupDialog';

export default function FaceSignBanner() {
  if (isProduction) {
    return null;
  }

  return (
    <div className="mx-auto flex-1">
      {/* Background gradients */}
      <div
        className="relative overflow-hidden rounded-3xl border border-aquamarine-900 p-8"
        style={{
          background: `
            radial-gradient(ellipse 70% 180% at 25% 0%, #00624D -10%, rgba(0, 0, 0, 0.3) 80%),
            linear-gradient(81deg,#262626 20%, #00624D 100%)
          `,
        }}
      >
        {/* Background grid patterns */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
          linear-gradient(#525252 1px, transparent 1px),
          linear-gradient(90deg, #525252 1px, transparent 1px)
        `,
            backgroundSize: '23px 23px',
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
            <FaceSignSetupDialog />
          </div>
        </div>
      </div>
    </div>
  );
}
