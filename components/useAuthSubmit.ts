// components/useAuthSubmit.ts
import { useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toastError } from "@/components/Toast";

type AuthData = { user: unknown | null; session: unknown | null };

export function useAuthSubmit() {
  const signIn = useCallback(async (email: string, password: string): Promise<AuthData> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toastError("ログインに失敗しました", error.message);
      return { user: null, session: null };
    }
    return { user: data.user ?? null, session: data.session ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthData> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toastError("サインアップに失敗しました", error.message);
      return { user: null, session: null };
    }
    return { user: data.user ?? null, session: data.session ?? null };
  }, []);

  return { signIn, signUp };
}
