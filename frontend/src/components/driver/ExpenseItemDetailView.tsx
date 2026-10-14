import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { driverService, ExpenseItem } from '../../services/driverService';
import { ArrowLeft, Wrench, Plus, Calendar, Tag, DollarSign } from 'lucide-react';

export const ExpenseItemDetailView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<ExpenseItem | null>(null);
  const [activeTab, setActiveTab] = useState<'logs' | 'details'>('logs');

  useEffect(() => {
    if (id) {
      const found = driverService.getExpenseItem(id);
      if (found) {
        setItem(found);
      } else {
        navigate('/expense', { replace: true });
      }
    }
  }, [id, navigate]);

  if (!item) return null;

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={() => navigate('/expense')}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Service / Maintenance Expense</h1>
      </div>

      {/* Item Summary Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-[#1b72e8] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Wrench className="w-5 h-5 stroke-[2.2px]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-tight">{item.title}</h2>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#1b72e8] border border-blue-200/50">
            {item.category === 'Services' ? 'Service' : item.category}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-2.5 text-xs font-bold transition relative ${
            activeTab === 'logs' ? 'text-[#1b72e8]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Expense Logs
          {activeTab === 'logs' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1b72e8] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-2.5 text-xs font-bold transition relative ${
            activeTab === 'details' ? 'text-[#1b72e8]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Details
          {activeTab === 'details' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1b72e8] rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'logs' ? (
        <div className="space-y-3 pt-1">
          {item.logs && item.logs.length > 0 ? (
            item.logs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">{log.date}</span>
                  <h3 className="text-xs font-bold text-slate-800 mt-0.5 leading-snug">{log.description}</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-slate-900">${log.amount.toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No expense logs recorded for this item yet.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Category</span>
            <span className="font-semibold text-slate-800">{item.category}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Primary Date</span>
            <span className="font-semibold text-slate-800">{item.date}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Cumulative Expenses</span>
            <span className="font-bold text-slate-900 text-base mt-0.5 block">
              ${item.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Bottom Add Expense Button */}
      <div className="pt-3">
        <button
          onClick={() => navigate(`/expense/add/${item.id}`)}
          className="w-full py-3.5 px-4 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition shadow-md shadow-[#1b72e8]/20 flex items-center justify-center gap-1.5"
        >
          <span>Add Expense</span>
        </button>
      </div>
    </div>
  );
};
