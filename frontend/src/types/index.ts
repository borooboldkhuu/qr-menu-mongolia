export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'RESTAURANT_OWNER' | 'RESTAURANT_STAFF';
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverUrl?: string;
  address?: string;
  phone?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  subscriptionTier: 'STARTER' | 'PRO' | 'ENTERPRISE';
  subExpiresAt?: string;
  _count?: {
    categories: number;
    menuItems: number;
    qrCodes?: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  _count?: { menuItems: number };
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  categoryId: string;
  category?: { id: string; name: string };
}

export interface QrCode {
  id: string;
  slug: string;
  qrImageUrl?: string;
  qrSvgUrl?: string;
  createdAt: string;
  _count?: { qrAnalytics: number };
}

export interface Analytics {
  totalItems: number;
  totalCategories: number;
  totalScans: number;
  todayScans: number;
  totalQrCodes: number;
}

export interface Subscription {
  id: string;
  tier: 'STARTER' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL';
  amount: number;
  startedAt: string;
  expiresAt: string;
}
