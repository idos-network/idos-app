export function BackArrow({
  className,
  color,
  ...props
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      width="26"
      height="18"
      viewBox="0 0 26 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M9.21783 0.115158L10.6435 1.50749L4.13817 8.01282L25.6665 8.01282L25.6665 10.0125L4.1255 10.0125L10.6102 16.5178L9.21783 17.9102L0.320502 9.01249L9.21783 0.115158Z"
        fill={color || 'currentColor'}
      />
    </svg>
  );
}
