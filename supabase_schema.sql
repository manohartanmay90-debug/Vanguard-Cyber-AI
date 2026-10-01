# ============================================
#  Aegis AI - Database Setup
#  Run this SQL in your Supabase SQL Editor
# ============================================

-- ─── TABLES ─────────────────────────────────

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('employee', 'admin')),
  email TEXT NOT NULL
);

CREATE TABLE public.prompts_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  original_prompt TEXT NOT NULL,
  masked_prompt TEXT,
  ai_response TEXT,
  status TEXT NOT NULL CHECK (status IN ('passed', 'modified', 'blocked')),
  threat_reason TEXT,
  pii_entities_found INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ──────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts_log ENABLE ROW LEVEL SECURITY;

-- Employees: insert and read their own logs only
CREATE POLICY "Users can insert own logs"
  ON public.prompts_log
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own logs"
  ON public.prompts_log
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins: read all logs
CREATE POLICY "Admins can read all logs"
  ON public.prompts_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── TRIGGER: Auto-populate profiles on signup ──

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'employee')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ─── NOTES ───────────────────────────────────────
-- To create an admin user, manually update their profile:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@yourcompany.com';
