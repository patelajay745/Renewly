export interface DashboardResponse {
  stats: {
    totalSubscriptions: number;
    totalUsersWithSubscriptions: number;
    subscriptionsByType: {
      monthly: number;
      weekly: number;
      yearly: number;
    };
    notifications: {
      subscriptionsWithNotificationsEnabled: number;
      subscriptionsWithExpoToken: number;
    };
  };

  queue: {
    waiting: number;
    active: number;
    delayed: number;
    completed: number;
    failed: number;
  };

  users: {
    id: string;
    name: string;
    email: string;
    image: string;
    createdAt?: number;
    lastActiveAt?: number;
    subscriptionCount: number;
    enabledNotifications: number;
  }[];
}
