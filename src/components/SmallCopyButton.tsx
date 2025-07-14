import { useState } from 'react';
import copy from 'copy-to-clipboard';
import SmallSecondaryButton from './SmallSecondaryButton';
import { CopyIcon } from './icons/copy';
import CheckIcon from './icons/check';

interface CopyButtonProps {
  content: string;
  className?: string;
  iconColor?: string;
  children?: React.ReactNode;
  onCopy?: () => void;
  onError?: (error: Error) => void;
}

export default function CopyButton({
  content,
  className,
  iconColor,
  children = 'Copy',
  onCopy,
  onError,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      const success = copy(content);
      if (success) {
        setCopied(true);
        onCopy?.();

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } else {
        throw new Error('Failed to copy to clipboard');
      }
    } catch (error) {
      console.error('Copy failed:', error);
      onError?.(error as Error);
    }
  };

  return (
    <SmallSecondaryButton
      className={className}
      onClick={handleCopy}
      width="w-22"
      icon={
        copied ? (
          <CheckIcon className="w-4 h-4" color={iconColor} />
        ) : (
          <CopyIcon className="w-4 h-4" color={iconColor} />
        )
      }
    >
      {copied ? null : children}
    </SmallSecondaryButton>
  );
}
