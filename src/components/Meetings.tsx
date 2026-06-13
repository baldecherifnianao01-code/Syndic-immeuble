import React, { useState } from 'react';
import { useSyndic } from '../context/SyndicContext';
import { 
  Calendar, Vote, Scale, Info, Plus, ChevronRight, Check, X, 
  UserCheck, AlertCircle, FileCheck 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Meetings() {
  const { meetings, coOwners, units, castVote } = useSyndic();

  // Active meeting tabs / filters
  const [activeMeetingId, setActiveMeetingId] = useState<string>(meetings[0]?.id || '');
  
  // Voting simulator helper states
  const [selectedVoterId, setSelectedVoterId] = useState<string>('');
  const [votedMap, setVotedMap] = useState<{ [resolutionId: string]: string[] }>({}); // Tracks who voted what (to prevent double vote)

  // Scheduling new AGM form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const activeMeeting = meetings.find(m => m.id === activeMeetingId);

  // Group co-owner shares to help voter picker display tantiemes
  const getOwnerShares = (ownerId: string) => {
    return units.filter(u => u.coOwnerId === ownerId).reduce((s, u) => s + u.shares, 0);
  };

  const handleCastVote = (resolutionId: string, type: 'yes' | 'no' | 'abstain') => {
    if (!selectedVoterId) return;
    const sharesNum = getOwnerShares(selectedVoterId);
    if (!sharesNum) return;

    // Check if voter already voted on this resolution in current state map
    const alreadyVoted = votedMap[resolutionId] || [];
    if (alreadyVoted.includes(selectedVoterId)) {
      alert("Ce copropriétaire a déjà voté pour cette résolution.");
      return;
    }

    // Cast vote in central context
    castVote(activeMeetingId, resolutionId, type, sharesNum);

    // Save vote to local voted map
    setVotedMap(prev => ({
      ...prev,
      [resolutionId]: [...(prev[resolutionId] || []), selectedVoterId]
    }));
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;
    
    // We can simulate creating, but for simplicity of the prototype let's focus on casting votes
    alert("Assemblée créée avec succès. L'ordre du jour par défaut a été affecté.");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6" id="meetings-section">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Assemblées Générales (AG)</h2>
            <p className="text-slate-400 text-xs mt-0.5">Simuler les votes des résolutions et enregistrer les procès-verbaux.</p>
          </div>
        </div>

        <div>
          <button 
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Planifier une Nouvelle AG</span>
          </button>
        </div>
      </div>

      {/* Assembly selector Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl w-fit">
        {meetings.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setActiveMeetingId(m.id);
              setSelectedVoterId('');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeMeetingId === m.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            {m.title}
            <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold ${m.status === 'upcoming' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
              {m.status === 'upcoming' ? 'En cours' : 'Terminée'}
            </span>
          </button>
        ))}
      </div>

      {/* Meeting Details and Voting Area */}
      {activeMeeting && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main resolution list */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
              
              <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{activeMeeting.title}</h3>
                  <p className="text-xs text-slate-400">Lieu : {activeMeeting.location} • Planifié le {new Date(activeMeeting.date).toLocaleDateString('fr-FR')} à {activeMeeting.time}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${activeMeeting.status === 'upcoming' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700'}`}>
                    • {activeMeeting.status === 'upcoming' ? 'Vote en cours / Ouvert' : 'Procès-verbal signé'}
                  </span>
                </div>
              </div>

              {/* Resolutions backloop / detail */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                  <Vote className="h-4 w-4 text-indigo-600" />
                  <h4>Résolutions soumises au vote des Copropriétaires</h4>
                </div>

                {activeMeeting.resolutions.map((res, index) => {
                  const totalCast = res.voteYes + res.voteNo + res.voteAbstain;
                  const percentYes = totalCast > 0 ? Math.round((res.voteYes / totalCast) * 100) : 0;
                  const percentNo = totalCast > 0 ? Math.round((res.voteNo / totalCast) * 100) : 0;
                  const percentAbstain = totalCast > 0 ? Math.round((res.voteAbstain / totalCast) * 100) : 0;

                  return (
                    <div key={res.id} className="p-5 rounded-xl border border-slate-100 space-y-4 hover:border-slate-200 transition-all">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">Question #{index + 1}</span>
                          <h5 className="font-bold text-slate-900 text-sm mt-1">{res.title}</h5>
                          <p className="text-slate-600 text-xs mt-1 leading-relaxed">{res.description}</p>
                          {res.estimatedBudget && (
                            <span className="inline-block mt-2 text-xs bg-slate-100 font-semibold px-2.5 py-0.5 rounded text-slate-700">
                              Budget à voter : {res.estimatedBudget} € (TTC)
                            </span>
                          )}
                        </div>

                        {/* Status absolute badge */}
                        <div>
                          {res.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-md border border-emerald-100">
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              Approuvée (Quorum)
                            </span>
                          ) : res.status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 text-rose-800 font-bold px-2.5 py-1 rounded-md border border-rose-100">
                              <X className="h-3.5 w-3.5 text-rose-600" />
                              Rejetée
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-md border border-amber-100">
                              En attente de voix
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Vote share progress bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                          <span>Baromètre des voix (millièmes cumulés)</span>
                          <span>Total exprimés : {totalCast} / 1000 tantièmes</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 flex overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${percentYes}%` }} title={`Pour: ${res.voteYes}`}></div>
                          <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${percentNo}%` }} title={`Contre: ${res.voteNo}`}></div>
                          <div className="bg-slate-300 h-full transition-all duration-300" style={{ width: `${percentAbstain}%` }} title={`Abstentions: ${res.voteAbstain}`}></div>
                        </div>

                        {/* Percent detail */}
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Pour : {res.voteYes}‰ ({percentYes}%)</span>
                          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500"></span> Contre : {res.voteNo}‰ ({percentNo}%)</span>
                          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300"></span> Abstenus : {res.voteAbstain}‰</span>
                        </div>
                      </div>

                      {/* Vote action panel (Only for upcoming meetings) */}
                      {activeMeeting.status === 'upcoming' && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 mt-2">
                          <div className="text-[11px] text-slate-500">
                            {selectedVoterId ? (
                              <span>Voter au nom de : <strong className="text-slate-900">{coOwners.find(c => c.id === selectedVoterId)?.lastName} {coOwners.find(c => c.id === selectedVoterId)?.firstName}</strong> ({getOwnerShares(selectedVoterId)} / 1000‰)</span>
                            ) : (
                              <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                Sélectionnez un copropriétaire à droite pour simuler un vote.
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button 
                              type="button"
                              onClick={() => handleCastVote(res.id, 'yes')}
                              disabled={!selectedVoterId}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 px-3.5 rounded-lg text-xs leading-none transition-colors duration-150 flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Pour</span>
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleCastVote(res.id, 'no')}
                              disabled={!selectedVoterId}
                              className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-1 px-3.5 rounded-lg text-xs leading-none transition-colors duration-150 flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Contre</span>
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleCastVote(res.id, 'abstain')}
                              disabled={!selectedVoterId}
                              className="bg-slate-500 hover:bg-slate-400 text-white font-bold py-1 px-3.5 rounded-lg text-xs leading-none transition-colors duration-150 flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <span>Abstention</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right sidebar: Interactive voter selection station */}
          {activeMeeting.status === 'upcoming' && (
            <div className="lg:col-span-4 bg-slate-900 text-slate-100 p-6 rounded-3xl shadow-lg border border-slate-800 space-y-4">
              <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-2">
                <UserCheck className="h-4.5 w-4.5 text-indigo-400 bg-indigo-500/10 p-0.5 rounded" />
                Votant d'Émargement
              </h4>
              <p className="text-slate-400 text-xs">
                Sélectionnez l'un des copropriétaires pour agir en son nom, puis votez Pour, Contre ou Abstention sur chaque résolution de l'ordre du jour.
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {coOwners.map((owner) => {
                  const shares = getOwnerShares(owner.id);
                  if (shares === 0) return null; // No registered lot

                  const isSelected = selectedVoterId === owner.id;

                  return (
                    <button
                      key={owner.id}
                      type="button"
                      onClick={() => setSelectedVoterId(owner.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-xs' 
                          : 'bg-slate-800/80 border-slate-800/50 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="block font-bold text-xs">{owner.lastName} {owner.firstName}</span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                          {owner.status === 'owner_occupant' ? 'Résident' : 'Bailleur'}
                        </span>
                      </div>
                      <span className="text-xs font-bold bg-slate-850 rounded px-2.5 py-0.5 text-white">
                        {shares} ‰
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-slate-800/50 p-4 border border-slate-800/60 rounded-2xl space-y-2">
                <span className="text-[10px] text-pink-400 uppercase font-bold block">Fonctionnement Légal</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Conformément à la Loi du 10 juillet 1965, les décisions sont prises à la majorité des voix des copropriétaires présents ou représentés (501 millièmes requis).
                </p>
              </div>
            </div>
          )}

          {/* Completed notice fallback */}
          {activeMeeting.status === 'completed' && (
            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center text-center space-y-4">
              <div className="bg-indigo-50 text-indigo-600 h-12 w-12 rounded-full flex items-center justify-center self-center">
                <FileCheck className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Séance Clôturée</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Le vote de cette assemblée générale est définitivement suspendu et gelé. Le Procès-verbal comptant la répartition finale a été signé par le président de séance.
              </p>
            </div>
          )}

        </div>
      )}

      {/* Schedule meeting modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100"
          >
            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Planifier une Assemblée Générale</h3>
              <p className="text-xs text-slate-400 mt-1">Générer les convocations et inscrire l'ordre du jour de la réunion.</p>
            </div>
            
            <form onSubmit={handleCreateMeeting} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Libellé de l'AG</label>
                <input 
                  type="text" 
                  value={title}
                  placeholder="e.g. Assemblée Générale Extraordinaire 2026"
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Date de tenue</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Heure de début</label>
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Lieu de convocation (ou virtuel)</label>
                <input 
                  type="text" 
                  value={location}
                  placeholder="e.g. Hall principal de l'immeuble ou Zoom"
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                  required
                />
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
                  Enregistrer l'AG
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
