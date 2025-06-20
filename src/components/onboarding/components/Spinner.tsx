export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div
        className={`animate-spin rounded-full h-30 w-30 border-8 border-aquamarine-950 border-t-aquamarine-400`}
      ></div>
    </div>
  );
}
