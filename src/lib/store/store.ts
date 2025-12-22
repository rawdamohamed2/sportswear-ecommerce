// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabase/supabase';
import { User } from '@/types';

interface UserState {
    id: string;
    email: string;
}
interface roleState {
    role: string;
    id: string;
}

interface StoreState {
    user: UserState | null;
    CurrentUser: roleState | null;
    data:object;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    signUp: (signdata: { name: string; email: string; password: string; phone?: string; role: 'customer' | 'admin' }) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    setCurrentUser: (id: string) => Promise<void>;
    signOut: () => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}


export const useStore = create<StoreState>()(

    persist(
        (set) => ({
            user: null,
            token: null,
            CurrentUser:null,
            refreshToken:null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            data: {},
            setLoading: (loading) => set({ isLoading: loading }),
            setUser: (user:User) => set({
                user,
                isAuthenticated: !!user
            }),
            setError: (error) => set(() => ({ error })),

            signUp: async (signdata) => {
                set({ isLoading: true, error: null });
                try {
                    const {data,error } = await supabase.auth.signUp({
                        email:signdata.email,
                        password: signdata.password
                    });
                    if (error) {
                        set({ error: error.message });
                        return ;
                    }
                    const { error: insertError } = await supabase
                        .from('users')
                        .insert([{ name:signdata.name,password:signdata.password, email:signdata.email, phone:signdata.phone, role:signdata.role }]);

                    if (insertError) {
                        set({ error: insertError.message });
                        return;
                    }

                } catch (err: any) {
                    set({ error: err.message });
                    console.log(err.message);
                } finally {
                    set({ isLoading: false });
                }
            },

            signIn: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    })

                    if (error){
                        set({ error: error.message });
                        return;
                    }

                    set({
                        token: data.session?.access_token || null,
                        refreshToken: data.session?.refresh_token || null,
                        user: {
                            id: data.user.id,
                            email: data.user.email || '',
                        },
                        isAuthenticated: true,
                    });
                    console.log(data);

                } catch (err: any) {
                    set({ error: err.message });
                } finally {
                    set({ isLoading: false });
                }
            },

            signOut: async () => {
                await supabase.auth.signOut();
                set({ user: null, token: null, isAuthenticated: false });
                window.location.href = '/auth/login';
            },


            setCurrentUser:async (email: string) => {
                set({ isLoading: true, error: null });
                try {
                    const { data, error } = await supabase
                        .from('users')
                        .select("role,id")
                        .eq('email', email)
                        .maybeSingle();

                    if (error){
                        set({ error: error.message });
                        return;
                    }
                    set({ CurrentUser: data });


                } catch (err: any) {
                    set({ error: err.message || "Unknown error" });
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'auth-store', // الاسم اللي هيحفظ في localStorage
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated,error:state.error,CurrentUser:state.CurrentUser }),
        }
    )
);

