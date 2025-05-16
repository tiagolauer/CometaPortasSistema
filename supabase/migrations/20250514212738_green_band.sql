/*
  # Initial Schema Setup for Admin System

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Role name (admin, manager, seller)
      - `description` (text) - Role description
      - `created_at` (timestamp)

    - `profiles`
      - `id` (uuid, primary key, matches auth.users)
      - `role_id` (uuid, foreign key to roles)
      - `full_name` (text)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for admin access
    - Add policies for user profile access
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role_id uuid REFERENCES roles(id),
  full_name text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for roles table
CREATE POLICY "Admins can manage roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM roles r
        WHERE r.id = profiles.role_id
        AND r.name = 'admin'
      )
    )
  );

CREATE POLICY "All users can view roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for profiles table
CREATE POLICY "Admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM roles r
        WHERE r.id = profiles.role_id
        AND r.name = 'admin'
      )
    )
  );

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Insert initial roles
INSERT INTO roles (name, description)
VALUES 
  ('admin', 'Administrador do sistema com acesso total'),
  ('manager', 'Gerente com acesso a relatórios e aprovações'),
  ('seller', 'Vendedor com acesso básico ao sistema')
ON CONFLICT (name) DO NOTHING;