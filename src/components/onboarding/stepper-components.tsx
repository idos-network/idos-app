import CredentialIcon from '../icons/credential';
import KeyIcon from '../icons/key';
import PersonIcon from '../icons/person';
import RocketIcon from '../icons/rocket';

export function TopBar({ activeStep }: { activeStep?: string }) {
  const active =
    'pl-3 pr-6 py-2 bg-idos-grey2 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-zinc-800 flex justify-start items-center gap-2';
  const inactive =
    'pl-3 pr-6 py-2 bg-idos-grey1 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-zinc-800 flex justify-start items-center gap-2';

  return (
    <div className="self-stretch p-1 bg-idos-dark-mode rounded-[100px] inline-flex justify-between items-center">
      <div className={activeStep === 'step-one' ? active : inactive}>
        <div className="w-8 h-8 py-1 bg-zinc-500 rounded-[100px] flex justify-center items-center gap-2.5">
          <RocketIcon />
        </div>
        <div className="justify-start bg-idos text-zinc-300 text-base font-semibold font-['Urbanist']">
          Get Started
        </div>
      </div>
      <div
        id="step-two"
        className={activeStep === 'step-two' ? active : inactive}
      >
        <div className="w-8 h-8 py-1 bg-neutral-600 rounded-[100px] flex justify-center items-center gap-2.5">
          <KeyIcon />
        </div>
        <div className="justify-start text-zinc-300 text-base font-semibold font-['Urbanist']">
          Private key
        </div>
      </div>
      <div
        id="step-three"
        className={activeStep === 'step-three' ? active : inactive}
      >
        <div className="w-8 h-8 py-1 bg-neutral-600 rounded-[100px] flex justify-center items-center gap-2.5">
          <PersonIcon />
        </div>
        <div className="justify-start text-zinc-300 text-base font-semibold font-['Urbanist']">
          Human verification
        </div>
      </div>
      <div
        id="step-four"
        className={activeStep === 'step-four' ? active : inactive}
      >
        <div className="w-8 h-8 py-1 bg-neutral-600 rounded-[100px] flex justify-center items-center gap-2.5">
          <CredentialIcon />
        </div>
        <div className="justify-start text-zinc-300 text-base font-semibold font-['Urbanist']">
          Add a credential
        </div>
      </div>
    </div>
  );
}

export function StepperContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (!className) {
    className =
      'w-[782px] h-[746px] rounded-[20px] bg-idos-grey1 p-6 flex flex-col items-center justify-center gap-10';
  }

  return <div className={className}>{children}</div>;
}

export function StepperButton({
  className,
  onClick,
  children,
}: {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  if (!className) {
    className =
      "flex justify-center  gap-2.5   text-neutral-700 text-base font-semibold font-['Urbanist']  self-stretch h-10 pl-6 pr-5 py-2 bg-neutral-100/80 rounded-lg ";
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}

export function TextBlock({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <p className="self-stretch text-center justify-start text-white text-3xl font-semibold font-['Urbanist']">
        {title}
      </p>
      <p className="self-stretch text-center justify-start text-white text-xl font-normal font-['Urbanist']">
        {subtitle}
      </p>
    </div>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-none space-y-2 text-center mt-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-idos-grey3 mt-1">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DoneIcon() {
  return (
    <svg
      width="196"
      height="195"
      viewBox="0 0 196 195"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="98" cy="97.5" r="97.5" fill="#D9D9D9" fill-opacity="0.05" />
      <path
        d="M87.6892 110.756L123.355 75.0906C124.196 74.249 125.178 73.8281 126.301 73.8281C127.423 73.8281 128.405 74.249 129.246 75.0906C130.088 75.9323 130.509 76.9325 130.509 78.0912C130.509 79.2499 130.088 80.2486 129.246 81.0875L90.635 119.804C89.7934 120.646 88.8114 121.067 87.6892 121.067C86.567 121.067 85.585 120.646 84.7434 119.804L66.6475 101.708C65.8059 100.867 65.4019 99.8679 65.4355 98.712C65.4692 97.5561 65.9083 96.5559 66.7527 95.7115C67.5972 94.867 68.5974 94.4461 69.7533 94.449C70.9092 94.4518 71.908 94.8726 72.7496 95.7115L87.6892 110.756Z"
        fill="#D9D9D9"
        fill-opacity="0.8"
      />
    </svg>
  );
}
