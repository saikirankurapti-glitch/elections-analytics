import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  CheckCircle2,
  MapPin,
  Vote,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UpAssemblyConstituency } from '../../services/providers/types';
import { formatIndianNumber, formatPercent } from '../../utils/formatters';
import { StatusBadge } from './StatusBadge';

interface UpConstituencyTableProps {
  constituencies: UpAssemblyConstituency[];
  onSelectConstituency: (ac: UpAssemblyConstituency) => void;
  selectedAcNumber?: number | null;
  onExportCsv?: () => void;
  districtFilter: string;
  onDistrictFilterChange: (district: string) => void;
  districtsList: string[];
}

export const UpConstituencyTable: React.FC<UpConstituencyTableProps> = ({
  constituencies,
  onSelectConstituency,
  selectedAcNumber,
  onExportCsv,
  districtFilter,
  onDistrictFilterChange,
  districtsList
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'constituencyNumber' | 'name' | 'district' | 'reach' | 'calls' | 'engagement'>('constituencyNumber');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredConstituencies = useMemo(() => {
    let list = [...constituencies];

    if (districtFilter && districtFilter !== 'ALL') {
      list = list.filter(c => c.district.toLowerCase() === districtFilter.toLowerCase());
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase().trim();
      const numQuery = Number(q.replace(/\D/g, ''));

      list = list.filter(c => {
        const matchName = c.name.toLowerCase().includes(q);
        const matchDistrict = c.district.toLowerCase().includes(q);
        const matchPC = c.parliamentaryConstituency.toLowerCase().includes(q);
        const matchNo = !isNaN(numQuery) && numQuery > 0 && c.constituencyNumber === numQuery;
        return matchName || matchDistrict || matchPC || matchNo;
      });
    }

    list.sort((a, b) => {
      let aVal: any = a[sortField as keyof UpAssemblyConstituency];
      let bVal: any = b[sortField as keyof UpAssemblyConstituency];

      if (sortField === 'reach') {
        aVal = a.campaignOperations.reach;
        bVal = b.campaignOperations.reach;
      } else if (sortField === 'calls') {
        aVal = a.campaignOperations.totalCalls;
        bVal = b.campaignOperations.totalCalls;
      } else if (sortField === 'engagement') {
        aVal = a.campaignOperations.engagementRate;
        bVal = b.campaignOperations.engagementRate;
      }

      if (typeof aVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

    return list;
  }, [constituencies, districtFilter, searchTerm, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredConstituencies.length / pageSize);
  const paginatedList = filteredConstituencies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'constituencyNumber');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-subtle overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-navy-900">
              Uttar Pradesh Assembly Constituencies Registry
            </h3>
            <span className="text-xs bg-navy-50 text-navy-900 font-bold px-2 py-0.5 rounded-full border border-navy-200">
              {filteredConstituencies.length} / 403 Constituencies
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Click any constituency to zoom map and inspect localized electoral and campaign intelligence
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search AC #, Name (e.g. 174 Lucknow Central)..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-navy-900 w-64"
            />
          </div>

          {/* District Dropdown (All 75 UP Districts) */}
          <select
            aria-label="Filter by District"
            value={districtFilter}
            onChange={e => {
              onDistrictFilterChange(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-navy-900 font-medium focus:outline-none cursor-pointer max-w-[180px] truncate"
          >
            <option value="ALL">All 75 UP Districts</option>
            {districtsList.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-md text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table (Section 25 specs) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-txt-secondary select-none">
            <tr>
              <th
                onClick={() => handleSort('constituencyNumber')}
                className="py-3 px-4 cursor-pointer hover:text-navy-900"
              >
                <div className="flex items-center gap-1">
                  <span>AC No</span>
                  {sortField === 'constituencyNumber' &&
                    (sortAsc ? <ChevronUp className="w-3 h-3 text-saffron" /> : <ChevronDown className="w-3 h-3 text-saffron" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-4 cursor-pointer hover:text-navy-900"
              >
                <div className="flex items-center gap-1">
                  <span>Constituency</span>
                  {sortField === 'name' &&
                    (sortAsc ? <ChevronUp className="w-3 h-3 text-saffron" /> : <ChevronDown className="w-3 h-3 text-saffron" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('district')}
                className="py-3 px-3 cursor-pointer hover:text-navy-900"
              >
                <div className="flex items-center gap-1">
                  <span>District</span>
                  {sortField === 'district' &&
                    (sortAsc ? <ChevronUp className="w-3 h-3 text-saffron" /> : <ChevronDown className="w-3 h-3 text-saffron" />)}
                </div>
              </th>
              <th className="py-3 px-3 text-center">Campaigns</th>
              <th
                onClick={() => handleSort('reach')}
                className="py-3 px-3 text-right cursor-pointer hover:text-navy-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Reach (Demo)</span>
                  {sortField === 'reach' &&
                    (sortAsc ? <ChevronUp className="w-3 h-3 text-saffron" /> : <ChevronDown className="w-3 h-3 text-saffron" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('calls')}
                className="py-3 px-3 text-right cursor-pointer hover:text-navy-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Calls (Demo)</span>
                  {sortField === 'calls' &&
                    (sortAsc ? <ChevronUp className="w-3 h-3 text-saffron" /> : <ChevronDown className="w-3 h-3 text-saffron" />)}
                </div>
              </th>
              <th className="py-3 px-3 text-right">WhatsApp</th>
              <th
                onClick={() => handleSort('engagement')}
                className="py-3 px-3 text-right cursor-pointer hover:text-navy-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Engagement</span>
                  {sortField === 'engagement' &&
                    (sortAsc ? <ChevronUp className="w-3 h-3 text-saffron" /> : <ChevronDown className="w-3 h-3 text-saffron" />)}
                </div>
              </th>
              <th className="py-3 px-3 text-center">ECI Electors</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedList.map(c => {
              const isSelected = selectedAcNumber === c.constituencyNumber;
              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectConstituency(c)}
                  className={`cursor-pointer transition-colors group ${
                    isSelected ? 'bg-saffron-50/70 border-l-4 border-l-saffron' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-navy-900 tabular-nums">
                    #{c.constituencyNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-navy-900 group-hover:text-saffron-700 transition-colors">
                      {c.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {c.reservedCategory === 'GEN' ? 'General' : c.reservedCategory} • {c.parliamentaryConstituency} PC
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">
                    {c.district}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 font-bold text-navy-900 text-xs">
                      {c.campaignOperations.campaignsCount}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-navy-900 tabular-nums">
                    {formatIndianNumber(c.campaignOperations.reach)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 tabular-nums">
                    <div>{formatIndianNumber(c.campaignOperations.totalCalls)}</div>
                    <div className="text-[10px] text-igreen font-medium">
                      {formatIndianNumber(c.campaignOperations.connectedCalls)} Conn.
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 tabular-nums">
                    {formatIndianNumber(c.campaignOperations.whatsappMessages)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-igreen tabular-nums">
                    {formatPercent(c.campaignOperations.engagementRate)}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600 tabular-nums">
                    {formatIndianNumber(c.electionInfo.electors)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={c.campaignOperations.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSelectConstituency(c);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-navy-900 bg-slate-100 hover:bg-navy-900 hover:text-white rounded transition-colors inline-flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-txt-secondary">
        <div>
          Showing{' '}
          <strong className="text-navy-900">
            {Math.min((currentPage - 1) * pageSize + 1, filteredConstituencies.length)}
          </strong>{' '}
          to{' '}
          <strong className="text-navy-900">
            {Math.min(currentPage * pageSize, filteredConstituencies.length)}
          </strong>{' '}
          of <strong className="text-navy-900">{filteredConstituencies.length}</strong> constituencies
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-navy-900 disabled:opacity-40 hover:bg-slate-100 transition-colors"
          >
            Previous
          </button>
          <span className="px-2 text-xs font-medium text-slate-700">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-navy-900 disabled:opacity-40 hover:bg-slate-100 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
