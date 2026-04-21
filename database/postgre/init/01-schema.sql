-- =====================================================
-- FARM-AID DATABASE SCHEMA
-- PostgreSQL Implementation
-- =====================================================

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE user_role AS ENUM ('farmer', 'veterinarian', 'admin');
CREATE TYPE species_type AS ENUM ('cattle', 'goat', 'sheep');
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE consultation_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE report_status AS ENUM ('draft', 'submitted', 'verified', 'rejected');
CREATE TYPE notifiable_disease_type AS ENUM ('FMD', 'heartwater', 'tick_borne', 'other');

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- Users table (base table for all user types)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farmer profiles
CREATE TABLE farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(255),
    farm_location VARCHAR(255),
    village VARCHAR(100),
    district VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'English', -- 'English' or 'Setswana'
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Veterinarian profiles
CREATE TABLE veterinarians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100),
    specialization VARCHAR(255),
    organization VARCHAR(255),
    years_experience INTEGER,
    is_verified BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Administrator profiles
CREATE TABLE administrators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    permissions TEXT[] DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- HERD RECORDS MANAGEMENT
-- =====================================================

-- Livestock animals table
CREATE TABLE livestock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    baits_tag_number VARCHAR(50) UNIQUE NOT NULL,
    species species_type NOT NULL,
    breed VARCHAR(100),
    date_of_birth DATE,
    gender gender_type,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Index for fast lookups
    CONSTRAINT unique_baits_per_farmer UNIQUE (farmer_id, baits_tag_number)
);

-- Vaccination records
CREATE TABLE vaccinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    livestock_id UUID NOT NULL REFERENCES livestock(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(255) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_due_date DATE,
    administered_by VARCHAR(255),
    batch_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health records (sickness, treatment, recovery)
CREATE TABLE health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    livestock_id UUID NOT NULL REFERENCES livestock(id) ON DELETE CASCADE,
    onset_date DATE NOT NULL,
    symptoms TEXT NOT NULL,
    diagnosis TEXT,
    treatment TEXT,
    medication_given TEXT,
    recovery_date DATE,
    is_resolved BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DISEASE KNOWLEDGE BASE
-- =====================================================

-- Diseases table
CREATE TABLE diseases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_setswana VARCHAR(255),
    scientific_name VARCHAR(255),
    species_affected species_type[],
    is_notifiable BOOLEAN DEFAULT false,
    reporting_authority VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disease details (multilingual content)
CREATE TABLE disease_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_id UUID NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL, -- 'English' or 'Setswana'
    cause TEXT,
    symptoms TEXT,
    treatment TEXT,
    prevention TEXT,
    reporting_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(disease_id, language)
);

-- Disease images
CREATE TABLE disease_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_id UUID NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    language VARCHAR(10),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SYMPTOM CHECKER & AI DIAGNOSIS
-- =====================================================

-- Symptoms catalog
CREATE TABLE symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symptom_name VARCHAR(255) NOT NULL,
    symptom_name_setswana VARCHAR(255),
    affected_body_part VARCHAR(100), -- mouth, feet, skin, breathing, stomach
    species_applicable species_type[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disease-symptom relationships (for AI model training)
CREATE TABLE disease_symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_id UUID NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
    symptom_id UUID NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
    weight DECIMAL(3,2), -- Importance weight for diagnosis (0-1)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(disease_id, symptom_id)
);

-- Symptom checker sessions
CREATE TABLE symptom_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    livestock_id UUID REFERENCES livestock(id) ON DELETE SET NULL,
    species species_type NOT NULL,
    affected_body_part VARCHAR(100),
    photo_url TEXT,
    ai_diagnosis TEXT, -- JSON or disease name
    confidence_score DECIMAL(3,2), -- 0-1
    suggested_disease_id UUID REFERENCES diseases(id),
    user_feedback BOOLEAN, -- Was AI correct?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Symptoms selected during a check
CREATE TABLE symptom_check_selections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symptom_check_id UUID NOT NULL REFERENCES symptom_checks(id) ON DELETE CASCADE,
    symptom_id UUID NOT NULL REFERENCES symptoms(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TELEHEALTH CONSULTATIONS
-- =====================================================

-- Consultation requests
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    veterinarian_id UUID REFERENCES veterinarians(id) ON DELETE SET NULL,
    livestock_id UUID REFERENCES livestock(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    photo_urls TEXT[], -- Array of photo URLs
    status consultation_status DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    assigned_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultation messages (chat)
CREATE TABLE consultation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    sender_type user_role NOT NULL,
    sender_id UUID NOT NULL, -- References users.id
    message TEXT NOT NULL,
    attachment_urls TEXT[],
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DISEASE REPORTING (Department of Veterinary Services)
-- =====================================================

-- Disease reports from farmers
CREATE TABLE disease_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    livestock_id UUID REFERENCES livestock(id) ON DELETE SET NULL,
    disease_type notifiable_disease_type NOT NULL,
    suspected_disease_id UUID REFERENCES diseases(id),
    symptoms_observed TEXT NOT NULL,
    affected_animals_count INTEGER,
    location VARCHAR(255) NOT NULL,
    photo_urls TEXT[],
    report_status report_status DEFAULT 'submitted',
    verified_by UUID REFERENCES veterinarians(id),
    verification_notes TEXT,
    verification_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ALERTS & NOTIFICATIONS
-- =====================================================

-- Disease outbreak alerts
CREATE TABLE disease_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_id UUID NOT NULL REFERENCES diseases(id),
    title VARCHAR(255) NOT NULL,
    title_setswana VARCHAR(255),
    description TEXT NOT NULL,
    description_setswana TEXT,
    affected_districts TEXT[],
    movement_restrictions TEXT,
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    is_active BOOLEAN DEFAULT true,
    issued_by UUID REFERENCES administrators(id),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Weather alerts
CREATE TABLE weather_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50) NOT NULL, -- 'drought', 'flood', 'storm', 'extreme_heat'
    title VARCHAR(255) NOT NULL,
    title_setswana VARCHAR(255),
    description TEXT NOT NULL,
    description_setswana TEXT,
    affected_districts TEXT[],
    severity VARCHAR(20) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- User notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'disease_alert', 'weather_alert', 'consultation', 'report_verification'
    reference_id UUID, -- ID of related entity (alert, consultation, etc.)
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MARKET PRICES (Cached for offline access)
-- =====================================================

CREATE TABLE market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type VARCHAR(100) NOT NULL, -- 'cattle', 'goat', 'sheep', 'feed', 'vaccine'
    district VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50), -- 'per_head', 'per_kg', 'per_bag'
    source VARCHAR(255),
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- KNOWLEDGE BASE ARTICLES (Vet-contributed content)
-- =====================================================

CREATE TABLE knowledge_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    title_setswana VARCHAR(255),
    content TEXT NOT NULL,
    content_setswana TEXT,
    category VARCHAR(100), -- 'disease_prevention', 'nutrition', 'breeding', 'general'
    author_id UUID REFERENCES veterinarians(id),
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DISEASE CONTROL ZONES
-- =====================================================

CREATE TABLE disease_control_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_name VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    restriction_level VARCHAR(50), -- 'red', 'yellow', 'green'
    movement_restrictions TEXT,
    disease_id UUID REFERENCES diseases(id),
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SYNC METADATA (For offline-first architecture)
-- =====================================================

CREATE TABLE sync_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_name VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    farmer_id UUID REFERENCES farmers(id),
    last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'synced', 'failed'
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Livestock indexes
CREATE INDEX idx_livestock_farmer_id ON livestock(farmer_id);
CREATE INDEX idx_livestock_baits_tag ON livestock(baits_tag_number);
CREATE INDEX idx_livestock_species ON livestock(species);

-- Health records indexes
CREATE INDEX idx_health_records_livestock_id ON health_records(livestock_id);
CREATE INDEX idx_health_records_onset_date ON health_records(onset_date);

-- Consultations indexes
CREATE INDEX idx_consultations_farmer_id ON consultations(farmer_id);
CREATE INDEX idx_consultations_veterinarian_id ON consultations(veterinarian_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_created_at ON consultations(created_at);

-- Messages indexes
CREATE INDEX idx_messages_consultation_id ON consultation_messages(consultation_id);
CREATE INDEX idx_messages_created_at ON consultation_messages(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Disease reports indexes
CREATE INDEX idx_disease_reports_farmer_id ON disease_reports(farmer_id);
CREATE INDEX idx_disease_reports_status ON disease_reports(report_status);
CREATE INDEX idx_disease_reports_created_at ON disease_reports(created_at);

-- Symptom checks indexes
CREATE INDEX idx_symptom_checks_farmer_id ON symptom_checks(farmer_id);
CREATE INDEX idx_symptom_checks_created_at ON symptom_checks(created_at);

-- Market prices indexes
CREATE INDEX idx_market_prices_district ON market_prices(district);
CREATE INDEX idx_market_prices_product_type ON market_prices(product_type);

-- Alerts indexes
CREATE INDEX idx_disease_alerts_is_active ON disease_alerts(is_active);
CREATE INDEX idx_disease_alerts_issued_at ON disease_alerts(issued_at);
CREATE INDEX idx_weather_alerts_is_active ON weather_alerts(is_active);

-- Sync metadata indexes
CREATE INDEX idx_sync_metadata_farmer_id ON sync_metadata(farmer_id);
CREATE INDEX idx_sync_metadata_sync_status ON sync_metadata(sync_status);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farmers_updated_at BEFORE UPDATE ON farmers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_veterinarians_updated_at BEFORE UPDATE ON veterinarians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_administrators_updated_at BEFORE UPDATE ON administrators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_livestock_updated_at BEFORE UPDATE ON livestock FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_diseases_updated_at BEFORE UPDATE ON diseases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disease_details_updated_at BEFORE UPDATE ON disease_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disease_reports_updated_at BEFORE UPDATE ON disease_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disease_control_zones_updated_at BEFORE UPDATE ON disease_control_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_articles_updated_at BEFORE UPDATE ON knowledge_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sync_metadata_updated_at BEFORE UPDATE ON sync_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();