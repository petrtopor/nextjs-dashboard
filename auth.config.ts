import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnProfile = nextUrl.pathname.startsWith('/profile');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      if(isOnLogin && isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
      if (isOnDashboard || isOnProfile) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if(user?.role) {
        token.role = user.role;
      }
      return token
    },
    async session({ session, token }) {
      if(token?.role) {
        session.user.role = token.role;
      }
      if(token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;