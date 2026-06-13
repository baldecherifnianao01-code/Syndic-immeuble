import React, { useState } from 'react';
import { SyndicProvider, useSyndic } from './context/SyndicContext';
import Dashboard from './components/Dashboard';
import CoOwners from './components/CoOwners';
import Finances from './components/Finances';
import Meetings from './components/Meetings';
import Tickets from './components/Tickets';
import NoticeBoard from './components/NoticeBoard';

import { 
  Building, Users, TrendingUp, Scale, Wrench, 
  Megaphone, RefreshCw, Layers, Shield, User, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function DashboardShell() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'coowners' | 'finances' | 'meetings' | 'tickets' | 'notices'>('dashboard');
  const { building, resetAll } = useSyndic();

  const handleReset = () => {
    if (window.confirm("Voulez-vous réinitialiser l'ensemble des données de démonstration de la copropriété ?")) {
      resetAll();
      window.location.reload();
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Layers },
    { id: 'coowners', label: 'Copropriétaires', icon: Users },
    { id: 'finances', label: 'Finances & Comptabilité', icon: TrendingUp },
    { id: 'meetings', label: 'Assemblées Générales', icon: Scale },
    { id: 'tickets', label: 'Support & Interventions', icon: Wrench },
    { id: 'notices', label: 'Affiches & Documents', icon: Megaphone },
  ] as const;

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'coowners': return <CoOwners />;
      case 'finances': return <Finances />;
      case 'meetings': return <Meetings />;
      case 'tickets': return <Tickets />;
      case 'notices': return <NoticeBoard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row antialiased font-sans text-slate-900" id="applet-shell">
      
      {/* Navigation Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 shrink-0 flex flex-col border-r border-slate-800">
        
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white text-base">S</div>
          <span className="text-white font-bold text-lg tracking-tight">SyndicFlow</span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-6 px-4 space-y-1.5" id="primary-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer text-left ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Expert Mode / Technical Quota stats container from template */}
        <div className="px-6 py-4">
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Quota Données</div>
            <div className="h-1.5 w-full bg-slate-700 rounded-full mb-2.5 overflow-hidden">
              <div className="h-1.5 w-3/4 bg-indigo-400 rounded-full"></div>
            </div>
            <div className="text-[11px] text-white font-medium">12/15 lots actifs</div>
          </div>
        </div>

        {/* Sidebar Footer and resetting engine */}
        <div className="p-6 border-t border-slate-800 space-y-3">
          <button
            type="button"
            onClick={handleReset}
            className="w-full flex items-center gap-2.5 justify-center px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider font-bold text-rose-400 hover:bg-rose-500/10 transition-colors border border-rose-900/40 cursor-pointer bg-slate-800/20"
            title="Réinitialiser l'état de la démonstration locale"
          >
            <RefreshCw className="h-3.5 w-3.5 animate-none" />
            <span>Remettre à Zéro</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          
          {/* Section trace indicator */}
          <div className="flex items-center gap-3">
            <h2 className="text-slate-800 font-semibold text-sm truncate max-w-xs md:max-w-none">{building.name}</h2>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Actif</span>
          </div>

          {/* User badge and simulated info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-semibold text-slate-800">Jean Dupont</div>
                <div className="text-xs text-slate-400">Conseiller Syndical</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-xs overflow-hidden flex items-center justify-center font-bold text-sm text-indigo-600">
                JD
              </div>
            </div>
          </div>

        </header>

        {/* Dynamic Panel Canvas */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {renderActiveComponent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Humble, clean professional footer */}
        <footer className="h-10 bg-white border-t border-slate-100 flex items-center justify-between px-6 text-[10px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} SyndicManager SaaS • Version Démo Professionnelle</span>
          <span className="font-semibold flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Serveur Local Actif (Port 3000)</span>
        </footer>

      </div>

    </div>
  );
}

export default function App() {
  return (
    <SyndicProvider>
      <DashboardShell />
    </SyndicProvider>
  );
}
