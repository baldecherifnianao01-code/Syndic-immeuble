import React, { useState } from 'react';
import { useSyndic } from '../context/SyndicContext';
import { Users, Search, Plus, Filter, Key, CheckCircle, Smartphone, Mail, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

export default function CoOwners() {
  const { coOwners, units, addCoOwner, updateCoOwnerBalance, addUnit } = useSyndic();

  // Filter states
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // New co-owner form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'owner_occupant' | 'landlord' | 'tenant'>('owner_occupant');

  // Simple record payment state
  const [paymentOwnerId, setPaymentOwnerId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Filter logic
  const filteredOwners = coOwners.filter(co => {
    const nameMatch = `${co.firstName} ${co.lastName}`.toLowerCase().includes(search.toLowerCase());
    const emailMatch = co.email.toLowerCase().includes(search.toLowerCase());
    const statusMatch = filterStatus === 'all' || co.status === filterStatus;
    return (nameMatch || emailMatch) && statusMatch;
  });

  // Calculate lots per co-owner
  const getLotsForOwner = (ownerId: string) => {
    return units.filter(u => u.coOwnerId === ownerId);
  };

  const getTantiemesForOwner = (ownerId: string) => {
    return getLotsForOwner(ownerId).reduce((acc, curr) => acc + curr.shares, 0);
  };

  const handleAddCoOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone) return;
    addCoOwner({
      firstName,
      lastName,
      email,
      phone,
      status
    });
    // Reset
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setStatus('owner_occupant');
    setShowAddModal(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    if (!paymentOwnerId || isNaN(amount) || amount <= 0) return;

    // A payment reduces their balance (which is what they owe the syndic)
    updateCoOwnerBalance(paymentOwnerId, -amount);
    setPaymentSuccess(true);
    setPaymentAmount('');
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6" id="coowners-section">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Copropriétaires</h2>
            <p className="text-slate-400 text-xs mt-0.5">Gérer les contacts et les clés de répartition</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full sm:w-auto justify-end">
          <button 
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Copropriétaire</span>
          </button>
        </div>
      </div>

      {/* Grid search + Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: List of families / list with search */}
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher par nom, prénom ou email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            {/* Filter Status Selector */}
            <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-4 bg-slate-50 py-2 sm:py-0">
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-600 focus:outline-hidden cursor-pointer py-2.5"
              >
                <option value="all">Tous les statuts</option>
                <option value="owner_occupant">Copropriétaire Occupant</option>
                <option value="landlord">Bailleur Mandant</option>
                <option value="tenant">Locataires Simple</option>
              </select>
            </div>
          </div>

          {/* Table List of directory */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="pb-3 pl-2">Nom Complet</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Lots assignés</th>
                  <th className="pb-3 text-center">Tantièmes (‰)</th>
                  <th className="pb-3 text-right">Solde Comptable</th>
                  <th className="pb-3 pr-2 text-right">Statut Solde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOwners.length > 0 ? (
                  filteredOwners.map((owner) => {
                    const ownerLots = getLotsForOwner(owner.id);
                    const ownerTantiemes = getTantiemesForOwner(owner.id);
                    return (
                      <tr key={owner.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pl-2">
                          <div className="font-semibold text-slate-900 text-sm">{owner.lastName} {owner.firstName}</div>
                          <div className="text-xs text-slate-400 flex flex-col sm:flex-row sm:gap-3 gap-0.5 mt-0.5">
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {owner.email}</span>
                            <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> {owner.phone}</span>
                          </div>
                        </td>
                        <td className="py-4 text-xs">
                          <span className={`inline-block font-semibold px-2 py-1 rounded-md ${
                            owner.status === 'owner_occupant' ? 'bg-indigo-50 text-indigo-700' :
                            owner.status === 'landlord' ? 'bg-cyan-50 text-cyan-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {owner.status === 'owner_occupant' ? 'Occupant' :
                             owner.status === 'landlord' ? 'Bailleur' : 'Locataire'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {ownerLots.length > 0 ? (
                              ownerLots.map(l => (
                                <span key={l.id} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">
                                  {l.type === 'parking' ? 'Parking' : l.type === 'cellar' ? 'Cave' : `Lot ${l.number}`}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">Aucun</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-xs font-bold text-slate-900 text-center">
                          {ownerTantiemes} / 1000
                        </td>
                        <td className="py-4 text-right">
                          <span className={`text-sm font-bold ${owner.balance > 0 ? 'text-rose-600' : owner.balance < 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {owner.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </span>
                        </td>
                        <td className="py-4 pr-2 text-right">
                          {owner.balance > 0 ? (
                            <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded">Débiteur (Doit)</span>
                          ) : owner.balance < 0 ? (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">Créditeur (Excès)</span>
                          ) : (
                            <span className="text-[10px] bg-slate-50 text-slate-500 font-medium px-2 py-0.5 rounded">À jour</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs italic">
                      Aucun copropriétaire ne correspond aux critères de recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Form to register payments to the syndics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="h-4.5 w-4.5 text-indigo-400 bg-indigo-500/10 p-0.5 rounded" />
              Saisir un Paiement
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Remise en banque d'un chèque de provisions ou règlement par virement d'un copropriétaire débiteur.
            </p>

            {paymentSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs font-bold flex gap-2 items-center">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                Règlement comptabilisé con succès !
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Copropriétaire émetteur</label>
                <select 
                  value={paymentOwnerId}
                  onChange={(e) => setPaymentOwnerId(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  required
                >
                  <option value="" className="bg-slate-900 text-slate-300">Sélectionner...</option>
                  {coOwners.filter(co => co.balance > 0).map(co => (
                    <option key={co.id} value={co.id} className="bg-slate-900 text-slate-100">
                      {co.lastName} {co.firstName} (Dette : {co.balance}€)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Montant reçu (€)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 150"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors mt-2"
              >
                Valider le règlement
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Add New Co-Owner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100"
          >
            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Ajouter un Copropriétaire</h3>
              <p className="text-xs text-slate-400 mt-1">Saisie de l'identité et du rôle au sein de l'immeuble.</p>
            </div>
            
            <form onSubmit={handleAddCoOwner} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Prénom</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Nom</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Email professionnel / privé</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Téléphone de contact</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Régime d'occupation</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white cursor-pointer"
                >
                  <option value="owner_occupant">Copropriétaire Occupant</option>
                  <option value="landlord">Bailleur Non-Occupant (Nantissant)</option>
                  <option value="tenant">Locataire Simple</option>
                </select>
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
                  Ajouter le profil
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
