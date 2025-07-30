import { type ReactNode } from 'react';

export default function StepperCards({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title?: string;
  description: string;
}) {
  return (
    <div className="relative w-full h-full rounded-[20px] bg-gradient-to-r from-[#292929] to-idos-grey1 p-[1px] overflow-hidden">
      <div
        className={`w-full h-full rounded-[19px] p-8 flex flex-col ${
          title ? 'gap-8' : 'gap-4'
        } bg-idos-grey1/90`}
      >
        <div className="w-8 h-8 flex items-center justify-start">{icon}</div>
        <div className="flex flex-col gap-4">
          {title && (
            <span className="text-xl font-semibold text-neutral-50">
              {title}
            </span>
          )}
          <span className="font-['Inter'] text-base font-normal text-neutral-400 ">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}
