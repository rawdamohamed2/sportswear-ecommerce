import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data: currentUser, error: userError } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('id', user.id)
            .single();

        if (userError) return res.status(500).json({ error: userError.message });

        if (currentUser.role === 'admin') {
            const { data: allUsers, error: allError } = await supabase
                .from('users')
                .select('id, name, email, role');

            if (allError) return res.status(500).json({ error: allError.message });

            return res.status(200).json(allUsers);
        }

        return res.status(200).json([currentUser]);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
}
