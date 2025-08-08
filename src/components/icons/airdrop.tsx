export default function AirdropIcon({
  className,
  ...props
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      width="23"
      height="29"
      viewBox="0 0 23 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <title>Airdrop icon</title>
      <path
        d="M11.6469 20.4583L21.9266 11.4268H15.6854M11.6469 20.4583L15.6854 11.4268M11.6469 20.4583L7.24128 11.4268M11.6469 20.4583L1 11.4268H7.24128M15.6854 11.4268H7.24128"
        stroke={props.color || 'currentColor'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M21.8532 11.4266C21.8532 5.66815 17.1851 1 11.4266 1C5.66815 1 1 5.66815 1 11.4266"
        stroke={props.color || 'currentColor'}
        strokeWidth="2"
      />
      <path
        d="M15.6855 11.4266C15.6855 5.66815 13.7788 1 11.4267 1C9.07468 1 7.16797 5.66815 7.16797 11.4266"
        stroke={props.color || 'currentColor'}
        strokeWidth="2"
      />
      <rect
        x="8.39453"
        y="21.2725"
        width="6.72736"
        height="6.72736"
        stroke={props.color || 'currentColor'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
