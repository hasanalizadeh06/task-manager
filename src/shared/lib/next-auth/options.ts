import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { LoginResponse } from "@/interfaces/Login";

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const role = "USER";
  return clxRequest.post(`/auth/register`, {
    firstName,
    lastName,
    email,
    password,
    role,
  });
}



export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        try {
          const response = await clxRequest.post<LoginResponse>(`/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });
          if (response && response.user) {
            const user = response.user;
            return {
              id: user.id,
              name: user.name ?? null,
              email: user.email ?? null,
              image: user.image ?? null,
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
};
