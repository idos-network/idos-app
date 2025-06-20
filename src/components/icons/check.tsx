export default function CheckIcon({
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
      width={props.width || '24'}
      height={props.height || '25'}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.55 15.65L18.025 7.175C18.225 6.975 18.4583 6.875 18.725 6.875C18.9917 6.875 19.225 6.975 19.425 7.175C19.625 7.375 19.725 7.61267 19.725 7.888C19.725 8.16333 19.625 8.40067 19.425 8.6L10.25 17.8C10.05 18 9.81666 18.1 9.55 18.1C9.28333 18.1 9.05 18 8.85 17.8L4.55 13.5C4.35 13.3 4.254 13.0627 4.262 12.788C4.27 12.5133 4.37433 12.2757 4.575 12.075C4.77566 11.8743 5.01333 11.7743 5.288 11.775C5.56266 11.7757 5.8 11.8757 6 12.075L9.55 15.65Z"
        fill={props.color || 'currentColor'}
      />
    </svg>
  );
}
