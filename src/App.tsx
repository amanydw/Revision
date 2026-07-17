import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Topics from './pages/Topics';
import Stats from './pages/Stats';
import Systems from './pages/Systems';
import Schedule from './pages/Schedule';
import type { Tab, FilterState } from './types';
import { computeKPIs } from './data/sampleData';

const DEFAULT_FILTERS: FilterState = {
  subject: 'All',
  system: 'All',
  status: 'All',
  difficulty: 'All',
  dateFrom: '',
  dateTo: '',
  search: '',
  sortBy: 'name',
  sortDir: 'asc',
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const kpi = computeKPIs();

  const handleFilterChange = useCallback((partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as Tab);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            filters={filters}
            onTabChange={handleTabChange}
          />
        );
      case 'topics':
        return (
          <Topics
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        );
      case 'stats':
        return (
          <Stats
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        );
      case 'systems':
        return <Systems />;
      case 'schedule':
        return <Schedule />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-slate-50`}>
      {/* Header */}
      <Header
        darkMode={darkMode}
        toggleDark={() => setDarkMode((d) => !d)}
        streak={kpi.streak}
      />

      {/* Page content */}
      <main className="pt-16 pb-24 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
          {renderPage()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default App;
