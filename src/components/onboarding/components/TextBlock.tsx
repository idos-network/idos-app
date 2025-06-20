export default function TextBlock({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <p className="self-stretch text-center justify-start text-neutral-50 text-3xl font-semibold font-['Urbanist']">
        {title}
      </p>
      <p className="self-stretch text-center justify-start text-neutral-300 text-md font-light font-['Urbanist']">
        {subtitle}
      </p>
    </div>
  );
}
