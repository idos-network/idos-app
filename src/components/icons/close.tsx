export function CloseIcon({
  className,
  ...props
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M1.28347 12L0.333252 11.0498L5.38304 6L0.333252 0.950216L1.28347 0L6.33325 5.04978L11.383 0L12.3333 0.950216L7.28347 6L12.3333 11.0498L11.383 12L6.33325 6.95022L1.28347 12Z"
        fill={props.color || 'currentColor'}
      />
    </svg>
  );
}
