export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  emailVerified: boolean;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};
