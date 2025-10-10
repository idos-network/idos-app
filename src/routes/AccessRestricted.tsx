import MediumPrimaryButton from '@/components/MediumPrimaryButton';

export default function AccessRestricted() {
  return (
    <div className="flex flex-col min-h-screen font-urbanist">
      <div className="flex items-center justify-start gap-5 border-gray-800 border-b text-idos-seasalt h-18 px-6 sticky top-0 z-20 backdrop-blur-sm bg-neutral-950/60">
        <img src="/idos-logo.webp" alt="idos-logo" width="141" />
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 max-w-[620px]">
          <p className="text-3xl font-semibold text-neutral-50 mb-4 font-urbanist">
            Access Restricted
          </p>
          <br />
          <p className="text-neutral-200 text-xl mb-6 font-urbanist">
            We&apos;re sorry, but access to this app is not available in your
            region due to regulatory restrictions.
          </p>
          <p className="text-neutral-200 text-xl mb-6 font-urbanist">
            If you believe this is an error, please contact our support team.
          </p>
          <div className="flex justify-center">
            <a href="https://www.idos.network/">
              <MediumPrimaryButton>Reach out</MediumPrimaryButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
