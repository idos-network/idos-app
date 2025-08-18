import { cn } from '@/lib/utils';
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

export default function AmountInput(props: NumberField.Root.Props) {
  const id = useId();
  return (
    <div className="flex items-center gap-2 w-full">
      <NumberField.Root
        className="flex-1 w-full"
        {...props}
        id={props.id ?? id}
      >
        <NumberField.ScrubArea className="cursor-ew-resize">
          <NumberField.ScrubAreaCursor className="drop-shadow-[0_1px_1px_#0008] filter">
            <CursorGrowIcon />
          </NumberField.ScrubAreaCursor>
        </NumberField.ScrubArea>
        <NumberField.Group className="flex w-full">
          <NumberField.Input
            className={cn(
              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              props.className,
            )}
          />
        </NumberField.Group>
      </NumberField.Root>
    </div>
  );
}
