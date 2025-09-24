export const STAKING_ASSETS = [
  {
    name: 'ETH',
    icon: '/ethereum.webp',
    apy: '1.5', // TODO: update to final value
  },
  {
    name: 'NEAR',
    icon: '/near.png',
    apy: '2.0', // TODO: update to final value
  },
];

// TODO: update to final values
export const LOCKUP_PERIODS = [
  {
    id: '6-months',
    months: 6,
    days: 1,
    multiplier: 1,
  },
  {
    id: '12-months',
    months: 12,
    days: 2,
    multiplier: 2.5,
  },
  {
    id: '24-months',
    months: 24,
    days: 3,
    multiplier: 6,
  },
];
