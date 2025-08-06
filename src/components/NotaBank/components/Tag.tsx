import { profileStatusStyles } from '@/utils/profile-status';

type TagVariant = 'success' | 'failure' | 'pending';

interface TagProps {
  variant: TagVariant;
  children: React.ReactNode;
  className?: string;
}

export default function AppTag({ variant, children, className }: TagProps) {
  // Map the new variant names to existing profile status keys
  const variantToStatusMap: Record<TagVariant, string> = {
    success: 'verified',
    failure: 'error',
    pending: 'pending',
  };

  const profileStatus = variantToStatusMap[variant];
  const profileStatusStyle = profileStatusStyles[profileStatus];

  return (
    <div
      className={`flex text-[10px] font-medium items-center py-[2.5px] px-[5px] rounded-sm ${profileStatusStyle} ${className}`}
    >
      {children}
    </div>
  );
}
