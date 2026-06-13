import React, { useState } from 'react';
import { useSyndic } from '../context/SyndicContext';
import { 
  TrendingUp, Filter, Plus, FileText, CheckCircle, Clock, 
  Database, Printer, ArrowUpRight, DollarSign, Briefcase 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Finances() {
  const { expenses, budget, addExpense } = useSyndic();

  // Filter states
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'pending_approval'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // New Expense form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<any>('maintenance');
  const [provider, setProvider] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [status, setStatus] = useState<'paid' | 'pending_approval'>('paid');

  // Printable layout state
  const [showLedgerReport, setShowLedgerReport] = useState(false);

  // Filters logic
  const filteredExpenses = expenses.filter(exp => {
    const statusMatch = activeFilter === 'all' || exp.status === activeFilter;
    const catMatch = categoryFilter === 'all' || exp.category === categoryFilter;
    return statusMatch && catMatch;
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title || isNaN(parsedAmount) || parsedAmount <= 0 || !provider) return;

    addExpense({
      title,
      amount: parsedAmount,
      category,
      date: new Date().toISOString().split('T')[0],
      status: status as any,
      provider,
      invoiceNumber: invoiceNumber || `FAC-${Date.now().toString().slice(6)}`
    });

    // Reset
    setTitle('');
    setAmount('');
    setCategory('maintenance');
    setProvider('');
    setInvoiceNumber('');
    setStatus('paid');
    setShowAddModal(false);
  };

  const getCategoryLabelInFrench = (cat: string) => {
    switch (cat) {
      case 'maintenance': return 'Entretien & Réparations';
      case 'heating': return 'Énergie & Chauffage';
      case 'water': return 'Consommation d\'Eau';
      case 'insurance': return 'Assurance Immeuble';
      case 'cleaning': return 'Entretien des parties communes';
      case 'admin': return 'Rémunération Syndic';
      case 'works': return 'Chantiers de rénovation';
      default: return cat;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'heating': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'water': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'maintenance': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'insurance': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'cleaning': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'admin': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'works': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6" id="finances-section">
      
      {/* KPI header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Finances & Budgets</h2>
            <p className="text-slate-400 text-xs mt-0.5">Analyser la répartition et saisir les charges de l'année.</p>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto justify-end">
          <button 
            type="button"
            onClick={() => setShowLedgerReport(true)}
            className="border border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-all bg-white"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>Grand Livre des Comptes</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Saisir une Facture</span>
          </button>
        </div>
      </div>

      {/* Grid: main display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left main: Ledger list and filters */}
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
          
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-50 pb-4 mt-1">
            <div className="flex gap-2 p-0.5 bg-slate-100 rounded-lg w-fit">
              <button 
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Toutes ({expenses.length})
              </button>
              <button 
                type="button"
                onClick={() => setActiveFilter('paid')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${activeFilter === 'paid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Payées ({expenses.filter(e => e.status === 'paid').length})
              </button>
              <button 
                type="button"
                onClick={() => setActiveFilter('pending_approval')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${activeFilter === 'pending_approval' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                À Approuver ({expenses.filter(e => e.status === 'pending_approval').length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 focus:outline-hidden cursor-pointer"
              >
                <option value="all">Toutes catégories</option>
                <option value="maintenance">Entretien & Réparations</option>
                <option value="heating">Énergie & Chauffage</option>
                <option value="water">Consommation d'eau</option>
                <option value="insurance">Assurance Immeuble</option>
                <option value="cleaning">Entretien communs</option>
                <option value="works">Chantiers exceptionnels</option>
              </select>
            </div>
          </div>

          {/* Expenses list flow */}
          <div className="space-y-4">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((exp) => (
                <div 
                  key={exp.id} 
                  className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-50 shrink-0 text-slate-600 self-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{exp.title}</h4>
                      <p className="text-slate-400 text-xs mt-0.5">Fournisseur : <span className="text-slate-600 font-medium">{exp.provider}</span> • Réf : #{exp.invoiceNumber}</p>
                      
                      <div className="flex gap-2 mt-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(exp.category)}`}>
                          {getCategoryLabelInFrench(exp.category)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Facturé le {new Date(exp.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50">
                    <div className="text-right">
                      <span className="block font-bold text-slate-900 text-base">{exp.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                      <span className="text-[10px] text-slate-400 block">Tantièmes communs</span>
                    </div>

                    <div>
                      {exp.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                          Payée
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-100">
                          <Clock className="h-3 w-3 text-amber-600" />
                          À Approuver
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs italic bg-slate-50/50 rounded-xl border border-dashed border-slate-100">
                Aucun mouvement comptable ne correspond à ces critères.
              </div>
            )}
          </div>

        </div>

        {/* Right sidebar: Detailed progress */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg space-y-6 text-slate-100 animate-none">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-1">
              <Database className="h-4.5 w-4.5 text-indigo-400 bg-indigo-500/10 p-0.5 rounded" />
              Répartition Budgétaire Global
            </h3>

            <div className="space-y-5">
              {budget.map((b) => {
                const per = Math.round((b.spent / b.allocated) * 100);
                return (
                  <div key={b.id} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-300 block max-w-[130px] truncate">{b.name}</span>
                      <span className="text-[10.5px] font-bold text-white">{b.spent.toLocaleString('fr-FR')} € / {b.allocated.toLocaleString('fr-FR')} €</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${per > 95 ? 'bg-rose-500' : 'bg-indigo-400'}`}
                        style={{ width: `${Math.min(per, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Expense Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100"
          >
            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Enregistrer une Facture</h3>
              <p className="text-xs text-slate-400 mt-1">Saisie d'un justificatif comptable émis par un prestataire.</p>
            </div>
            
            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Intitulé de la prestation / achat</label>
                <input 
                  type="text" 
                  value={title}
                  placeholder="e.g. Remplacement de l'interphone d'entrée"
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Montant (€ TTC)</label>
                  <input 
                    type="number" 
                    value={amount}
                    placeholder="e.g. 480"
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Catégorie budgétaire</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white cursor-pointer"
                  >
                    <option value="maintenance">Entretien & Réparations</option>
                    <option value="heating">Énergie & Chauffage</option>
                    <option value="water">Eau & Assainissement</option>
                    <option value="insurance">Assurance Immeuble</option>
                    <option value="cleaning">Entretien des Communs</option>
                    <option value="admin">Frais de Gestion Administrateur</option>
                    <option value="works">Chantier Exceptionnel</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Prestataire ou Fournisseur</label>
                <input 
                  type="text" 
                  value={provider}
                  placeholder="e.g. SARL Électricité Générale S.O.S"
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Numéro de facture (optionnel)</label>
                  <input 
                    type="text" 
                    value={invoiceNumber}
                    placeholder="e.g. FAC-2026-12"
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">État du règlement</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white cursor-pointer"
                  >
                    <option value="paid">Payée d'avance</option>
                    <option value="pending_approval">Facture en attente d'approbation</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Enregistrer l'écriture
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Ledger printable dialog */}
      {showLedgerReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 printable-dialog"
          >
            <div className="p-6 bg-slate-900 text-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-base">Grand Livre Comptable</h3>
                <p className="text-xs text-slate-400 mt-0.5">Clôture provisoire de l'exercice - Résidence le Grand Horizon</p>
              </div>
              <button 
                type="button"
                className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
                onClick={() => window.print()}
              >
                Imprimer (.PDF)
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-4">
                <div>
                  <span className="block font-bold text-slate-700">ORGANISME CHARGÉ DU SYNDIC :</span>
                  <span className="block text-slate-500 font-semibold mt-1">Syndic Professionnel Mandataire</span>
                  <span className="block text-slate-400">75008 Paris, France</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-slate-700">DATE DE GÉNÉRATION :</span>
                  <span className="block text-slate-500 font-medium mt-1">Le {new Date().toLocaleDateString('fr-FR')}</span>
                  <span className="block text-slate-400">Réf : EXP-2026-CLOT</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Mouvements de Caisse Récapitulés</h4>
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-600">
                      <tr>
                        <th className="p-3">Réf / Date</th>
                        <th className="p-3">Intitulé de l'écriture</th>
                        <th className="p-3">Catégorie</th>
                        <th className="p-3 text-right">Crédit / Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {expenses.map((e) => (
                        <tr key={e.id} className="text-slate-600">
                          <td className="p-3 text-slate-400">#{e.invoiceNumber}</td>
                          <td className="p-3 font-semibold text-slate-800">{e.title}</td>
                          <td className="p-3">{getCategoryLabelInFrench(e.category)}</td>
                          <td className="p-3 text-right font-bold text-slate-950">{e.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-right space-y-1">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total charges ordonnées :</span>
                  <h3 className="text-xl font-extrabold text-slate-900">{expenses.reduce((s, e) => s + e.amount, 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</h3>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowLedgerReport(false)}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Fermer l'aperçu
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
