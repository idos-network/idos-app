import { type ReactNode } from 'react';

export default function GetStartedTextBlock({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-start gap-8 bg-neutral-800 rounded-2xl p-8 w-64 flex-1">
      <div className="bg-aquamarine-400 h-10 w-10 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div className="text-neutral/50 text-2xl font-medium">{title}</div>
      <div className="text-neutral-400 text-base font-normal font-['Inter']">
        {subtitle}{' '}
      </div>
    </div>
  );
}
