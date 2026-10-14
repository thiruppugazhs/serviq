import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService, MaintenanceItem } from '../../services/driverService';
import { ArrowLeft, Wrench, Clock, CheckCircle2, RotateCcw, Filter } from 'lucide-react';

export const MaintenanceView: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'current' | 'previous'>('current');
  const [currentItems, setCurrentItems] = useState<MaintenanceItem[]>([]);
  const [prevItems, setPrevItems] = useState<MaintenanceItem[]>([]);

  useEffect(() => {
    setCurrentItems(driverService.getMaintenance('current'));
    setPrevItems(driverService.getMaintenance('previous'));
  }, []);

  const items = activeTab === 'current' ? currentItems : prevItems;

  const getItemIcon = (index: number) => {
    if (index % 4 === 0) return { icon: Wrench, bg: 'bg-emerald-50 text-emerald-600' };
    if (index % 4 === 1) return { icon: Clock, bg: 'bg-amber-50 text-amber-600' };
    if (index % 4 === 2) return { icon: RotateCcw, bg: 'bg-blue-50 text-blue-600' };
    return { icon: Filter, bg: 'bg-emerald-50 text-emerald-700' };
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/home')}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Maintenance</h1>
        </div>

        <button
          onClick={() => navigate('/maintenance/request')}
          className="px-3.5 py-1.5 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-95 text-white text-xs font-semibold rounded-lg shadow-xs transition"
        >
          Request Maintenance
        </button>
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex gap-2 p-1 bg-slate-100/70 rounded-xl">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'current'
              ? 'bg-[#1b72e8] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Current ({currentItems.length})
        </button>
        <button
          onClick={() => setActiveTab('previous')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'previous'
              ? 'bg-[#1b72e8] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Previous ({prevItems.length})
        </button>
      </div>

      {/* Maintenance Items List */}
      <div className="space-y-3 pt-1">
        {items.map((item, idx) => {
          const { icon: ItemIcon, bg } = getItemIcon(idx);
          const isPending = item.status === 'Pending';
          const isCompleted = item.status === 'Completed';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-2xs flex items-center justify-between transition hover:border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  <ItemIcon className="w-4 h-4 stroke-[2.2px]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">{item.title}</h3>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{item.dueKmText}</span>
                  <span className="text-[10px] text-slate-400 block">Service Due {item.dueDate}</span>
                </div>
              </div>

              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isCompleted
                      ? 'bg-slate-100 text-slate-600 border border-slate-200'
                      : isPending
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No maintenance records found in this category.
          </div>
        )}
      </div>
    </div>
  );
};
