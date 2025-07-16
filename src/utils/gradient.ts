function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

export function addressGradient(address: string): string {
  const color1 = stringToColor(address.slice(0, 6));
  const color2 = stringToColor(address.slice(-6));
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}
