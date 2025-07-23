import StepperButton from './StepperButton';

export function ButtonGroup({
  primaryText,
  primaryOnClick,
  primaryDisabled = false,
  secondaryText,
  secondaryOnClick,
}: {
  primaryText: string;
  primaryOnClick: () => void;
  primaryDisabled?: boolean;
  secondaryText: string;
  secondaryOnClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 mt-auto">
      <StepperButton onClick={primaryOnClick} disabled={primaryDisabled}>
        {primaryText}
      </StepperButton>
      <StepperButton
        className="bg-none text-aquamarine-50 hover:text-aquamarine-200"
        onClick={secondaryOnClick}
      >
        {secondaryText}
      </StepperButton>
    </div>
  );
}
