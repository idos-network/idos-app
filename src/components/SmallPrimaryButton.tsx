export default function SmallPrimaryButton({
  className,
  onClick,
  children,
  disabled,
  icon,
}: {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`flex items-center justify-center gap-2 text-sm font-medium self-stretch h-9 px-4 py-3 w-fit rounded-lg ${
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
