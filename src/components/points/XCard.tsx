import XIcon from '../icons/x-icon';
import SignInXButton from './SignInXButton';

export default function XCard() {
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
        <SignInXButton disabled icon={<XIcon className="w-4 h-4" />}>
          Sign in with
        </SignInXButton>
      </div>
    </div>
  );
}
