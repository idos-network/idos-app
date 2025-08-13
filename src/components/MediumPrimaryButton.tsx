export default function MediumPrimaryButton({
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
      className={`flex items-center justify-center gap-2.5 text-base font-medium tracking-wide
 self-stretch h-10 px-4 py-3 w-[228px] rounded-lg ${
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
