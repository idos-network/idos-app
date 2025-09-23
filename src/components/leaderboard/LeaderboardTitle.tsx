export function LeaderboardTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex gap-5 items-center">
      <div className="flex text-xl text-neutral-50 font-medium">{title}</div>
      <div className="flex text-base text-neutral-400 font-light pt-0.5">
        {subtitle}
      </div>
    </div>
  );
}
