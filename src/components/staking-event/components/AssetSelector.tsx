import ArrowIcon from '@/icons/arrow';
import type { StakingAsset } from '@/interfaces/staking-event';
import { useEffect, useRef, useState } from 'react';

interface AssetSelectorProps {
  assets: StakingAsset[];
  selectedAsset: string;
  onAssetChange: (asset: string) => void;
}

export function AssetSelector({
  assets,
  selectedAsset,
  onAssetChange,
}: AssetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedAssetData =
    assets.find((asset) => asset.name === selectedAsset) || assets[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAssetSelect = (asset: string) => {
    onAssetChange(asset);
    setIsOpen(false);
  };

  const AssetDisplay = ({
    asset,
    className,
  }: {
    asset: StakingAsset;
    className?: string;
  }) => (
    <div className={`flex items-center justify-between w-full ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={asset.icon}
            alt="ETH"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-white font-light text-xl">{asset.name}</span>
      </div>
      <div className="flex text-[13px] font-['Inter'] font-light items-center justify-center h-[25px] px-[6px] rounded-sm bg-[#00624D99] text-aquamarine-400 leading-none">
        {asset.apy}% APY
      </div>
    </div>
  );

  return (
    <div ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full h-14 px-4 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-all"
        >
          <AssetDisplay asset={selectedAssetData} />
          <ArrowIcon
            className={`size-3 text-neutral-400 transition-transform ml-5 ${isOpen ? '-scale-y-100' : ''}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 bg-neutral-800 rounded-2xl overflow-hidden">
          {assets.map((asset, index) => (
            <button
              key={asset.name}
              onClick={() => handleAssetSelect(asset.name)}
              className={`w-full px-4 transition-all ${
                index === 0
                  ? 'rounded-t-2xl'
                  : index === assets.length - 1
                    ? 'rounded-b-2xl'
                    : ''
              } ${
                asset.name === selectedAsset
                  ? 'bg-neutral-700/70'
                  : 'hover:bg-neutral-700'
              }`}
            >
              <AssetDisplay className={'h-13'} asset={asset} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
