export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  STORE_OWNER = 'STORE_OWNER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  store?: Store;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  owner?: User;
  averageRating?: number;
  totalRatings?: number;
  userRating?: number | null;
  createdAt?: string;
  usersWhoRated?: UserRating[];
}

export interface Rating {
  id: string;
  value: number;
  userId: string;
  storeId: string;
  user?: User;
  store?: Store;
  createdAt: string;
  updatedAt: string;
}

export interface UserRating {
  id: string;
  name: string;
  email: string;
  address: string;
  rating: number;
  ratedAt: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface RegisterData {
  name: string;
  email: string;
  address: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateUserData extends RegisterData {
  role: UserRole;
}

export interface CreateStoreData {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

export interface FilterParams {
  name?: string;
  email?: string;
  address?: string;
  role?: UserRole;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}