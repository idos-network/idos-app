export default function SmallSecondaryButton({
  className,
  onClick,
  children,
  disabled,
  icon,
  iconColor,
  width = 'w-fit',
}: {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconColor?: string;
  width?: string;
}) {
  return (
    <button
      type="button"
      className={`font-['Inter'] flex items-center justify-center gap-2 text-sm font-medium self-stretch h-9 px-4 py-3 ${width} rounded-lg ${
        disabled
          ? 'cursor-not-allowed bg-neutral-400 text-neutral-700'
          : `cursor-pointer ${className || 'bg-neutral-700/50 text-neutral-50 hover:bg-neutral-700'}`
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <span
          className={`flex-shrink-0`}
          style={
            disabled
              ? { color: 'neutral-400' }
              : { color: iconColor || 'neutral-50' }
          }
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}
