export default function TextBlock({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string | React.ReactNode;
}) {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5">
      <p className="self-stretch text-center justify-start text-neutral-50 text-4xl font-light font-['Urbanist']">
        {title}
      </p>
      <p className="self-stretch text-center justify-start text-neutral-300 text-xl font-light font-['Urbanist']">
        {subtitle}
      </p>
    </div>
  );
}
