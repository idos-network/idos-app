import SmallPrimaryButton from '@/components/SmallPrimaryButton';
import { Link } from '@tanstack/react-router';

export function StakeFrame() {
  return (
    <div className="mx-auto flex-1">
      {/* Background gradients */}
      <div
        className="relative overflow-hidden rounded-3xl border border-aquamarine-900 p-6"
        style={{
          background: `
            radial-gradient(ellipse 70% 180% at 25% 0%, #00624D -10%, rgba(0, 0, 0, 0.3) 80%),
            linear-gradient(81deg,#262626 20%, #00624D 100%)
          `,
        }}
      >
        {/* Background grid patterns */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
          linear-gradient(#525252 1px, transparent 1px),
          linear-gradient(90deg, #525252 1px, transparent 1px)
        `,
            backgroundSize: '23px 23px',
          }}
        />

        {/* Main content */}
        <div className="relative flex items-center justify-between gap-10 flex-1">
          <div className="flex items-center sm:gap-10 flex-1">
            <div className="flex flex-col gap-2.5 text-left">
              <div className="text-2xl font-normal text-neutral-50">
                Staking Event
              </div>
              <p className="text-sm text-neutral-50 font-light font-['Inter']">
                Stake and lock ETH or NEAR and get to participate in the IDOS
                airdrop*.
                <br />
                Share and Access Grant to your KYC and join the idOS Staking
                Event before the staking window closes.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link to="/staking-event/stake">
              <SmallPrimaryButton>Stake</SmallPrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
