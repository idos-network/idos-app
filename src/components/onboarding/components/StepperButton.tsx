export default function StepperButton({
  className,
  onClick,
  children,
  disabled,
}: {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex items-center justify-center gap-2.5 text-xl font-medium self-stretch h-13 pl-6 pr-5 py-2 w-[348px] rounded-lg ${
        disabled
          ? 'cursor-not-allowed opacity-50 bg-aquamarine-700 text-neutral-800'
          : `cursor-pointer ${className || 'bg-aquamarine-400 text-neutral-950 hover:bg-aquamarine-600'}`
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
