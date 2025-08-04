import { profileStatusStyles } from '@/utils/profile-status';

type TagVariant = 'success' | 'failure' | 'pending';

interface TagProps {
  variant: TagVariant;
  children: React.ReactNode;
}

export default function Tag({ variant, children }: TagProps) {
  // Map the new variant names to existing profile status keys
  const variantToStatusMap: Record<TagVariant, string> = {
    success: 'verified',
    failure: 'error',
    pending: 'pending',
  };

  const profileStatus = variantToStatusMap[variant];
  const profileStatusStyle = profileStatusStyles[profileStatus];
  console.log({ profileStatus, profileStatusStyle });

  return (
    <div
      className={`flex text-[13px] font-medium items-center py-[2.5px] px-[5px] rounded-sm ${profileStatusStyle}`}
    >
      {children}
    </div>
  );
}
