import { isProduction } from '@/env';
import { forwardRef } from 'react';

const FaceSignTag = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  if (isProduction) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="flex items-center gap-2 bg-[#00FFB933] p-1.5 rounded-sm cursor-pointer"
      {...props}
    >
      <img src="/idos-face-sign-mini.svg" alt="FaceSign Tag" />
      <span className="text-xs text-aquamarine-400">idOS FaceSign</span>
    </div>
  );
});

FaceSignTag.displayName = 'FaceSignTag';

export default FaceSignTag;
