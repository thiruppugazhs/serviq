import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService, ServiceItem } from '../../services/driverService';
import { ArrowLeft, Wrench, Filter, Clock, Disc } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'current' | 'previous'>('current');
  const [currentServices, setCurrentServices] = useState<ServiceItem[]>([]);
  const [previousServices, setPreviousServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    setCurrentServices(driverService.getServices('current'));
    setPreviousServices(driverService.getServices('previous'));
  }, []);

  const items = activeTab === 'current' ? currentServices : previousServices;

  const getServiceIcon = (index: number) => {
    if (index % 4 === 0) return { icon: Wrench, bg: 'bg-emerald-50 text-emerald-600' };
    if (index % 4 === 1) return { icon: Filter, bg: 'bg-emerald-50 text-emerald-600' };
    if (index % 4 === 2) return { icon: Clock, bg: 'bg-blue-50 text-[#1b72e8]' };
    return { icon: Disc, bg: 'bg-emerald-50 text-emerald-700' };
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={() => navigate('/home')}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Services</h1>
      </div>

      {/* Tabs and Add Service Button */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('current')}
            className={`pb-2.5 text-xs font-bold transition relative ${
              activeTab === 'current' ? 'text-[#1b72e8]' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Current Services
            {activeTab === 'current' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1b72e8] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className={`pb-2.5 text-xs font-bold transition relative ${
              activeTab === 'previous' ? 'text-[#1b72e8]' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Previous Services
            {activeTab === 'previous' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1b72e8] rounded-full" />
            )}
          </button>
        </div>

        <button
          onClick={() => navigate('/service/request')}
          className="mb-1.5 px-3 py-1 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-95 text-white text-xs font-semibold rounded-lg shadow-xs transition"
        >
          Add Service
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-3 pt-1">
        {items.map((item, idx) => {
          const { icon: ItemIcon, bg } = getServiceIcon(idx);
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
                  <span className="text-[11px] text-slate-500 block mt-0.5">{item.date}</span>
                  <span className="text-[10px] text-slate-400 block">{item.scheduledDate}</span>
                </div>
              </div>

              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-blue-50 text-[#1b72e8] border border-blue-200/60'
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
            No service records found in this category.
          </div>
        )}
      </div>
    </div>
  );
};
