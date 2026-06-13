import React, { useState } from 'react';
import { useSyndic } from '../context/SyndicContext';
import { 
  AlertTriangle, Filter, Plus, Wrench, MessageSquare, ChevronRight, 
  Clock, CheckCircle, ShieldAlert, Send, PlusCircle, Activity
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Tickets() {
  const { incidents, addIncident, addCommentToIncident, updateIncidentStatus } = useSyndic();

  // Selected ticket for side-panel detail
  const [selectedTicketId, setSelectedTicketId] = useState<string>(incidents[0]?.id || '');
  
  // Filtering states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // New Ticket form modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<any>('other');
  const [priority, setPriority] = useState<any>('medium');
  const [reportedBy, setReportBy] = useState('');
  const [assignedProvider, setAssignedProvider] = useState('');

  // Comment input form
  const [newCommentText, setNewCommentText] = useState('');

  // Finding active detail
  const currentTicket = incidents.find(i => i.id === selectedTicketId);

  // Filters logic
  const filteredIncidents = incidents.filter(inc => {
    const statusMatch = statusFilter === 'all' || inc.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || inc.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !reportedBy) return;

    addIncident({
      title,
      description,
      category,
      priority,
      status: 'new',
      reportedBy,
      assignedProvider: assignedProvider || undefined
    });

    setTitle('');
    setDescription('');
    setCategory('other');
    setPriority('medium');
    setReportBy('');
    setAssignedProvider('');
    setShowAddModal(false);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTicketId) return;

    addCommentToIncident(selectedTicketId, newCommentText, "Gestionnaire Syndic");
    setNewCommentText('');
  };

  const handleUpdateStatus = (status: any) => {
    if (!selectedTicketId) return;
    updateIncidentStatus(selectedTicketId, status);
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'critical': return 'bg-rose-100 text-rose-800 border-rose-200 uppercase';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusBadge = (stat: string) => {
    switch (stat) {
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'investigating': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'scheduled': return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      case 'in_progress': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

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

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'plumbing': return 'Plomberie';
      case 'electricity': return 'Électricité';
      case 'elevator': return 'Ascenseur';
      case 'structure': return 'Gros œuvre';
      case 'cleaning': return 'Ménage / Propreté';
      default: return 'Autre';
    }
  };

  return (
    <div className="space-y-6" id="tickets-section">
      
      {/* Header board */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Interventions & Maintenance</h2>
            <p className="text-slate-400 text-xs mt-0.5">Suivi technique en temps réel du bâtiment et demandes des résidents.</p>
          </div>
        </div>

        <div>
          <button 
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Signaler un Incident</span>
          </button>
        </div>
      </div>

      {/* Grid: Backlog left, Timeline thread right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Backlog List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4 shadow-2xs">
            
            {/* Header filters */}
            <div className="flex gap-2 flex-wrap pb-1">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:outline-hidden cursor-pointer"
              >
                <option value="all">Tous statuts</option>
                <option value="new">Nouveau ({incidents.filter(i => i.status === 'new').length})</option>
                <option value="in_progress">En cours ({incidents.filter(i => i.status === 'in_progress').length})</option>
                <option value="scheduled">Pris en charge ({incidents.filter(i => i.status === 'scheduled').length})</option>
                <option value="resolved">Résolu ({incidents.filter(i => i.status === 'resolved').length})</option>
              </select>

              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:outline-hidden cursor-pointer"
              >
                <option value="all">Toutes priorités</option>
                <option value="critical">Critique ({incidents.filter(i => i.priority === 'critical').length})</option>
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>

            <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto pr-1">
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((inc) => {
                  const isSelected = inc.id === selectedTicketId;
                  return (
                    <button
                      key={inc.id}
                      type="button"
                      onClick={() => setSelectedTicketId(inc.id)}
                      className={`w-full text-left p-4 my-1 transition-all rounded-2xl flex items-start justify-between gap-4 border-l-4 ${
                        isSelected 
                          ? 'bg-slate-50/80 border-l-indigo-600 shadow-2xs' 
                          : 'border-l-transparent hover:bg-slate-50/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(inc.priority)}`}>
                            {inc.priority === 'critical' ? 'Critique' : inc.priority === 'high' ? 'Haute' : inc.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">Le {new Date(inc.date).toLocaleDateString('fr-FR')}</span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mt-1">{inc.title}</h4>
                        <p className="text-slate-500 text-xs line-clamp-1">{inc.description}</p>
                        
                        <div className="flex items-center gap-3 pt-2 text-[10px] text-slate-400 font-medium">
                          <span>Signaleur : {inc.reportedBy.split(' (')[0]}</span>
                          {inc.comments.length > 0 && (
                            <span className="flex items-center gap-0.5 text-indigo-600"><MessageSquare className="h-3 w-3" /> {inc.comments.length} comm.</span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-2 self-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(inc.status)}`}>
                          {getStatusLabelInFrench(inc.status)}
                        </span>
                        <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  Aucun incident ne correspond.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Timeline Thread details */}
        <div className="lg:col-span-6">
          {currentTicket ? (
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-2xs flex flex-col h-full min-h-[500px]">
              
              {/* Status head section */}
              <div className="p-6 bg-slate-50/50 border-b border-slate-100 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {getCategoryLabel(currentTicket.category)}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-2">{currentTicket.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">Reporté par : <span className="text-slate-600 font-semibold">{currentTicket.reportedBy}</span></p>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md border ${getStatusBadge(currentTicket.status)}`}>
                      {getStatusLabelInFrench(currentTicket.status)}
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 text-xs bg-white p-4 rounded-2xl border border-slate-100 leading-relaxed">
                  {currentTicket.description}
                </p>

                {/* Assigned Contractor box */}
                {currentTicket.assignedProvider && (
                  <div className="flex justify-between items-center bg-indigo-600/5 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-800">
                    <span>Intervention confiée à l'entreprise : <strong>{currentTicket.assignedProvider}</strong></span>
                    <Activity className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                  </div>
                )}

                {/* Admin quick tags */}
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Modifier l'état :</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {['investigating', 'scheduled', 'in_progress', 'resolved'].map((s: any) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleUpdateStatus(s)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          currentTicket.status === s 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {getStatusLabelInFrench(s)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments Flow list */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-64">
                <div className="text-[10px] uppercase font-extrabold tracking-wider text-slate-450 mb-2">Historique d'avancement technique</div>

                {currentTicket.comments.length > 0 ? (
                  currentTicket.comments.map((comm) => (
                    <div key={comm.id} className="p-4 bg-slate-50/60 border border-slate-100 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-800">{comm.author}</span>
                        <span className="text-slate-400">Le {comm.date}</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{comm.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs italic">
                    Aucune mise à jour de chantier saisie pour l'instant.
                  </div>
                )}
              </div>

              {/* Message Input form */}
              <form onSubmit={handlePostComment} className="p-4 border-t border-slate-100 bg-slate-50/10 flex gap-2">
                <input 
                  type="text" 
                  value={newCommentText}
                  placeholder="Écrire une note technique de suivi..."
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                  required
                />
                <button 
                  type="submit"
                  className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer shrink-0 transition-all flex items-center justify-center animate-none"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

            </div>
          ) : (
            <div className="h-full bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex flex-col justify-center items-center text-center p-8 min-h-[500px]">
              <MessageSquare className="h-10 w-10 text-slate-400 mb-2" />
              <h4 className="font-bold text-slate-850 text-sm">Aucun ticket sélectionné</h4>
              <p className="text-slate-400 text-xs mt-1">Choisissez un incident dans la colonne de gauche pour interagir.</p>
            </div>
          )}
        </div>

      </div>

      {/* Ticket Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100"
          >
            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Signaler un Incident</h3>
              <p className="text-xs text-slate-400 mt-1">Renseigner une anomalie technique constatée par un résident.</p>
            </div>
            
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Intitulé du sinistre / problème</label>
                <input 
                  type="text" 
                  value={title}
                  placeholder="e.g. Serrure fracturée porte sas"
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 font-mono">Description complète</label>
                <textarea 
                  rows={3}
                  value={description}
                  placeholder="Détaillez pour faciliter la recherche..."
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Catégorie</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white cursor-pointer"
                  >
                    <option value="plumbing">Plomberie</option>
                    <option value="electricity">Électricité</option>
                    <option value="elevator">Ascenseur</option>
                    <option value="structure">Gros œuvre / Structure</option>
                    <option value="cleaning">Propreté / Ménage</option>
                    <option value="other">Autre catégorie</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Urgence</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white cursor-pointer"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="critical">Critique (Danger)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Résident demandeur / Signaleur</label>
                <input 
                  type="text" 
                  value={reportedBy}
                  placeholder="e.g. Jean Dupont (Lot 101)"
                  onChange={(e) => setReportBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white animate-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Prestataire à mandater (Optionnel)</label>
                <input 
                  type="text" 
                  value={assignedProvider}
                  placeholder="e.g. Otis Ascenseurs"
                  onChange={(e) => setAssignedProvider(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white animate-none"
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
                  Publier l'incident
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
