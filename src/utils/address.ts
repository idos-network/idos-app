export default function truncateAddress(address: string): string {
  if (address.length <= 24) {
    return address;
  }
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}
