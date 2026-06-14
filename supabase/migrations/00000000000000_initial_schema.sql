-- ============================================================
-- PASSO 1: Executar este SQL completo no Supabase SQL Editor
-- Aceder: https://supabase.com/dashboard/project/qtdhmwyngbvtesifbsrj/sql/new
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('ADMINISTRADOR', 'COORDENADOR', 'EXPLICADOR', 'ESTUDANTE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('PENDENTE', 'ATIVA', 'REJEITADA', 'CANCELADA');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE material_type AS ENUM ('PDF', 'FICHA', 'EXAME', 'LINK', 'OUTRO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  universidade TEXT,
  curso TEXT,
  papel user_role NOT NULL DEFAULT 'ESTUDANTE',
  foto_perfil TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.disciplinas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  playlist_nome TEXT,
  playlist_url TEXT,
  explicador_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  ativa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inscricoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estudante_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  disciplina_id UUID NOT NULL REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  estado subscription_status NOT NULL DEFAULT 'PENDENTE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(estudante_id, disciplina_id)
);

CREATE TABLE IF NOT EXISTS public.pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inscricao_id UUID NOT NULL REFERENCES public.inscricoes(id) ON DELETE CASCADE,
  valor DECIMAL(10, 2) NOT NULL,
  comprovativo_url TEXT,
  estado payment_status NOT NULL DEFAULT 'PENDENTE',
  validado_por UUID REFERENCES public.users(id) ON DELETE SET NULL,
  data_validacao TIMESTAMPTZ,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.materiais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disciplina_id UUID NOT NULL REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  tipo material_type NOT NULL DEFAULT 'OUTRO',
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers (recreate safely)
DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
DROP TRIGGER IF EXISTS disciplinas_updated_at ON public.disciplinas;
CREATE TRIGGER disciplinas_updated_at BEFORE UPDATE ON public.disciplinas FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
DROP TRIGGER IF EXISTS inscricoes_updated_at ON public.inscricoes;
CREATE TRIGGER inscricoes_updated_at BEFORE UPDATE ON public.inscricoes FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
DROP TRIGGER IF EXISTS pagamentos_updated_at ON public.pagamentos;
CREATE TRIGGER pagamentos_updated_at BEFORE UPDATE ON public.pagamentos FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
DROP TRIGGER IF EXISTS materiais_updated_at ON public.materiais;
CREATE TRIGGER materiais_updated_at BEFORE UPDATE ON public.materiais FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscricoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read their own profile" ON public.users;
DROP POLICY IF EXISTS "Coordenadores and Administradores can read all profiles" ON public.users;
DROP POLICY IF EXISTS "Explicadores can read their students profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Disciplinas are viewable by everyone" ON public.disciplinas;
DROP POLICY IF EXISTS "Explicadores can manage their own disciplines" ON public.disciplinas;
DROP POLICY IF EXISTS "Admins/Coordenadores can manage all disciplines" ON public.disciplinas;
DROP POLICY IF EXISTS "Estudantes can view their own enrollments" ON public.inscricoes;
DROP POLICY IF EXISTS "Estudantes can create their own enrollments" ON public.inscricoes;
DROP POLICY IF EXISTS "Explicadores can view enrollments for their disciplines" ON public.inscricoes;
DROP POLICY IF EXISTS "Admins/Coordenadores can manage all enrollments" ON public.inscricoes;
DROP POLICY IF EXISTS "Estudantes can view their own payments" ON public.pagamentos;
DROP POLICY IF EXISTS "Estudantes can create payments for their enrollments" ON public.pagamentos;
DROP POLICY IF EXISTS "Explicadores can view payments for their disciplines" ON public.pagamentos;
DROP POLICY IF EXISTS "Admins/Coordenadores can manage all payments" ON public.pagamentos;
DROP POLICY IF EXISTS "Estudantes inscritos ativos can view materials" ON public.materiais;
DROP POLICY IF EXISTS "Explicadores can manage materials for their disciplines" ON public.materiais;
DROP POLICY IF EXISTS "Admins/Coordenadores can manage all materials" ON public.materiais;

-- USERS RLS Policies
CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins and Coordenadores can read all profiles" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.papel IN ('COORDENADOR', 'ADMINISTRADOR'))
  );

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Allow service_role to insert (used during registration)
CREATE POLICY "Service role can insert users" ON public.users
  FOR INSERT WITH CHECK (true);

-- DISCIPLINAS RLS Policies
CREATE POLICY "Disciplinas are viewable by everyone" ON public.disciplinas
  FOR SELECT USING (true);

CREATE POLICY "Explicadores can manage their own disciplines" ON public.disciplinas
  FOR ALL USING (auth.uid() = explicador_id);

CREATE POLICY "Admins/Coordenadores can manage all disciplines" ON public.disciplinas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.papel IN ('COORDENADOR', 'ADMINISTRADOR'))
  );

-- INSCRICOES RLS Policies
CREATE POLICY "Estudantes can view their own enrollments" ON public.inscricoes
  FOR SELECT USING (auth.uid() = estudante_id);

CREATE POLICY "Estudantes can create their own enrollments" ON public.inscricoes
  FOR INSERT WITH CHECK (auth.uid() = estudante_id);

CREATE POLICY "Explicadores can view enrollments for their disciplines" ON public.inscricoes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.disciplinas d WHERE d.id = inscricoes.disciplina_id AND d.explicador_id = auth.uid())
  );

CREATE POLICY "Admins/Coordenadores can manage all enrollments" ON public.inscricoes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.papel IN ('COORDENADOR', 'ADMINISTRADOR'))
  );

-- PAGAMENTOS RLS Policies
CREATE POLICY "Estudantes can view their own payments" ON public.pagamentos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.inscricoes i WHERE i.id = pagamentos.inscricao_id AND i.estudante_id = auth.uid())
  );

CREATE POLICY "Estudantes can create payments for their enrollments" ON public.pagamentos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.inscricoes i WHERE i.id = pagamentos.inscricao_id AND i.estudante_id = auth.uid())
  );

CREATE POLICY "Admins/Coordenadores can manage all payments" ON public.pagamentos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.papel IN ('COORDENADOR', 'ADMINISTRADOR'))
  );

-- MATERIAIS RLS Policies
CREATE POLICY "Estudantes inscritos can view materials" ON public.materiais
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inscricoes i
      WHERE i.disciplina_id = materiais.disciplina_id AND i.estudante_id = auth.uid() AND i.estado = 'ATIVA'
    )
  );

CREATE POLICY "Explicadores can manage materials for their disciplines" ON public.materiais
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.disciplinas d WHERE d.id = materiais.disciplina_id AND d.explicador_id = auth.uid())
  );

CREATE POLICY "Admins/Coordenadores can manage all materials" ON public.materiais
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.papel IN ('COORDENADOR', 'ADMINISTRADOR'))
  );

-- Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('payment-proofs', 'payment-proofs', false),
('discipline-materials', 'discipline-materials', false),
('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;
