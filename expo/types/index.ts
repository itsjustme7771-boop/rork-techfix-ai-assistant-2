export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  equipment: string;
  symptoms: string[];
  solution: string;
  authorName: string;
  authorRole: string;
  yearsExperience: number;
  createdAt: number;
  upvotes: number;
  difficulty: 'easy' | 'moderate' | 'advanced';
}

export interface EquipmentCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export type SubscriptionTier = 'technician' | 'lead' | 'management';

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  tier: SubscriptionTier;
  yearsExperience: number;
  specialties: string[];
  contributionCount: number;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
}
