import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lhorekdbwnrrjtgzipgs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kfHl7UUtWD4REHOuiWdpqA_wdHWdl62';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
