import { Building, CoOwner, Unit, Expense, GeneralMeeting, Incident, Announcement, BudgetCategory } from './types';

export const initialBuilding: Building = {
  id: 'b1',
  name: "Résidence le Grand Horizon",
  address: "42 Avenue des Champs-Élysées, 75008 Paris",
  totalShares: 1000,
  constructionYear: 2015,
  unitsCount: 16,
  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400"
};

export const initialCoOwners: CoOwner[] = [
  { id: 'co1', firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@email.com', phone: '06 12 34 56 78', status: 'owner_occupant', balance: 340.50 },
  { id: 'co2', firstName: 'Marie', lastName: 'Curie', email: 'marie.curie@email.com', phone: '06 23 45 67 89', status: 'owner_occupant', balance: -120.00 },
  { id: 'co3', firstName: 'Lucas', lastName: 'Martin', email: 'lucas.martin@email.com', phone: '06 34 56 78 90', status: 'landlord', balance: 0.00 },
  { id: 'co4', firstName: 'Sophie', lastName: 'Dubois', email: 'sophie.dubois@email.com', phone: '06 45 67 89 01', status: 'owner_occupant', balance: 1250.00 },
  { id: 'co5', firstName: 'Pierre', lastName: 'Moreau', email: 'pierre.moreau@email.com', phone: '06 56 78 90 12', status: 'landlord', balance: -50.00 },
  { id: 'co6', firstName: 'Inès', lastName: 'Renard', email: 'ines.renard@email.com', phone: '06 67 89 01 23', status: 'tenant', balance: 0.00 }
];

export const initialUnits: Unit[] = [
  { id: 'u1', number: '101', floor: '1er étage', type: 'T3', shares: 120, coOwnerId: 'co1' },
  { id: 'u2', number: '102', floor: '1er étage', type: 'T2', shares: 80, coOwnerId: 'co2' },
  { id: 'u3', number: '201', floor: '2ème étage', type: 'T4', shares: 150, coOwnerId: 'co3' },
  { id: 'u4', number: '202', floor: '2ème étage', type: 'T3', shares: 110, coOwnerId: 'co4' },
  { id: 'u5', number: '301', floor: '3ème étage', type: 'T5', shares: 190, coOwnerId: 'co5' },
  { id: 'u6', number: '302', floor: '3ème étage', type: 'T2', shares: 75, coOwnerId: 'co1' },
  { id: 'u7', number: 'P1', floor: 'Sous-sol', type: 'parking', shares: 15, coOwnerId: 'co1' },
  { id: 'u8', number: 'P2', floor: 'Sous-sol', type: 'parking', shares: 15, coOwnerId: 'co2' },
  { id: 'u9', number: 'P3', floor: 'Sous-sol', type: 'parking', shares: 15, coOwnerId: 'co3' },
  { id: 'u10', number: 'P4', floor: 'Sous-sol', type: 'parking', shares: 15, coOwnerId: 'co4' },
  { id: 'u11', number: 'P5', floor: 'Sous-sol', type: 'parking', shares: 15, coOwnerId: 'co5' },
  { id: 'u12', number: 'C1', floor: 'Sous-sol', type: 'cellar', shares: 8, coOwnerId: 'co1' },
  { id: 'u13', number: 'C2', floor: 'Sous-sol', type: 'cellar', shares: 8, coOwnerId: 'co2' },
  { id: 'u14', number: 'C3', floor: 'Sous-sol', type: 'cellar', shares: 8, coOwnerId: 'co4' },
  { id: 'u15', number: 'C4', floor: 'Sous-sol', type: 'cellar', shares: 8, coOwnerId: 'co5' },
  { id: 'u16', number: 'C5', floor: 'Sous-sol', type: 'cellar', shares: 8, coOwnerId: 'co3' }
];

export const initialBudget: BudgetCategory[] = [
  { id: 'cat1', name: 'Chauffage & Énergie', allocated: 12000, spent: 8400 },
  { id: 'cat2', name: 'Eau & Assainissement', allocated: 4500, spent: 3100 },
  { id: 'cat3', name: 'Maintenance & Ascenseur', allocated: 6200, spent: 4800 },
  { id: 'cat4', name: 'Assurance Immeuble', allocated: 3800, spent: 3800 },
  { id: 'cat5', name: 'Nettoyage & Communs', allocated: 5000, spent: 3750 },
  { id: 'cat6', name: 'Frais de Gestion & Admin', allocated: 2200, spent: 2150 },
  { id: 'cat7', name: 'Travaux Exceptionnels', allocated: 15000, spent: 4500 }
];

export const initialExpenses: Expense[] = [
  { id: 'e1', title: 'Entretien annuel ascenseur', amount: 1250.00, category: 'maintenance', date: '2026-03-15', status: 'paid', provider: 'Otis Ascenseurs', invoiceNumber: 'FAC-2026-891' },
  { id: 'e2', title: 'Facture d\'eau Jan-Avr', amount: 980.50, category: 'water', date: '2026-04-10', status: 'paid', provider: 'Eau de Paris', invoiceNumber: 'H2O-99102' },
  { id: 'e3', title: 'Remplacement ampoules hall', amount: 85.00, category: 'maintenance', date: '2026-05-02', status: 'paid', provider: 'Brico-Pro', invoiceNumber: 'BP-45920' },
  { id: 'e4', title: 'Prélèvement assurance copropriété', amount: 3800.00, category: 'insurance', date: '2026-01-05', status: 'paid', provider: 'Generali Assurances', invoiceNumber: 'GEN-220199' },
  { id: 'e5', title: 'Nettoyage mensuel escaliers', amount: 450.00, category: 'cleaning', date: '2026-06-01', status: 'paid', provider: 'PropreNet S.A.', invoiceNumber: 'PN-2026-06' },
  { id: 'e6', title: 'Préavis travaux étanchéité toit', amount: 4500.00, category: 'works', date: '2026-05-20', status: 'paid', provider: 'ÉtancheIDF', invoiceNumber: 'E-450' },
  { id: 'e7', title: 'Devis peinture hall d\'entrée', amount: 2400.00, category: 'works', date: '2026-06-10', status: 'pending_approval', provider: 'DécoPeint SARL', invoiceNumber: 'DEV-8891' }
];

export const initialGeneralMeetings: GeneralMeeting[] = [
  {
    id: 'gm1',
    title: "Assemblée Générale Ordinaire 2026",
    date: "2026-06-25",
    time: "18:30",
    location: "Salle associative, 12 rue du Commerce, Paris 8",
    status: 'upcoming',
    quorumReached: false,
    resolutions: [
      {
        id: 'r1',
        title: "Approbation des comptes de l'exercice 2025",
        description: "Approbation globale de l'exercice budgétaire clos au 31 décembre 2025 affichant un solde positif de 1 200€.",
        voteYes: 0,
        voteNo: 0,
        voteAbstain: 0,
        status: 'pending'
      },
      {
        id: 'r2',
        title: "Budget prévisionnel exercice 2027",
        description: "Vote du budget prévisionnel de fonctionnement de la copropriété estimé à 34 500€ pour l'année 2027.",
        voteYes: 0,
        voteNo: 0,
        voteAbstain: 0,
        status: 'pending'
      },
      {
        id: 'r3',
        title: "Rénovation énergétique & Peinture",
        description: "Sélection du devis DécoPeint SARL à 2 400€ pour la réfection esthétique et isolation thermique du hall d'entrée principal.",
        estimatedBudget: 2400,
        voteYes: 0,
        voteNo: 0,
        voteAbstain: 0,
        status: 'pending'
      },
      {
        id: 'r4',
        title: "Installation d'un arceau vélo sécurisé",
        description: "Installation de 4 racks à vélos robustes dans la cour centrale arrière de la copropriété pour encourager l'éco-mobilité. Budget estimé : 650€.",
        estimatedBudget: 650,
        voteYes: 0,
        voteNo: 0,
        voteAbstain: 0,
        status: 'pending'
      }
    ]
  },
  {
    id: 'gm2',
    title: "Assemblée Générale Ordinaire 2025",
    date: "2025-06-20",
    time: "18:00",
    location: "Vidéoconférence Teams",
    status: 'completed',
    quorumReached: true,
    resolutions: [
      {
        id: 'r1_old',
        title: "Approbation comptes 2024",
        description: "Validation des comptes d'exercice de l'année précédente.",
        voteYes: 780,
        voteNo: 110,
        voteAbstain: 110,
        status: 'approved'
      },
      {
        id: 'r2_old',
        title: "Changement de prestataire de ménage",
        description: "Passage au contrat PropreNet S.A. pour réaliser des économies de 15%.",
        voteYes: 620,
        voteNo: 210,
        voteAbstain: 170,
        status: 'approved'
      }
    ]
  }
];

export const initialIncidents: Incident[] = [
  {
    id: 'i1',
    title: "Panne de l'ascenseur principal",
    description: "L'ascenseur s'est arrêté au 2ème étage avec les portes bloquées. Un bip sonore permanent est audible. Un technicien a été prévenu par le bouton d'appel d'urgence.",
    category: 'elevator',
    priority: 'critical',
    status: 'in_progress',
    date: '2026-06-11',
    reportedBy: 'Jean Dupont (Lot 101)',
    assignedProvider: 'Otis Ascenseurs',
    comments: [
      { id: 'c1', author: 'Syndic Manager', text: 'Demande d\'intervention enregistrée sous le n° OTIS-499201.', date: '2026-06-11 10:15' },
      { id: 'c2', author: 'Jean Dupont', text: 'Merci pour la réactivité, j\'espère que ce sera réglé pour le week-end.', date: '2026-06-11 11:30' },
      { id: 'c3', author: 'Technicien Otis', text: 'Pièce de rechange commandée (bouton de commande de porte). Intervention planifiée samedi matin.', date: '2026-06-12 14:00' }
    ]
  },
  {
    id: 'i2',
    title: "Fuite d'eau cave - Lot C3",
    description: "De l'eau propre s'écoule lentement le long de la canalisation du plafond au niveau des caves. Risque d'infiltration à surveiller de près.",
    category: 'plumbing',
    priority: 'high',
    status: 'scheduled',
    date: '2026-06-12',
    reportedBy: 'Sophie Dubois (Lot C3 / Appt 202)',
    assignedProvider: 'Plombier Express IDF',
    comments: [
      { id: 'c4', author: 'Syndic Manager', text: 'Rendez-vous fixé lundi 15 juin pour recherche de fuite.', date: '2026-06-12 17:00' }
    ]
  },
  {
    id: 'i3',
    title: "Ampoule grillée parking niveau -1",
    description: "Le néon numéro 12 au fond du garage souterrain ne fonctionne plus. Zone très sombre pour manœuvrer en toute sécurité.",
    category: 'electricity',
    priority: 'low',
    status: 'new',
    date: '2026-06-13',
    reportedBy: 'Pierre Moreau (Lot P5)',
    comments: []
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: "Coupure d'eau temporaire pour travaux",
    content: "En raison de travaux de plomberie d'urgence sur la colonne montante principale, l'alimentation en eau chaude et froide sera temporairement interrompue le mardi 16 juin de 14h00 à 17h00. Veuillez prendre vos dispositions.",
    date: '2026-06-12',
    category: 'alert',
    pinned: true
  },
  {
    id: 'a2',
    title: "Convocation Assemblée Générale Ordinaire",
    content: "Chers copropriétaires, vous avez reçu par courrier recommandé la convocation pour l'AG du 25 juin prochain. Les documents budgétaires sont consultables dans l'onglet Documents. Votre présence ou vote par procuration est indispensable.",
    date: '2026-06-10',
    category: 'info',
    pinned: true
  },
  {
    id: 'a3',
    title: "Nettoyage annuel des parkings",
    content: "Le nettoyage haute pression des sols du parking souterrain sera effectué les 20 et 21 juin. Merci de libérer impérativement vos emplacements de parking entre 8h et 18h ces jours-là sous peine d'interdiction de lavage.",
    date: '2026-06-05',
    category: 'maintenance',
    pinned: false
  }
];
