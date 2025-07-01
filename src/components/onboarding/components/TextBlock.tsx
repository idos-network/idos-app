export default function TextBlock({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5">
      <p className="self-stretch text-center justify-start text-neutral-50 text-4xl font-normal font-['Urbanist']">
        {title}
      </p>
      <p className="self-stretch text-center justify-start text-neutral-300 text-xl font-normal font-['Urbanist']">
        {subtitle}
      </p>
    </div>
  );
}
