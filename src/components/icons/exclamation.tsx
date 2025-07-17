export default function ExclamationIcon({
  className,
  ...props
}: {
  className?: string;
  color?: string;
  width?: string;
  height?: string;
}) {
  return (
    <svg
      width={props.width || '2'}
      height={props.height || '13'}
      viewBox="0 0 2 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M0 8.5V0H2L2 8.5H0ZM0 12.5V10.5H2V12.5H0Z"
        fill={props.color || 'currentColor'}
        stroke={props.color || 'currentColor'}
        strokeWidth="0.3"
      />
    </svg>
  );
}
