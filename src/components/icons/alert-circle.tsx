export default function AlertCircleIcon({
  className,
  ...props
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_13979_10182)">
        <path
          d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
          stroke={props.color || 'currentColor'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 5.33325V7.99992"
          stroke={props.color || 'currentColor'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 10.6667H8.00667"
          stroke={props.color || 'currentColor'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
