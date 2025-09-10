import { supabase } from "./supabase";
import { AuthError, User, Session } from "@supabase/supabase-js";

export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export class AuthService {
  // Sign up new user
  static async signUp(
    email: string,
    password: string,
    fullName?: string
  ): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            display_name: fullName,
          },
        },
      });

      return {
        user: data.user,
        session: data.session,
        error: error,
      };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  // Sign in existing user
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return {
        user: data.user,
        session: data.session,
        error: error,
      };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  // Sign out user
  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error: error as AuthError };
    }
  }

  // Get current session
  static async getCurrentSession(): Promise<Session | null> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error("Get session error:", error);
      return null;
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error("Get user error:", error);
      return null;
    }
  }

  // Reset password
  static async resetPassword(
    email: string
  ): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error: error as AuthError };
    }
  }
}
