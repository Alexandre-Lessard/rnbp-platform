export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
  clientNumber: string | null;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};
