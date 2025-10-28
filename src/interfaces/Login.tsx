export interface LoginResponse {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  assignedProjects?: number;
  };
}