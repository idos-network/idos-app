export interface LockupPeriod {
  id: string;
  months: number;
  days: number;
  multiplier: number;
  isSelected: boolean;
}

export interface StakingAsset {
  name: string;
  icon: string;
  apy: string;
}
