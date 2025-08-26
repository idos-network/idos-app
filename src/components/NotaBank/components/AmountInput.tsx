import { cn } from '@/lib/utils';
import { NumberField } from '@base-ui-components/react/number-field';
import { useId, type ReactNode } from 'react';

type AmountInputProps = NumberField.Root.Props & {
  rightSlot?: ReactNode;
};

export default function AmountInput(props: AmountInputProps) {
  const id = useId();
  return (
    <NumberField.Root className="w-full" {...props} id={props.id ?? id}>
      <NumberField.Group className="flex w-full items-center justify-between bg-neutral-800/40 rounded-2xl px-6 py-6 border border-neutral-700/50">
        <NumberField.Input
          className={cn(
            'bg-transparent border-none outline-none text-2xl font-medium text-white placeholder:text-neutral-400 w-full font-urbanist',
            'focus:ring-0 focus:outline-none',
            props.className,
          )}
          placeholder="0.00"
        />
        {props.rightSlot ? (
          <div className="ml-4 shrink-0">{props.rightSlot}</div>
        ) : null}
      </NumberField.Group>
    </NumberField.Root>
  );
}
