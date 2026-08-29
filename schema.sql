-- PAYANAM DATABASE SCHEMA (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(120) UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travellers_count INT DEFAULT 1,
  budget NUMERIC(12,2) DEFAULT 0,
  invite_code VARCHAR(12) UNIQUE,
  cover_emoji VARCHAR(8) DEFAULT '🚋',
  status VARCHAR(20) DEFAULT 'planning',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE trip_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

CREATE TABLE trip_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  day_number INT,
  notes TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  paid_by UUID REFERENCES users(id),
  title VARCHAR(160) NOT NULL,
  category VARCHAR(40) DEFAULT 'general',
  amount NUMERIC(12,2) NOT NULL,
  split_type VARCHAR(20) DEFAULT 'equal',
  receipt_photo_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  share_amount NUMERIC(12,2) NOT NULL,
  is_settled BOOLEAN DEFAULT FALSE,
  settled_at TIMESTAMP
);

CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  from_user UUID REFERENCES users(id),
  to_user UUID REFERENCES users(id),
  amount NUMERIC(12,2) NOT NULL,
  is_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  role VARCHAR(10) NOT NULL,
  content TEXT NOT NULL,
  action_taken VARCHAR(60),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE trip_recaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID UNIQUE REFERENCES trips(id) ON DELETE CASCADE,
  total_spend NUMERIC(12,2),
  best_moments TEXT[],
  share_slug VARCHAR(20) UNIQUE,
  generated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_expenses_trip ON expenses(trip_id);
CREATE INDEX idx_splits_expense ON expense_splits(expense_id);
CREATE INDEX idx_members_trip ON trip_members(trip_id);
CREATE INDEX idx_places_trip ON trip_places(trip_id);
