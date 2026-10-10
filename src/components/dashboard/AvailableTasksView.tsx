import React, { useState } from 'react';
import {
  Search,
  Lock,
  Unlock,
  MapPin,
  Building2,
  FilterX,
  Sparkles
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

  // Filter and prioritize tasks
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = selectedCountry === 'All countries' || task.country === selectedCountry;
      const matchesCategory = selectedCategory === 'All categories' || task.category === selectedCategory;
      return matchesSearch && matchesCountry && matchesCategory;
    })
    .sort((a, b) => {
      // Prioritize operating country tasks to the top if set
      if (account.operatingCountry) {
        const aIsHome = a.country === account.operatingCountry;
        const bIsHome = b.country === account.operatingCountry;
        if (aIsHome && !bIsHome) return -1;
        if (!aIsHome && bIsHome) return 1;
      }
      return b.reward - a.reward;
    });

  const isFiltered = searchTerm !== '' || selectedCountry !== 'All countries' || selectedCategory !== 'All categories';

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCountry('All countries');
    setSelectedCategory('All categories');
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Available tasks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          One review per verified business. Only businesses inside your plan's countries can be submitted.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              aria-label="Search businesses by name or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search businesses by name or city"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8] bg-white transition-colors"
            />
          </div>

          {/* Country Filter */}
          <div className="w-full md:w-52">
            <select
              aria-label="Filter by country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8] bg-white cursor-pointer transition-colors"
            >
              <option value="All countries">All countries</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Global Remote">Global Remote</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-52">
            <select
              aria-label="Filter by business category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1D4ED8] bg-white cursor-pointer transition-colors"
            >
              <option value="All categories">All categories</option>
              <option value="Restaurants & Food">Restaurants & Food</option>
              <option value="Auto Services">Auto Services</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Hotels & Travel">Hotels & Travel</option>
              <option value="Electronics & Repairs">Electronics & Repairs</option>
              <option value="Software & FinTech">Software & FinTech</option>
            </select>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              <FilterX className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Status subtext */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            {!account.isSubscribed ? (
              <span>Plan required to submit reviews. <strong>{filteredTasks.length}</strong> tasks available in database.</span>
            ) : (
              <span className="text-emerald-700 font-medium">Your plan is active. You can claim and write reviews for tasks in your unlocked territory.</span>
            )}
          </span>
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
            Showing {filteredTasks.length} of {tasks.length}
          </span>
        </div>
      </div>

      {/* Task List Items */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No tasks match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your search terms, selecting a different country, or clearing your category filter.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1a44bc] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isLocal = account.operatingCountry && task.country === account.operatingCountry;

            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base">
                      {task.businessName}
                    </h3>
                  </div>

                  {/* Clean unboxed metadata discipline */}
                  <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{task.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{task.location}</span>
                    </span>
                    {isLocal && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-semibold">Your Territory</span>
                      </>
                    )}
                    {!account.isSubscribed && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400">Subscription Required</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1">
                    {task.description}
                  </p>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-xl font-extrabold text-[#1D4ED8] font-mono tabular-nums">
                      ${task.reward.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-sans">USD per review</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!account.isSubscribed) {
                        onOpenPlans();
                      } else {
                        onSelectTask(task);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
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
            );
          })}
        </div>
      )}

    </div>
  );
};
