export async function getKrakenUrl() {
  const response = await fetch(
    'https://neobank-idos.vercel.app/api/kyc/link?type=persona',
  ).then((res) => res.json());
  return response.url;
}
