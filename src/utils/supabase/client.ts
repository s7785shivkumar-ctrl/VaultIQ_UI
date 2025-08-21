import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-d3c2102d`;