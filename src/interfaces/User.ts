export interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  position: {
    id: string;
    description: string;
    name: string;
  };
}