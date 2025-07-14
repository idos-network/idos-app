export function timelockToMs(timelock: number): number {
  return timelock * 1000;
}

export function timelockToDate(timelock: number): string {
  const milliseconds = timelockToMs(timelock);

  return new Intl.DateTimeFormat(['en-US'], {
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: true,
  }).format(new Date(milliseconds));
}
