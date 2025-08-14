import CloseIcon from '../icons/close';

interface OnboardingPointsToastProps {
  onClose: () => void;
}

export default function OnboardingPointsToast({
  onClose,
}: OnboardingPointsToastProps) {
  return (
    <div className="relative w-[308px] h-[224px] rounded-2xl p-6">
      {/* Blur background that matches the exact shape */}
      <div
        className="absolute inset-0 backdrop-blur-md -z-10 bg-neutral-900/80"
        style={{
          clipPath:
            'path("M 154 5 L 168 20 L 296 20 Q 308 20 308 32 L 308 212 Q 308 224 296 224 L 12 224 Q 0 224 0 212 L 0 32 Q 0 20 12 20 L 140 20 Z")',
        }}
      />

      {/* Main toast shape */}
      <svg
        className="absolute inset-0 w-full h-full z-10"
        viewBox="-1 0 310 225"
        preserveAspectRatio="none"
      >
        <path
          d="M 154 5 L 168 20 L 296 20 A 12 12 0 0 1 308 32 L 308 212 A 12 12 0 0 1 296 224 L 12 224 A 12 12 0 0 1 0 212 L 0 32 A 12 12 0 0 1 12 20 L 140 20 Z"
          fill="transparent"
          stroke="#441983"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative flex flex-col items-center justify-center w-full z-10 pt-4 gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1" />
          <h2 className="text-xl leading-7 font-semibold text-neutral-50">
            Earn points!
          </h2>
          <div className="flex-1 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-md p-2 text-neutral-200 hover:bg-idos-grey2"
            >
              <CloseIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="flex items-center text-center font-['Inter'] font-light text-sm">
          Your journey starts here. Once you complete your idOS Profile, you
          will see more quests to earn points!
        </div>
        <div className="flex justify-center w-full">
          <button
            className="font-['Inter'] flex items-center justify-center gap-2 text-sm font-medium px-4 py-3 w-[260px] h-10 rounded-lg bg-aquamarine-400 text-neutral-950 hover:bg-aquamarine-600 cursor-pointer"
            onClick={onClose}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
