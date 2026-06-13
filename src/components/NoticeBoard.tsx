import React, { useState } from 'react';
import { useSyndic } from '../context/SyndicContext';
import { Megaphone, FileText, Plus, Pin, Eye, Download, Info, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function NoticeBoard() {
  const { announcements, addAnnouncement } = useSyndic();

  // New Notice form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<any>('info');
  const [pinned, setPinned] = useState(false);

  // Document Vault state
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addAnnouncement({
      title,
      content,
      category,
      pinned
    });

    setTitle('');
    setContent('');
    setCategory('info');
    setPinned(false);
    setShowAddModal(false);
  };

  const mockDocuments = [
    { 
      id: 'doc1', 
      title: "Règlement de Copropriété Officiel", 
      size: "2.4 Mo", 
      type: "PDF d'origine",
      date: "12 Octobre 2015",
      summary: "Ce document régit le fonctionnement collectif de l'immeuble. Il détaille la destination des parties privatives (habitation uniquement) et communes, ainsi que la méthode de calcul des tantièmes affectés à chaque lot (lots d'appartements, parkings et caves)."
    },
    { 
      id: 'doc2', 
      title: "Diagnostic de Performance Énergétique (DPE)", 
      size: "1.1 Mo", 
      type: "PDF d'évaluation",
      date: "04 Février 2024",
      summary: "Bilan global d'isolation thermique de la structure et rendement des parties communes. Note actuelle globale de l'immeuble : Classification C. Recommandations prioritaires : Réfection de l'isolation du hall principal votée lors de la prochaine AG."
    },
    { 
      id: 'doc3', 
      title: "Carnet d'Entretien du Bâtiment", 
      size: "820 Ko", 
      type: "PDF de suivi",
      date: "Mis à jour en Juin 2026",
      summary: "Ce carnet de suivi légal réunit l'historique complet des chantiers techniques de ravalement de façade et d'entretien d'ascenseur."
    }
  ];

  return (
    <div className="space-y-6" id="notice-board-section">
      
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Panneau d'Affichage & Documents</h2>
            <p className="text-slate-400 text-xs mt-0.5">Partagez l'information de l'immeuble et gérez l'archive des documents officiels.</p>
          </div>
        </div>

        <div>
          <button 
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Publier un Flash Info</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Announcements Feed */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <Megaphone className="h-4.5 w-4.5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Affichage de la Résidence</h3>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div 
                key={ann.id} 
                className={`p-5 rounded-2xl border relative transition-all ${
                  ann.pinned ? 'bg-amber-50/25 border-amber-200/60 shadow-[0_2px_12px_rgba(245,158,11,0.04)]' : 'bg-slate-50/40 border-slate-100'
                }`}
              >
                {ann.pinned && (
                  <Pin className="h-4 w-4 text-amber-550 absolute top-5 right-5 fill-amber-550" />
                )}

                <div className="flex items-center gap-2 text-[10px]">
                  <span className={`font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    ann.category === 'alert' ? 'bg-rose-100 text-rose-800' :
                    ann.category === 'maintenance' ? 'bg-amber-100 text-amber-800' :
                    ann.category === 'info' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {ann.category === 'alert' ? 'Urgent' :
                     ann.category === 'maintenance' ? 'Bâtiment' :
                     ann.category === 'info' ? 'Annonce' : 'Événement'}
                  </span>
                  <span className="text-slate-400 font-medium font-mono">Le {new Date(ann.date).toLocaleDateString('fr-FR')}</span>
                </div>

                <h4 className="font-bold text-slate-900 mt-2 text-sm">{ann.title}</h4>
                <p className="text-slate-600 text-xs mt-2 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Digital Document Vault */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-100 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Eye className="h-4.5 w-4.5 text-indigo-400" />
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Coffre-fort des Documents</h3>
            </div>

            <div className="space-y-4 mt-6">
              {mockDocuments.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-850/40 hover:bg-slate-850 hover:border-slate-700/80 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 py-3 bg-slate-800 rounded-xl text-slate-400 shrink-0 self-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-xs leading-snug">{doc.title}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">{doc.type} • {doc.size}</p>
                      <span className="text-[9px] text-slate-600 block mt-1 font-mono">Enregistré le {doc.date}</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button 
                      type="button" 
                      onClick={() => setViewingDocId(doc.id)}
                      className="p-2 hover:bg-indigo-650 bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Consulter"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setViewingDocId(doc.id)}
                      className="p-2 hover:bg-slate-800 bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Télécharger"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal disclosure safety */}
          <div className="bg-slate-850/40 p-4 border border-slate-800/60 rounded-2xl space-y-2 mt-6">
            <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              SÔRETÉ DES FICHIERS COPROPRIÉTÉ
            </span>
            <p className="leading-relaxed text-[11px] text-slate-400">
              Toutes les pièces comptables et diagnostics officiels sont cryptés et accessibles en lecture seule par le conseil de gestion, conformément au Décret Alur.
            </p>
          </div>
        </div>

      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100"
          >
            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Rédiger un Flash Info</h3>
              <p className="text-xs text-slate-400 mt-1">Poster instantanément une annonce sur le écran d'accueil de la copropriété.</p>
            </div>
            
            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Titre de la note d'information</label>
                <input 
                  type="text" 
                  value={title}
                  placeholder="e.g. Réparation interphone résolue"
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Texte / Message aux résidents</label>
                <textarea 
                  rows={4}
                  value={content}
                  placeholder="Rédigez clairement les directives..."
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Type de communication</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white cursor-pointer"
                  >
                    <option value="info">Annonce Générale</option>
                    <option value="alert">Alerte d'urgence</option>
                    <option value="maintenance">Entretien / Travaux</option>
                    <option value="event">Événement de copropriété</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox" 
                    id="pinned-checkbox"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="pinned-checkbox" className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1">
                    Épingler en haut
                  </label>
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
                  Publier l'avis
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Viewing document modal overlay */}
      {viewingDocId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden border border-slate-100"
          >
            <div className="p-6 bg-slate-900 text-slate-100">
              <h3 className="font-bold text-white text-base">{mockDocuments.find(d => d.id === viewingDocId)?.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Copropriété Résidence le Grand Horizon • Consultable en ligne</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 border-l-4 border-indigo-500 rounded text-slate-700 text-xs font-medium space-y-2 leading-relaxed">
                <div className="font-bold text-slate-800 flex items-center gap-1 uppercase tracking-wider text-[10px]">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  Résumé Synthétique (Intelligence Artificielle)
                </div>
                <p>
                  {mockDocuments.find(d => d.id === viewingDocId)?.summary}
                </p>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 h-60 overflow-y-auto font-serif text-xs text-slate-600 leading-relaxed space-y-4">
                <h5 className="font-bold text-slate-800 border-b pb-1">ARTICLE 1 : DISPOSITIONS GÉNÉRALES</h5>
                <p>
                  Les copropriétaires réunis en Assemblée Générale déclarent fixer par les présentes la réglementation intérieure de la Résidence conformément aux arrêtés préfectoraux d'urbanisme. Le présent document engage l'ensemble des résidents qu'ils soient occupants à titre gratuit, locataires simples, ou copropriétaires par démembrement foncier.
                </p>

                <h5 className="font-bold text-slate-800 border-b pb-1 mt-4">ARTICLE 2 : DESTINATION PRIVATIVE & TROUBLE</h5>
                <p>
                  Chaque appartement est exclusivement destiné à l'usage d'habitation bourgeoise. L'exercice d'une profession libérale est autorisé si celle-ci ne génère aucun va-et-vient disproportionné ni nuisances olfactives, sonores ou vibratoires dans le hall principal. Toute sous-location meublée de courte durée de nature hôtelière est proscrite au sein de la copropriété.
                </p>

                <h5 className="font-bold text-slate-800 border-b pb-1 mt-4">ARTICLE 3 : PARKING & SÉCURITÉ</h5>
                <p>
                  L'accès au garage est verrouillé 24h/24. Aucun véhicule hors d'usage, aucun dépôt encombrant autre que des vélos ou pneumatiques agréés ne doit obstruer les places de stationnement. Les infractions constatées par le syndic feront l'objet d'une mise en demeure par mise en fourrière immédiate.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setViewingDocId(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
