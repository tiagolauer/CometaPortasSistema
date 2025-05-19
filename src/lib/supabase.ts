import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

const getRoleName = async (roleId: string) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('name')
      .eq('id', roleId)
      .single();

    if (error) throw error;
    return data?.name;
  } catch (error) {
    console.error('Error fetching role:', error);
    return null;
  }
};

export const getProfile = async (userId: string) => {
  try {
    if (!userId) {
      console.error('getProfile: userId não fornecido ou inválido:', userId);
      return null;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role_id, full_name, active')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro do Supabase ao buscar perfil:', error, 'userId:', userId);
      throw error;
    }
    if (!data) {
      console.warn('Nenhum perfil encontrado para userId:', userId);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil (catch):', error, 'userId:', userId);
    return null;
  }
};

export const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      // Se o erro for relacionado ao refresh token, faça logout preventivo
      if (error.message && error.message.toLowerCase().includes('refresh token')) {
        await supabase.auth.signOut();
        return null;
      }
      throw error;
    }

    if (!session) return null;

    const profile = await getProfile(session.user.id);
    if (!profile || !profile.active) {
      await supabase.auth.signOut();
      return null;
    }

    const roleName = profile.role_id ? await getRoleName(profile.role_id) : null;

    return {
      user: session.user,
      profile,
      isAdmin: roleName === 'admin'
    };
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
};