export default function AddIcon({
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
      width={props.width || '13'}
      height={props.height || '14'}
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M5.75 7.75H0V6.25H5.75V0.5H7.25V6.25H13V7.75H7.25V13.5H5.75V7.75Z"
        fill={props.color || 'currentColor'}
      />
    </svg>
  );
}
