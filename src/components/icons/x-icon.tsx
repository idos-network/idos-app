export default function XIcon({
  className,
  ...props
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      width="19"
      height="20"
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M11.307 8.46857L18.3798 0H16.7034L10.5638 7.35286L5.65767 0H0L7.41784 11.12L0 20H1.67635L8.16102 12.2343L13.3423 20H19L11.307 8.46857ZM9.01176 11.2171L8.2602 10.11L2.27983 1.3H4.85442L9.67951 8.41L10.4311 9.51714L16.7048 18.76H14.1302L9.01176 11.2171Z"
        fill={props.color || 'currentColor'}
      />
    </svg>
  );
}
