import React, { createContext, useContext, useState, useEffect } from 'react';
import { Building, CoOwner, Unit, Expense, GeneralMeeting, Incident, Announcement, BudgetCategory } from '../types';
import { 
  initialBuilding, 
  initialCoOwners, 
  initialUnits, 
  initialExpenses, 
  initialGeneralMeetings, 
  initialIncidents, 
  initialAnnouncements,
  initialBudget
} from '../mockData';

interface SyndicContextType {
  building: Building;
  coOwners: CoOwner[];
  units: Unit[];
  expenses: Expense[];
  meetings: GeneralMeeting[];
  incidents: Incident[];
  announcements: Announcement[];
  budget: BudgetCategory[];
  
  // Actions
  addCoOwner: (co: Omit<CoOwner, 'id' | 'balance'>) => void;
  updateCoOwnerBalance: (id: string, amount: number) => void;
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'date' | 'comments'>) => void;
  addCommentToIncident: (incidentId: string, text: string, author: string) => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  castVote: (meetingId: string, resolutionId: string, voteType: 'yes' | 'no' | 'abstain', shares: number) => void;
  launchFeeCall: (totalBudget: number, title: string) => void;
  resetAll: () => void;
}

const SyndicContext = createContext<SyndicContextType | undefined>(undefined);

export const SyndicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [building, setBuilding] = useState<Building>(() => {
    const saved = localStorage.getItem('syndic_building');
    return saved ? JSON.parse(saved) : initialBuilding;
  });

  const [coOwners, setCoOwners] = useState<CoOwner[]>(() => {
    const saved = localStorage.getItem('syndic_coOwners');
    return saved ? JSON.parse(saved) : initialCoOwners;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('syndic_units');
    return saved ? JSON.parse(saved) : initialUnits;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('syndic_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [meetings, setMeetings] = useState<GeneralMeeting[]>(() => {
    const saved = localStorage.getItem('syndic_meetings');
    return saved ? JSON.parse(saved) : initialGeneralMeetings;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('syndic_incidents');
    return saved ? JSON.parse(saved) : initialIncidents;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('syndic_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [budget, setBudget] = useState<BudgetCategory[]>(() => {
    const saved = localStorage.getItem('syndic_budget');
    return saved ? JSON.parse(saved) : initialBudget;
  });

  // Keep localStorage up-to-date
  useEffect(() => {
    localStorage.setItem('syndic_building', JSON.stringify(building));
    localStorage.setItem('syndic_coOwners', JSON.stringify(coOwners));
    localStorage.setItem('syndic_units', JSON.stringify(units));
    localStorage.setItem('syndic_expenses', JSON.stringify(expenses));
    localStorage.setItem('syndic_meetings', JSON.stringify(meetings));
    localStorage.setItem('syndic_incidents', JSON.stringify(incidents));
    localStorage.setItem('syndic_announcements', JSON.stringify(announcements));
    localStorage.setItem('syndic_budget', JSON.stringify(budget));
  }, [building, coOwners, units, expenses, meetings, incidents, announcements, budget]);

  const addCoOwner = (co: Omit<CoOwner, 'id' | 'balance'>) => {
    const newCo: CoOwner = {
      ...co,
      id: 'co_' + Date.now(),
      balance: 0
    };
    setCoOwners(prev => [...prev, newCo]);
  };

  const updateCoOwnerBalance = (id: string, amount: number) => {
    setCoOwners(prev => prev.map(co => co.id === id ? { ...co, balance: co.balance + amount } : co));
  };

  const addUnit = (unit: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...unit,
      id: 'u_' + Date.now()
    };
    setUnits(prev => [...prev, newUnit]);
  };

  const addExpense = (exp: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...exp,
      id: 'e_' + Date.now()
    };
    setExpenses(prev => [...prev, newExp]);

    // Update spent budget
    setBudget(prevBudget => {
      let mappedCat: string;
      switch (exp.category) {
        case 'heating': mappedCat = 'Chauffage & Énergie'; break;
        case 'water': mappedCat = 'Eau & Assainissement'; break;
        case 'maintenance': mappedCat = 'Maintenance & Ascenseur'; break;
        case 'insurance': mappedCat = 'Assurance Immeuble'; break;
        case 'cleaning': mappedCat = 'Nettoyage & Communs'; break;
        case 'admin': mappedCat = 'Frais de Gestion & Admin'; break;
        case 'works': mappedCat = 'Travaux Exceptionnels'; break;
        default: mappedCat = '';
      }

      return prevBudget.map(b => b.name === mappedCat ? { ...b, spent: b.spent + exp.amount } : b);
    });
  };

  const addIncident = (inc: Omit<Incident, 'id' | 'date' | 'comments'>) => {
    const newInc: Incident = {
      ...inc,
      id: 'i_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      comments: []
    };
    setIncidents(prev => [newInc, ...prev]);
  };

  const addCommentToIncident = (incidentId: string, text: string, author: string) => {
    const newComment = {
      id: 'c_' + Date.now(),
      author,
      text,
      date: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          comments: [...inc.comments, newComment]
        };
      }
      return inc;
    }));
  };

  const updateIncidentStatus = (id: string, status: Incident['status']) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: 'a_' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const castVote = (meetingId: string, resolutionId: string, voteType: 'yes' | 'no' | 'abstain', shares: number) => {
    setMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        const resolutions = m.resolutions.map(r => {
          if (r.id === resolutionId) {
            let voteYes = r.voteYes;
            let voteNo = r.voteNo;
            let voteAbstain = r.voteAbstain;

            if (voteType === 'yes') voteYes += shares;
            else if (voteType === 'no') voteNo += shares;
            else voteAbstain += shares;

            // Recalculate status based on total shares (1000)
            // If they pass 500 (majority), approved.
            // If No passes 500, rejected.
            let status = r.status;
            if (voteYes > 500) status = 'approved';
            else if (voteNo >= 500) status = 'rejected';

            return {
              ...r,
              voteYes,
              voteNo,
              voteAbstain,
              status
            };
          }
          return r;
        });
        return { ...m, resolutions };
      }
      return m;
    }));
  };

  const launchFeeCall = (totalBudget: number, title: string) => {
    // Distribute among co-owners relative to their total shares (units)
    // Find unit shares of co-owners first
    const ownerShares: { [ownerId: string]: number } = {};
    units.forEach(u => {
      ownerShares[u.coOwnerId] = (ownerShares[u.coOwnerId] || 0) + u.shares;
    });

    setCoOwners(prev => prev.map(co => {
      const shares = ownerShares[co.id] || 0;
      const proportion = shares / 1000; // Assuming 1000 total tantiemes
      const amountToOwe = totalBudget * proportion;
      return {
        ...co,
        balance: Math.round((co.balance + amountToOwe) * 100) / 100
      };
    }));

    // Register as a pending type Announcement so co-owners know
    addAnnouncement({
      title: `Appel de fonds : ${title}`,
      content: `Un appel de fonds de ${totalBudget}€ a été émis pour le motif : ${title}. La répartition a été calculée au prorata des tantièmes de chaque lot. Merci de régulariser votre solde.`,
      category: 'maintenance',
      pinned: false
    });
  };

  const resetAll = () => {
    localStorage.removeItem('syndic_building');
    localStorage.removeItem('syndic_coOwners');
    localStorage.removeItem('syndic_units');
    localStorage.removeItem('syndic_expenses');
    localStorage.removeItem('syndic_meetings');
    localStorage.removeItem('syndic_incidents');
    localStorage.removeItem('syndic_announcements');
    localStorage.removeItem('syndic_budget');
    setBuilding(initialBuilding);
    setCoOwners(initialCoOwners);
    setUnits(initialUnits);
    setExpenses(initialExpenses);
    setMeetings(initialGeneralMeetings);
    setIncidents(initialIncidents);
    setAnnouncements(initialAnnouncements);
    setBudget(initialBudget);
  };

  return (
    <SyndicContext.Provider value={{
      building, coOwners, units, expenses, meetings, incidents, announcements, budget,
      addCoOwner, updateCoOwnerBalance, addUnit, addExpense, addIncident,
      addCommentToIncident, updateIncidentStatus, addAnnouncement, castVote, launchFeeCall, resetAll
    }}>
      {children}
    </SyndicContext.Provider>
  );
};

export const useSyndic = () => {
  const context = useContext(SyndicContext);
  if (!context) throw new Error('useSyndic must be used within a SyndicProvider');
  return context;
};
