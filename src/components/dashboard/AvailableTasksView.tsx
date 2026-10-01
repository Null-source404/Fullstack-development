import React, { useState } from 'react';
import {
  Search,
  Lock,
  Unlock,
  MapPin,
  Building2,
  Filter,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { ReviewTask, ReviewerAccount } from '../../types';

interface AvailableTasksViewProps {
  tasks: ReviewTask[];
  account: ReviewerAccount;
  onSelectTask: (task: ReviewTask) => void;
  onOpenPlans: () => void;
}

export const AvailableTasksView: React.FC<AvailableTasksViewProps> = ({
  tasks,
  account,
  onSelectTask,
  onOpenPlans,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All countries');
  const [selectedCategory, setSelectedCategory] = useState('All categories');

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All countries' || task.country === selectedCountry;
    const matchesCategory = selectedCategory === 'All categories' || task.category === selectedCategory;
    return matchesSearch && matchesCountry && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Available tasks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          One review per business. Only businesses inside your plan's countries can be submitted.
        </p>
      </div>

      {/* Filter & Search Bar matching screenshot */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search businesses by name"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8]"
            />
          </div>

          {/* Country Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8] bg-white cursor-pointer"
            >
              <option value="All countries">All countries</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="New Zealand">New Zealand</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8] bg-white cursor-pointer"
            >
              <option value="All categories">All categories</option>
              <option value="Restaurants & Food">Restaurants & Food</option>
              <option value="Auto Services">Auto Services</option>
              <option value="Health & Beauty">Health & Beauty</option>
            </select>
          </div>

          <button
            type="button"
            className="px-5 py-2 bg-[#1D4ED8] hover:bg-[#1a44bc] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* Status subtext */}
        <p className="text-xs text-slate-500 pt-1">
          {!account.isSubscribed ? (
            <span>You have no active plan, so every task is locked. {filteredTasks.length} tasks match your filters.</span>
          ) : (
            <span className="text-emerald-700 font-medium">Your plan is active. You can claim and write reviews for tasks in your unlocked countries.</span>
          )}
        </p>
      </div>

      {/* Task List Items matching Screenshot 7 */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 text-base">
                  {task.businessName}
                </h3>
                <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                  {task.category}
                </span>
                {!account.isSubscribed && (
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Locked
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{task.location}</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Write a review for {task.businessName}</span>
              </div>
            </div>

            <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div>
                <span className="text-xl font-extrabold text-[#1D4ED8]">
                  ${task.reward.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 block sm:text-right">reward</span>
              </div>

              <button
                onClick={() => {
                  if (!account.isSubscribed) {
                    onOpenPlans();
                  } else {
                    onSelectTask(task);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  !account.isSubscribed
                    ? 'border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    : 'bg-[#0D7A6B] hover:bg-[#0a6357] text-white shadow-xs'
                }`}
              >
                {!account.isSubscribed ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Write review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
