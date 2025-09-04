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
    <div className="relative w-[308px]  p-6">
      {/* Triangle at the top */}
      {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3">
        <div className="w-1 h-1 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#441983]" />
        <div className="absolute top-[1px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[7px] border-l-transparent border-r-transparent border-b-neutral-900" />
      </div> */}

      <div className="absolute inset-0 backdrop-blur-md -z-10 bg-neutral-900 rounded-xl" />
      <div
        className={`absolute inset-0 w-full h-full z-10 rounded-xl border border-[#441983] ${contentAnimationClasses}`}
      />
      <div
        className={`relative flex flex-col items-center justify-center w-full z-10 pt-4 gap-4 ${contentAnimationClasses}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex-1" />
          <h2 className="text-xl leading-7 font-semibold text-neutral-50">
            Earn points*
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
        <div className="text-sm text-neutral-400">
          *Subject to{' '}
          <a
            href="https://www.idos.network/legal/user-agreement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-aquamarine-600 underline"
          >
            terms
          </a>
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
