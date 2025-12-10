export interface DashboardStats {
  totalSubscriptions: number;
  totalWeeklySpend: number;
  totalMonthlySpend: number;
  totalYearlySpend: number;
  totalYearlyProjection: number;
  notificationsEnabledCount: number;
  expoTokenRegistered: boolean;
}

export interface NextPayment {
  id: string;
  title: string;
  amount: number;
  type: "weekly" | "monthly" | "yearly";
  nextPayment: string;
}

export interface RecentSubscription {
  id: string;
  clerkUserId: string;
  title: string;
  amount: number;
  type: "weekly" | "monthly" | "yearly";
  notifications: boolean;
  category: string;
  startDate: string;
  expoToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  nextPayments: NextPayment[];
  recentSubscriptions: RecentSubscription[];
}
