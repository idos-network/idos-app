export default function MobileRestricted() {
  return (
    <div className="flex flex-col min-h-screen font-urbanist">
      <div className="flex items-center justify-start gap-5 border-gray-800 border-b text-idos-seasalt h-18 px-6 sticky top-0 z-20 backdrop-blur-sm bg-neutral-950/60">
        <img src="/idos-logo.png" alt="idos-logo" width="141" />
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 max-w-[620px]">
          <p className="text-3xl font-semibold text-neutral-50 mb-4 font-urbanist">
            Access Limited
          </p>
          <br />
          <p className="text-neutral-200 text-xl mb-6 font-urbanist">
            For a better experience today, app.idos.network only supports
            desktop. Please use a desktop browser that supports wallet
            extensions (e.g. Chrome, Brave, Firefox).
          </p>
        </div>
      </div>
    </div>
  );
}
