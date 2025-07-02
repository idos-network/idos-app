import CheckIcon from '@/components/icons/check';
import CredentialIcon from '@/components/icons/credential';
import KeyIcon from '@/components/icons/key';
import PersonIcon from '@/components/icons/person';

function PrivateKeyStep({
  isActive,
  isDone,
}: {
  isActive?: boolean;
  isDone?: boolean;
}) {
  return (
    <div
      className={`w-[180px] h-[51px] flex items-center gap-2 pt-2 pr-6 pb-2 pl-2 rounded-[100px] ${isActive ? 'bg-neutral-50' : 'bg-neutral-800'}`}
    >
      <div
        className={`w-8 h-8 py-1 ${isActive || isDone ? 'bg-aquamarine-400' : 'bg-neutral-700'} rounded-[100px] flex justify-center items-center gap-2.5`}
      >
        {isDone ? (
          <CheckIcon color="var(--color-aquamarine-950)" />
        ) : (
          <KeyIcon
            color={
              isActive
                ? 'var(--color-aquamarine-950)'
                : 'var(--color-neutral-500)'
            }
          />
        )}
      </div>
      <span
        className={`font-inter ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`}
      >
        Private key
      </span>
    </div>
  );
}

function HumanVerificationStep({
  isActive,
  isDone,
}: {
  isActive?: boolean;
  isDone?: boolean;
}) {
  return (
    <div
      className={`h-[51px] flex items-center gap-2 pt-2 pr-6 pb-2 pl-2 rounded-[100px] ${isActive ? 'bg-neutral-50' : 'bg-neutral-800'}`}
    >
      <div
        className={`w-8 h-8 py-1 ${isActive || isDone ? 'bg-aquamarine-400' : 'bg-neutral-700'}  rounded-[100px] flex justify-center items-center gap-2.5`}
      >
        {isDone ? (
          <CheckIcon color="var(--color-aquamarine-950)" />
        ) : (
          <PersonIcon
            color={
              isActive
                ? 'var(--color-aquamarine-950)'
                : 'var(--color-neutral-500)'
            }
          />
        )}
      </div>
      <span
        className={`font-inter ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`}
      >
        Human verification
      </span>
    </div>
  );
}

function CredentialStep({
  isActive,
  isDone,
}: {
  isActive?: boolean;
  isDone?: boolean;
}) {
  return (
    <div
      className={`h-[51px] flex items-center gap-2 pt-2 pr-6 pb-2 pl-2 rounded-[100px] ${isActive ? 'bg-neutral-50' : 'bg-neutral-800'}`}
    >
      <div
        className={`w-8 h-8 py-1 ${isActive || isDone ? 'bg-aquamarine-400' : 'bg-neutral-700'} rounded-[100px] flex justify-center items-center gap-2.5`}
      >
        {isDone ? (
          <CheckIcon color="var(--color-aquamarine-950)" />
        ) : (
          <CredentialIcon
            color={
              isActive
                ? 'var(--color-aquamarine-950)'
                : 'var(--color-neutral-400)'
            }
          />
        )}
      </div>
      <span
        className={`font-inter ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`}
      >
        Add a credential
      </span>
    </div>
  );
}

export default function TopBar({ activeStep }: { activeStep?: string }) {
  return (
    <div className="self-stretch p-1 bg-idos-dark-mode rounded-[100px] inline-flex justify-between items-center relative">
      <PrivateKeyStep
        isActive={activeStep === 'step-two'}
        isDone={
          activeStep === 'step-three' ||
          activeStep === 'step-four' ||
          activeStep === 'step-five'
        }
      />

      <div className="h-px flex-1 bg-neutral-500" />

      <HumanVerificationStep
        isActive={activeStep === 'step-three'}
        isDone={activeStep === 'step-four' || activeStep === 'step-five'}
      />

      <div className="h-px flex-1 bg-neutral-500" />

      <CredentialStep
        isActive={activeStep === 'step-four'}
        isDone={activeStep === 'step-five'}
      />
    </div>
  );
}
