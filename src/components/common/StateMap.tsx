import React from 'react';
import { UpStateMap } from './UpStateMap';
import { UpAssemblyConstituency } from '../../services/providers/types';

interface StateMapProps {
  onSelectConstituency?: (id: string) => void;
  selectedId?: string | null;
  heightClass?: string;
  activeDistrict?: string;
}

export const StateMap: React.FC<StateMapProps> = ({
  onSelectConstituency,
  selectedId,
  heightClass = 'h-[500px]',
  activeDistrict
}) => {
  const acNum = selectedId ? Number(selectedId.replace(/\D/g, '')) : null;

  const handleSelect = (ac: UpAssemblyConstituency) => {
    if (onSelectConstituency) {
      onSelectConstituency(ac.id);
    }
  };

  return (
    <UpStateMap
      selectedAcNumber={acNum && !isNaN(acNum) ? acNum : 174}
      onSelectConstituency={handleSelect}
      heightClass={heightClass}
      activeDistrict={activeDistrict}
    />
  );
};
