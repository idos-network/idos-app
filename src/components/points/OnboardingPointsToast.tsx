import CloseIcon from '../icons/close';

interface OnboardingPointsToastProps {
  onClose: () => void;
  isVisible?: boolean;
}

export default function OnboardingPointsToast({
  onClose,
  isVisible = true,
}: OnboardingPointsToastProps) {
  const contentAnimationClasses = `transition-all duration-500 ease-out transform ${
    isVisible
      ? 'opacity-100 translate-y-0 scale-100'
      : 'opacity-0 -translate-y-3 scale-95'
  }`;

  return (
    <div className="relative w-[308px] h-[224px] p-6">
      <div
        className="absolute inset-0 backdrop-blur-md -z-10 bg-neutral-900/80"
        style={{
          clipPath:
            'path("M 154 5 L 168 20 L 296 20 A 12 12 0 0 1 308 32 L 308 212 A 12 12 0 0 1 296 224 L 12 224 A 12 12 0 0 1 0 212 L 0 32 A 12 12 0 0 1 12 20 L 140 20 Z")',
        }}
      />
      <svg
        className={`absolute inset-0 w-full h-full z-10 ${contentAnimationClasses}`}
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
      <div
        className={`relative flex flex-col items-center justify-center w-full z-10 pt-4 gap-4 ${contentAnimationClasses}`}
      >
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
