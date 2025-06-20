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
