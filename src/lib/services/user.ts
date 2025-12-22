import { supabase } from '../supabase/supabase';
import { User ,UserData} from '@/types/index';
import {toast} from "sonner";

export class UserService {
    // Get all users (admin only)
    static async getUsers(limit = 50, page = 1) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabase
            .from('users')
            .select('*', { count: 'exact' })
            .range(from, to)
            .order('created_at', { ascending: false });

        return {
            users: data as User[],
            count: count || 0,
            error:error
        };
    }

    static async addUser(updates: Partial<UserData>) {

        try {
            const { data: existing, error: existErr } = await supabase
                .from('users')
                .select('id')
                .eq('email', updates.email)
                .limit(1);

            if (existErr) return { error: existErr.message };

            if (existing && existing.length > 0) {
                return { error: 'Email already exists in users table' };
            }
            console.log(existErr);
            const { data: createdAuth, error: authError } = await supabase.auth.admin.createUser({
                email:updates.email,
                password:updates.password,
                email_confirm: true,
                user_metadata: { name:updates.name, phone:updates.phone, role:updates.role }
            });
            const authUser = createdAuth?.user;
            if (!authUser?.id) return { error: 'Failed to create auth user' };
            console.log(authUser);
            if (authError) return authError?.message;

            const { error: insertError } = await supabase
                .from('users')
                .insert([{
                    id: authUser.id, // ربط معرف auth مع جدول users
                    name:updates.name,
                    email:updates.email,
                    password:updates.password,
                    phone: updates.phone || null,
                    role:updates.role
                }]);
            console.log(insertError);
            if (insertError) {
                await supabase.auth.admin.deleteUser(authUser.id).catch(() => null);
                return { error: insertError.message };
            }


            return 'user added successfully';
        }
        catch (err) {
            return { error: err|| 'Unknown error' };
        }

    }
    // Update user (admin only)
    static async updateUser(id: string, updates: Partial<User>) {
        const { data ,error:emailError } = await supabase
            .from('users')
            .select('email')
            .eq('id', id)
            .maybeSingle();
        const email = data?.email;
        console.log(email);
        if(emailError) return  emailError.message;
        const { data: auth } = await supabase.auth.admin.listUsers();
        const target = auth.users.find(u => u.email === email);
        const authId = target?.id;
        console.log(authId);

        // update from auth first
        if(!authId) return 'something went wrong';

        const { error: updateAuthError } = await supabase.auth.admin.updateUserById(authId, {
            email: updates.email,
            user_metadata: {
                name: updates.name,
                phone: updates.phone,
                role: updates.role
            }
        });

        if (updateAuthError) return updateAuthError?.message;

        const { error: updateTableError } = await supabase
            .from("users")
            .update({
                email: updates.email,
                name: updates.name,
                phone: updates.phone,
                role: updates.role
            })
            .eq("id", id);

        return updateTableError?.message;

    };

    // Delete user (admin only)
    static async deleteUser(id: string) {

        const { data ,error:emailError } = await supabase
            .from('users')
            .select('email')
            .eq('id', id)
            .maybeSingle();

        const email = data?.email;


        if(emailError) return  emailError.message;

        const { data: auth } = await supabase.auth.admin.listUsers();

        const target = auth.users.find(u => u.email === email);

        const authId = target?.id;

        console.log(authId);
        // Delete from auth first
        if(!authId) return 'something went wrong';

        await supabase.auth.admin.deleteUser(authId);

        // Delete from users table
         const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);
         console.log(error);
         return  error?.message;
    };

    // Get user statistics (admin)
    static async getUserStats() {
        const { count: totalUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        const { count: adminUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'admin');

        const { count: customerUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'customer');

        // Get new users this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: newUsersThisMonth } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfMonth.toISOString());

        return {
            total: totalUsers || 0,
            admins: adminUsers || 0,
            customers: customerUsers || 0,
            newThisMonth: newUsersThisMonth || 0
        };
    };

    static async getUserOrders(id:string) {
        const { data: users, error } = await supabase
            .from('users')
            .select(`
                    *,
                    orders (
                      *
                    )
              `)
            .eq('id', id)
            .single();
        console.log(users,error);
        return users;
    };

    static async getUserbyId(id: string) {
        const { data: user, error } = await supabase
            .from('users')
            .select("*")
            .eq('id', id)
            .single();

        if(error) toast(error.message);

        return  user ;

    };
}