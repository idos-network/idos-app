export default function SmallPrimaryButton({
  className,
  onClick,
  children,
  disabled,
  icon,
  xSmall,
}: {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  xSmall?: boolean;
}) {
  return (
    <button
      type="button"
      className={`font-['Inter'] flex items-center justify-center gap-2 text-sm font-medium self-stretch px-4 py-3 w-fit rounded-lg ${
        xSmall ? 'h-8' : 'h-9'
      } ${
        disabled
          ? 'cursor-not-allowed opacity-50 bg-aquamarine-700 text-neutral-800'
          : `cursor-pointer ${className || 'bg-aquamarine-400 text-neutral-950 hover:bg-aquamarine-600'}`
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
