export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: "USER" | "ADMIN" | "TECNICO";
  token: string;
}
