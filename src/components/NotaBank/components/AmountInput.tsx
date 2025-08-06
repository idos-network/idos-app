import { NumberField } from '@base-ui-components/react/number-field';
import { useId } from 'react';

function CursorGrowIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="26"
      height="14"
      viewBox="0 0 24 14"
      fill="black"
      stroke="white"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </svg>
  );
}

type AmountInputProps = {
  id?: string;
};

export default function AmountInput(props: AmountInputProps) {
  const id = useId();
  return (
    <div className="flex items-center gap-2 justify-between">
      <NumberField.Root
        id={props.id ?? id}
        defaultValue={100}
        className="flex flex-col items-start gap-1"
      >
        <NumberField.ScrubArea className="cursor-ew-resize">
          <NumberField.ScrubAreaCursor className="drop-shadow-[0_1px_1px_#0008] filter">
            <CursorGrowIcon />
          </NumberField.ScrubAreaCursor>
        </NumberField.ScrubArea>
        <NumberField.Group className="flex">
          <NumberField.Input className="h-16 w-full border border-neutral-800 text-neutral-50 tabular-nums focus:z-1 focus:-outline-offset-0 focus:outline-neutral-600 text-2xl px-2" />
        </NumberField.Group>
      </NumberField.Root>
    </div>
  );
}
