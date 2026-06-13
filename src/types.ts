export interface Building {
  id: string;
  name: string;
  address: string;
  totalShares: number; // e.g. 1000 tantièmes
  constructionYear: number;
  unitsCount: number;
  image?: string;
}

export interface CoOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'owner_occupant' | 'landlord' | 'tenant';
  balance: number; // positive = owes money, negative = credit
}

export interface Unit {
  id: string;
  number: string; // Lot number
  floor: string;
  type: 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'parking' | 'cellar' | 'commercial';
  shares: number; // tantièmes (e.g. 45 / 1000)
  coOwnerId: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'maintenance' | 'heating' | 'water' | 'insurance' | 'cleaning' | 'admin' | 'works';
  date: string;
  status: 'paid' | 'pending_approval' | 'rejected';
  provider: string;
  invoiceNumber?: string;
}

export interface Resolution {
  id: string;
  title: string;
  description: string;
  estimatedBudget?: number;
  voteYes: number; // tantièmes in favor
  voteNo: number; // tantièmes against
  voteAbstain: number; // tantièmes abstained
  status: 'pending' | 'approved' | 'rejected';
}

export interface GeneralMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  resolutions: Resolution[];
  quorumReached: boolean;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electricity' | 'elevator' | 'structure' | 'cleaning' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'scheduled' | 'in_progress' | 'resolved';
  date: string;
  reportedBy: string; // Co-owner name or Tenant
  comments: Comment[];
  assignedProvider?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'alert' | 'info' | 'maintenance' | 'event';
  pinned: boolean;
}
