import React from 'react';
import { Building2, MapPin, Users, PhoneCall, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { UpDistrictSummary } from '../../services/providers/types';
import { formatIndianNumber, formatPercent } from '../../utils/formatters';

interface DistrictSummaryCardProps {
  district: UpDistrictSummary;
  onSelectDistrict: (districtName: string) => void;
  isActive: boolean;
}

export const DistrictSummaryCard: React.FC<DistrictSummaryCardProps> = ({
  district,
  onSelectDistrict,
  isActive
}) => {
  return (
    <div
      onClick={() => onSelectDistrict(district.district)}
      className={`p-3.5 rounded-lg border cursor-pointer transition-all bg-white shadow-subtle ${
        isActive
          ? 'border-saffron ring-1 ring-saffron bg-saffron-50/20'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-card'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {district.region}
          </span>
          <h4 className="text-sm font-bold text-navy-900 mt-0.5">
            {district.district} District
          </h4>
        </div>
        <span className="text-xs font-bold bg-navy-900 text-white px-2 py-0.5 rounded-full">
          {district.constituencyCount} ACs
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block">Total Reach</span>
          <span className="font-semibold text-navy-900 tabular-nums">
            {formatIndianNumber(district.totalReach)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">Phone Calls</span>
          <span className="font-semibold text-navy-900 tabular-nums">
            {formatIndianNumber(district.totalCalls)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">Avg Eng.</span>
          <span className="font-semibold text-igreen tabular-nums">
            {formatPercent(district.averageEngagementRate)}
          </span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>{formatIndianNumber(district.totalElectors)} Electors</span>
        <span className="text-navy-900 font-semibold inline-flex items-center gap-0.5">
          Filter Map →
        </span>
      </div>
    </div>
  );
};
