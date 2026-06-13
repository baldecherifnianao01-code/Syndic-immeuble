import React, { useState } from 'react';
import { useSyndic } from '../context/SyndicContext';
import { 
  Building, Users, AlertTriangle, Calendar, Wallet, 
  Megaphone, ArrowRight, CheckCircle2, TrendingUp, Plus, Clock 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { 
    building, 
    coOwners, 
    units, 
    expenses, 
    meetings, 
    incidents, 
    announcements, 
    budget,
    launchFeeCall
  } = useSyndic();

  // State for simple quick fee-call simulation
  const [feeAmount, setFeeAmount] = useState<string>('5000');
  const [feeTitle, setFeeTitle] = useState<string>('Provision pour travaux de façade');
  const [showFeeSuccess, setShowFeeSuccess] = useState(false);

  // Derive computations
  const totalAllocated = budget.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalSpent = budget.reduce((acc, curr) => acc + curr.spent, 0);
  const budgetPercentage = Math.round((totalSpent / totalAllocated) * 100);

  // Total co-owners outstanding arrears (positive balances indicate owing the syndic)
  const totalOwedByOwners = coOwners
    .filter(co => co.balance > 0)
    .reduce((acc, curr) => acc + curr.balance, 0);

  // Active tickets
  const activeIncidents = incidents.filter(inc => inc.status !== 'resolved');

  // Next upcoming assembly
  const upcomingMeeting = meetings.find(m => m.status === 'upcoming');

  const getStatusLabelInFrench = (stat: string) => {
    switch (stat) {
      case 'new': return 'Nouveau';
      case 'investigating': return 'Diagnostic';
      case 'scheduled': return 'Pris en charge';
      case 'in_progress': return 'En cours';
      case 'resolved': return 'Résolu';
      default: return stat;
    }
  };

  const handleLaunchFee = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(feeAmount);
    if (isNaN(parsed) || parsed <= 0 || !feeTitle) return;
    
    launchFeeCall(parsed, feeTitle);
    setShowFeeSuccess(true);
    setTimeout(() => {
      setShowFeeSuccess(false);
      setFeeAmount('5000');
      setFeeTitle('Provision pour travaux de façade');
    }, 4000);
  };

  // Preview calculation based on lots to show to user inside panel
  const previewFees = () => {
    const val = parseFloat(feeAmount) || 0;
    if (val <= 0) return [];

    // Group shares by co-owner
    const ownerShares: { [ownerId: string]: number } = {};
    units.forEach(u => {
      ownerShares[u.coOwnerId] = (ownerShares[u.coOwnerId] || 0) + u.shares;
    });

    return coOwners.map(co => {
      const shares = ownerShares[co.id] || 0;
      const amount = (val * shares) / 1000;
      return {
        name: `${co.firstName} ${co.lastName}`,
        shares,
        amount: Math.round(amount * 100) / 100
      };
    }).filter(p => p.shares > 0).sort((a, b) => b.shares - a.shares);
  };

  return (
    <div className="space-y-6" id="dashboard-container">
      
      {/* Bento Grid Header / Welcome Board */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4.5">
          <div className="p-3 bg-indigo-50/80 text-indigo-600 rounded-2xl">
            <Building className="h-8 w-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest block mb-0.5">ESPACE SYNDIC CONNECTÉ</span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{building.name}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{building.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-600 border-l border-slate-100 pl-0 md:pl-8">
          <div>
            <span className="block font-bold text-slate-900 text-base">{building.unitsCount} Lots</span>
            <span className="text-[11px] text-slate-400 font-medium">Gestion Active</span>
          </div>
          <div>
            <span className="block font-bold text-slate-900 text-base">Année {building.constructionYear}</span>
            <span className="text-[11px] text-slate-400 font-medium">Bâtiment Évalué</span>
          </div>
        </div>
      </div>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">

        {/* 1. Large 2x2: Financial Overview Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 block">État de la Trésorerie</span>
                <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{(totalAllocated - totalSpent).toLocaleString('fr-FR')} €</div>
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-3.5 py-1 rounded-full text-xs font-bold">
                +{budgetPercentage}% Consommé
              </div>
            </div>

            {/* Custom Interactive visual bars matching the bento design */}
            <div className="space-y-6">
              <div className="flex items-end gap-2.5 h-32 pt-4">
                {budget.map((b, idx) => {
                  const percent = Math.min(Math.round((b.spent / b.allocated) * 100), 100);
                  const colors = [
                    'bg-indigo-500',
                    'bg-sky-500',
                    'bg-slate-300',
                    'bg-amber-500',
                    'bg-emerald-500',
                    'bg-indigo-400',
                    'bg-rose-500'
                  ];
                  const barColor = colors[idx % colors.length];
                  return (
                    <div key={b.id} className="flex-1 flex flex-col items-center h-full group relative">
                      <div className="w-full bg-slate-50 hover:bg-slate-100 rounded-t-lg transition-colors h-full flex items-end overflow-hidden">
                        <div 
                          className={`w-full rounded-t-sm ${barColor} transition-all duration-500`}
                          style={{ height: `${percent || 10}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 mt-1.5 truncate w-full text-center" title={b.name}>
                        {b.name.slice(0, 3)}.
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6 mt-6">
            <div>
              <div className="text-xs text-slate-400 font-medium mb-0.5">Budget Restant</div>
              <div className="text-lg font-bold text-emerald-600">{(totalAllocated - totalSpent).toLocaleString('fr-FR')} €</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium mb-0.5">Budget Total Prévu</div>
              <div className="text-lg font-bold text-slate-800">{totalAllocated.toLocaleString('fr-FR')} €</div>
            </div>
          </div>
        </div>

        {/* 2. Medium 1x2: Active Maintenance Incidents Card */}
        <div className="col-span-1 row-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-slate-800 text-sm font-extrabold uppercase tracking-wide">Incidents prioritaires</h3>
            <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{activeIncidents.length} actifs</span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
            {activeIncidents.length > 0 ? (
              activeIncidents.slice(0, 3).map((inc) => {
                const isCritical = inc.priority === 'critical' || inc.priority === 'high';
                return (
                  <div key={inc.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      <span className={`text-[10px] font-bold uppercase ${isCritical ? 'text-rose-600' : 'text-amber-600'}`}>
                        {inc.priority === 'critical' ? 'Urgent critique' : getStatusLabelInFrench(inc.status)}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">{inc.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{inc.reportedBy.split(' (')[0]}</div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center text-center p-4">
                <p className="text-xs text-slate-400 italic">Tous les incidents résolus ou classés !</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Small 1x1: Building Quick Stats (Indigo highlight card) */}
        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 min-h-[160px]">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-indigo-100">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-3xl font-extrabold tracking-tight">{building.unitsCount} Lots</div>
            <div className="text-xs text-indigo-100 font-medium">Unités d'habitation enregistrées</div>
          </div>
        </div>

        {/* 4. Small 1x1: Next assembly information card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[160px]">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Prochaine AG</div>
          <div>
            {upcomingMeeting ? (
              <>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {new Date(upcomingMeeting.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{upcomingMeeting.time} • Salon Virtuel</div>
              </>
            ) : (
              <div className="text-sm font-semibold text-slate-400">Pas d'AG programmée</div>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-1.5 w-[85%] bg-emerald-500 rounded-full" />
            </div>
            <div className="text-[10px] text-slate-400 font-medium">85% des millièmes émargés</div>
          </div>
        </div>

        {/* 5. Wide 2x1: Interactive quick actions & fee-call simulator in elegant dark theme style */}
        <div className="col-span-1 md:col-span-2 bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-lg space-y-4 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase block">Module SaaS Administrateur</span>
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <Plus className="h-4.5 w-4.5 text-indigo-400 bg-indigo-500/10 p-0.5 rounded" />
                Appel de charges rapide
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2.5 py-0.5 rounded-full">Automatique ‰</span>
          </div>

          {showFeeSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-300 text-xs flex gap-3 items-start"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-400 text-sm">Appel de fonds publié !</h4>
                <p className="mt-1 leading-relaxed text-[11px] text-emerald-300/95">
                  Les soldes des copropriétaires ont été recalculés selon la clé de répartition officielle de l'immeuble (millièmes). Un avis d'information a été affiché.
                </p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleLaunchFee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Intitulé de l'appel</label>
                  <input 
                    type="text" 
                    value={feeTitle}
                    onChange={(e) => setFeeTitle(e.target.value)}
                    placeholder="e.g. Provision chauffage d'hiver"
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Montant global (€)</label>
                  <input 
                    type="number" 
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    min="1"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all mt-4"
                >
                  <span>Émettre les appels</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Real-time simulation preview in form */}
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800/60 flex flex-col justify-between max-h-[160px]">
                <div className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider mb-1">
                  Aperçu Répartition Millièmes
                </div>
                <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
                  {previewFees().slice(0, 3).map((p, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-slate-300">
                      <span className="truncate max-w-[100px] font-medium">{p.name}</span>
                      <span className="font-bold text-white text-xs">{p.amount.toFixed(2)} €</span>
                    </div>
                  ))}
                  {previewFees().length > 3 && (
                    <div className="text-[9px] text-slate-500 italic">Et {previewFees().length - 3} autres copropriétaires...</div>
                  )}
                </div>
                <div className="text-[9px] text-slate-400 pt-1.5 border-t border-slate-800/60">
                  Calculé automatiquement au prorata.
                </div>
              </div>
            </form>
          )}
        </div>

        {/* 6. Recent Activity & File board (Vertical 1x1 list) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs hover:shadow-md transition-all duration-300">
          <h3 className="text-slate-800 font-extrabold text-xs uppercase tracking-wider mb-4">Fichiers récents</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 font-bold text-[10px]">PDF</div>
              <div className="text-[11px] font-semibold text-slate-700 truncate">PV_AG_2026.pdf</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-[10px]">XLS</div>
              <div className="text-[11px] font-semibold text-slate-700 truncate">Budget_Prév_Q2.xls</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-[10px]">IMG</div>
              <div className="text-[11px] font-semibold text-slate-700 truncate">Diagnostic_Façade.jpg</div>
            </div>
          </div>
        </div>

        {/* 7. Quick Message Hub Block */}
        <div className="bg-indigo-50/70 rounded-3xl p-6 border border-indigo-100/50 shadow-2xs flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-center">
            <h3 className="text-indigo-950 font-extrabold text-xs uppercase tracking-wide">Messagerie</h3>
            <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">2</span>
          </div>
          <div className="text-[11px] text-indigo-800 italic leading-relaxed my-2">
            "Mme. Leroux a posé une question sur le nouveau calendrier des encombrants."
          </div>
          <div className="text-[9px] text-indigo-500 font-bold uppercase tracking-wider">
            Conseil actif • Réponse prête
          </div>
        </div>

      </div>

      {/* Announcements Panel & Budget Breakdown block container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Digital Announcements board (col-span-7) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-indigo-600 animate-none" />
              <h2 className="text-lg font-bold text-slate-900">Tableau d'Affichage Digital</h2>
            </div>
            <span className="text-[10px] text-indigo-600 font-bold px-2.5 py-1 rounded bg-indigo-50 uppercase tracking-widest">Connecté</span>
          </div>

          <div className="space-y-4">
            {announcements.slice(0, 2).map((ann) => (
              <div 
                key={ann.id} 
                className={`p-4.5 rounded-2xl border ${ann.pinned ? 'bg-amber-50/40 border-amber-100' : 'bg-slate-50/50 border-slate-100'} transition-all`}
              >
                <div className="flex items-center justify-between pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      ann.category === 'alert' ? 'bg-rose-100 text-rose-800' :
                      ann.category === 'maintenance' ? 'bg-amber-100 text-amber-800' :
                      ann.category === 'info' ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {ann.category === 'alert' ? 'Urgent' :
                       ann.category === 'maintenance' ? 'Bâtiment' :
                       ann.category === 'info' ? 'Annonce' : 'Événement'}
                    </span>
                    {ann.pinned && (
                      <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">Épinglé</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Le {new Date(ann.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{ann.title}</h4>
                <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Consommation Budgétaire (col-span-5) */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Consommation Budgétaire</h2>
          <div className="space-y-4">
            {budget.map((b) => {
              const per = Math.round((b.spent / b.allocated) * 100);
              return (
                <div key={b.id} className="p-4 rounded-2xl bg-slate-50/40 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-start text-xs">
                    <span className="font-bold text-slate-800 truncate block max-w-[170px]">{b.name}</span>
                    <span className={`font-bold text-xs ${per > 95 ? 'text-rose-600' : 'text-indigo-600'}`}>{per}%</span>
                  </div>
                  <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${per > 95 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                      style={{ width: `${Math.min(per, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Payé : {b.spent.toLocaleString('fr-FR')} €</span>
                    <span>Alloué : {b.allocated.toLocaleString('fr-FR')} €</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
