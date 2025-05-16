/*
  # Create quotes table

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `customer_name` (text) - Customer's full name
      - `phone` (text) - Contact number
      - `address` (text) - Delivery/installation address
      - `height` (numeric) - Height in centimeters
      - `width` (numeric) - Width in centimeters
      - `frame_width` (numeric) - Optional frame width in centimeters
      - `needs_installation` (boolean) - Whether installation is required
      - `total_price` (numeric) - Total price including installation if selected
      - `status` (text) - Quote status (pending, approved, rejected)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid) - Reference to the user who created the quote

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  height numeric NOT NULL,
  width numeric NOT NULL,
  frame_width numeric,
  needs_installation boolean DEFAULT false,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create quotes"
  ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());