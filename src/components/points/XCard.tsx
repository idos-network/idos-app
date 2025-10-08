import XIcon from '../icons/x-icon';
import SignInXButton from './SignInXButton';
import { useQuery } from '@tanstack/react-query';
import { getXOAuth } from '@/api/x-oauth';
import { useUserId } from '@/hooks/useUserId';
import { useToast } from '@/hooks/useToast';

interface XCardProps {
  onOAuthSuccess?: () => void;
}

export default function XCard({ onOAuthSuccess }: XCardProps) {
  const { data: userId, isLoading: userIdLoading } = useUserId();
  const { showToast } = useToast();

  const xOAuth = useQuery({
    queryKey: ['xOAuth', userId],
    queryFn: () => getXOAuth(userId!),
    enabled: !!userId && !userIdLoading,
  });

  const handleSignInClick = async () => {
    try {
      const result = xOAuth.data
        ? { data: xOAuth.data }
        : await xOAuth.refetch();
      const url = result.data?.url;
      if (url) {
        const popup = window.open(
          url,
          '_blank',
          'width=600,height=700,scrollbars=yes,resizable=yes',
        );
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          if (event.data.type === 'oauth-success') {
            popup?.close();
            window.removeEventListener('message', handleMessage);
            onOAuthSuccess?.();
          }
          if (event.data.type === 'oauth-error') {
            popup?.close();
            showToast({
              type: 'error',
              message: 'Failed to sign in with X',
            });
            window.removeEventListener('message', handleMessage);
          }
        };
        window.addEventListener('message', handleMessage);
      }
    } catch (error) {
      console.error('Error during X OAuth:', error);
      showToast({
        type: 'error',
        message: 'Failed to initiate X sign-in',
      });
    }
  };

  return (
    <div className="w-[445px] h-[98px] rounded-lg border border-neutral-800 flex items-center">
      <div
        className="w-[298px] h-[96px] rounded-l-lg relative overflow-hidden"
        style={{
          background: `
              radial-gradient(ellipse 280px 380px at bottom left, rgba(107, 142, 35, 0.4) 0%, rgba(107, 142, 35, 0.2) 30%, rgba(107, 142, 35, 0.1) 50%, transparent 100%),
              #090909
            `,
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
        }}
      >
        <img
          src="/x-logos.png"
          alt="Rotated image"
          className="absolute inset-0 w-[220px] h-full object-cover left-[-10px] top-[5px] rotate-25"
        />
      </div>

      <div className="flex-1 -ml-4 z-10">
        <SignInXButton
          disabled={xOAuth.isLoading}
          icon={<XIcon className="w-4 h-4" />}
          onClick={handleSignInClick}
        >
          Sign in with X
        </SignInXButton>
      </div>
    </div>
  );
}
