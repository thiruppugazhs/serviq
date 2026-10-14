import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService, ExpenseItem } from '../../services/driverService';
import { ArrowLeft, FileText, Wrench, Disc, RotateCcw, Filter, ChevronRight } from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Repairs' | 'Services' | 'Maintenance'>('All');
  const [expenseData, setExpenseData] = useState<{ totalOverall: number; items: ExpenseItem[] }>({
    totalOverall: 0,
    items: [],
  });

  const loadExpenses = () => {
    const data = driverService.getExpenses(activeFilter);
    setExpenseData(data);
  };

  useEffect(() => {
    loadExpenses();
  }, [activeFilter]);

  const filterTabs: Array<'All' | 'Repairs' | 'Services' | 'Maintenance'> = [
    'All',
    'Repairs',
    'Services',
    'Maintenance',
  ];

  const getExpenseIcon = (index: number, category: string) => {
    if (category === 'Services' || index % 4 === 0) {
      return { icon: Wrench, bg: 'bg-emerald-50 text-emerald-600' };
    }
    if (category === 'Repairs' || index % 4 === 1) {
      return { icon: Disc, bg: 'bg-amber-50 text-amber-600' };
    }
    if (index % 4 === 2) {
      return { icon: RotateCcw, bg: 'bg-blue-50 text-[#1b72e8]' };
    }
    return { icon: Filter, bg: 'bg-emerald-50 text-emerald-700' };
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
        <h1 className="text-lg font-bold text-slate-900">Expenses</h1>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 stroke-[2.2px]" />
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block">Total Expenses (All)</span>
          <span className="text-2xl font-black text-slate-900 tracking-tight block mt-0.5">
            $ {expenseData.totalOverall.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 ${
                isActive
                  ? 'bg-[#1b72e8] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Expense Items List */}
      <div className="space-y-3 pt-1">
        {expenseData.items.map((item, idx) => {
          const { icon: ItemIcon, bg } = getExpenseIcon(idx, item.category);

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/expense/item/${item.id}`)}
              className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-2xs flex items-center justify-between transition cursor-pointer hover:border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  <ItemIcon className="w-4 h-4 stroke-[2.2px]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">{item.title}</h3>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{item.subtitle}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  ${item.totalAmount.toLocaleString()}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          );
        })}

        {expenseData.items.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No expenses found under {activeFilter}.
          </div>
        )}
      </div>
    </div>
  );
};
