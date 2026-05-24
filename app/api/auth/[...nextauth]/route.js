import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${API_URL}/auth/login`, {
            email:    credentials.email,
            password: credentials.password,
          });
          if (res.data?.user && res.data?.token) {
            return {
              id:          res.data.user._id?.toString(),
              name:        res.data.user.name,
              email:       res.data.user.email,
              image:       res.data.user.photo || null,
              accessToken: res.data.token,
            };
          }
          return null;
        } catch (err) {
          const msg = err.response?.data?.message || "Login failed";
          throw new Error(msg);
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await axios.post(`${API_URL}/auth/google`, {
            name:  user.name,
            email: user.email,
            photo: user.image,
          });
        } catch {
          // user already exists — no problem
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id          = user.id;
        token.name        = user.name;
        token.email       = user.email;
        token.picture     = user.image;
        token.accessToken = user.accessToken;
      }

      // Google login: generate JWT from backend
      if (account?.provider === "google" && !token.accessToken) {
        try {
          const res = await axios.post(`${API_URL}/jwt`, {
            email: token.email,
            name:  token.name,
          });
          token.accessToken = res.data.token;
        } catch {
          // ignore
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id    = token.id;
      session.user.email = token.email;
      session.user.name  = token.name;
      session.user.image = token.picture;
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn:  "/login",
    error:   "/login",
  },

  session:  { strategy: "jwt" },
  secret:   process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
