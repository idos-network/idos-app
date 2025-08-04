import { notabankKycRoute } from '@/routes/NotaBank';
import { useLoaderData } from '@tanstack/react-router';

export default function Kyc() {
  const { url } = useLoaderData({ from: notabankKycRoute.id });
  return (
    <div>
      <iframe src={url} className="w-full" style={{ height: '85vh' }} />
    </div>
  );
}
