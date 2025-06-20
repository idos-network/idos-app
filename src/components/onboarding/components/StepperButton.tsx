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
      className={`flex justify-center  gap-2.5    text-base font-semibold font-['Urbanist']  self-stretch h-10 pl-6 pr-5 py-2  rounded-lg  ${className || 'bg-aquamarine-400 text-neutral-700'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
