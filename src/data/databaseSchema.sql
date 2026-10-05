-- ==============================================================================
-- ANALYTIX: STATE CAMPAIGN INTELLIGENCE PLATFORM
-- PRODUCTION POSTGRESQL & POSTGIS DATABASE SCHEMA (UTTAR PRADESH 403 ACs)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. State Table
CREATE TABLE IF NOT EXISTS states (
    id VARCHAR(10) PRIMARY KEY, -- e.g. 'UP'
    name VARCHAR(100) NOT NULL,
    capital VARCHAR(100) NOT NULL,
    total_assembly_constituencies INT NOT NULL DEFAULT 403,
    total_parliamentary_constituencies INT NOT NULL DEFAULT 80,
    total_districts INT NOT NULL DEFAULT 75,
    official_code VARCHAR(10) NOT NULL DEFAULT 'S24', -- ECI State Code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Districts Table
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(50) PRIMARY KEY,
    state_id VARCHAR(10) REFERENCES states(id),
    name VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL, -- e.g. Western UP, Purvanchal, Awadh, Bundelkhand, Braj
    headquarters VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Parliamentary Constituencies (Lok Sabha)
CREATE TABLE IF NOT EXISTS parliamentary_constituencies (
    id VARCHAR(50) PRIMARY KEY,
    state_id VARCHAR(10) REFERENCES states(id),
    pc_number INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    reserved_category VARCHAR(10) DEFAULT 'GEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Assembly Constituencies (Vidhan Sabha 1 to 403)
CREATE TABLE IF NOT EXISTS assembly_constituencies (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'up-ac-174'
    state_id VARCHAR(10) REFERENCES states(id),
    district_id VARCHAR(50) REFERENCES districts(id),
    pc_id VARCHAR(50) REFERENCES parliamentary_constituencies(id),
    constituency_number INT NOT NULL UNIQUE, -- 1 to 403
    name VARCHAR(150) NOT NULL,
    reserved_category VARCHAR(10) DEFAULT 'GEN', -- 'GEN', 'SC', 'ST'
    centroid_latitude NUMERIC(9, 6),
    centroid_longitude NUMERIC(9, 6),
    source VARCHAR(100) DEFAULT 'Election Commission of India (ECI)',
    source_url VARCHAR(255) DEFAULT 'https://eci.gov.in',
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Geographic Boundary Geometry (PostGIS MultiPolygon)
CREATE TABLE IF NOT EXISTS geographic_boundaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL, -- 'ASSEMBLY_CONSTITUENCY', 'DISTRICT', 'BOOTH'
    entity_id VARCHAR(50) NOT NULL,
    geometry GEOMETRY(MultiPolygon, 4326) NOT NULL,
    bounding_box BOX2D,
    area_sq_km NUMERIC(10, 2),
    simplified_tolerance NUMERIC(6, 4) DEFAULT 0.001,
    delimitation_year INT DEFAULT 2008,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ac_geom ON geographic_boundaries USING GIST(geometry);

-- 6. Elections Registry
CREATE TABLE IF NOT EXISTS elections (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'up-vs-2022'
    state_id VARCHAR(10) REFERENCES states(id),
    election_type VARCHAR(50) NOT NULL, -- 'GENERAL_ASSEMBLY', 'BYE_ELECTION'
    election_year INT NOT NULL,
    assembly_term VARCHAR(100) NOT NULL DEFAULT '18th Uttar Pradesh Legislative Assembly',
    notification_date DATE,
    poll_date DATE,
    counting_date DATE,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Political Parties
CREATE TABLE IF NOT EXISTS parties (
    id VARCHAR(50) PRIMARY KEY,
    party_code VARCHAR(20) NOT NULL UNIQUE, -- 'BJP', 'SP', 'RLD', 'INC', 'BSP'
    party_name VARCHAR(150) NOT NULL,
    party_symbol VARCHAR(100),
    is_national_party BOOLEAN DEFAULT FALSE,
    is_state_recognized BOOLEAN DEFAULT TRUE
);

-- 8. Candidates
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    election_id VARCHAR(50) REFERENCES elections(id),
    constituency_id VARCHAR(50) REFERENCES assembly_constituencies(id),
    party_id VARCHAR(50) REFERENCES parties(id),
    candidate_name VARCHAR(150) NOT NULL,
    gender VARCHAR(10),
    age INT,
    declared_assets NUMERIC(15, 2),
    criminal_cases INT DEFAULT 0
);

-- 9. Election Results (Official ECI Historical Results)
CREATE TABLE IF NOT EXISTS election_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    election_id VARCHAR(50) REFERENCES elections(id),
    constituency_id VARCHAR(50) REFERENCES assembly_constituencies(id),
    winning_candidate_id UUID REFERENCES candidates(id),
    winning_party_id VARCHAR(50) REFERENCES parties(id),
    runner_up_party_id VARCHAR(50) REFERENCES parties(id),
    total_electors INT NOT NULL,
    total_votes_polled INT NOT NULL,
    valid_votes INT NOT NULL,
    turnout_percentage NUMERIC(5, 2) NOT NULL,
    margin_votes INT NOT NULL,
    margin_percentage NUMERIC(5, 2),
    eci_report_citation VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Elector Statistics
CREATE TABLE IF NOT EXISTS elector_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    constituency_id VARCHAR(50) REFERENCES assembly_constituencies(id),
    total_electors INT NOT NULL,
    male_electors INT,
    female_electors INT,
    third_gender_electors INT,
    service_voters INT,
    total_polling_stations INT NOT NULL,
    revision_date DATE DEFAULT '2024-01-01',
    source VARCHAR(100) DEFAULT 'ECI SSR Data'
);

-- ==============================================================================
-- CAMPAIGN OPERATIONS & TELEMETRY MODULES (SEPARATED FROM ELECTION DATA)
-- ==============================================================================

-- 11. Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(50) PRIMARY KEY,
    state_id VARCHAR(10) REFERENCES states(id),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    campaign_type VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_audience_size INT NOT NULL,
    objective TEXT,
    is_synthetic_demo BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 12. Campaign Activity Telemetry
CREATE TABLE IF NOT EXISTS campaign_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id VARCHAR(50) REFERENCES campaigns(id),
    constituency_id VARCHAR(50) REFERENCES assembly_constituencies(id),
    activity_date DATE NOT NULL,
    reach_count INT DEFAULT 0,
    calls_count INT DEFAULT 0,
    whatsapp_count INT DEFAULT 0,
    sms_count INT DEFAULT 0,
    engagement_rate NUMERIC(5, 2) DEFAULT 0.0,
    responses_count INT DEFAULT 0,
    follow_ups_count INT DEFAULT 0,
    is_demo_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Channel Activities (Calls, WhatsApp, SMS, Social, Digital)
CREATE TABLE IF NOT EXISTS call_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    constituency_id VARCHAR(50) REFERENCES assembly_constituencies(id),
    campaign_id VARCHAR(50) REFERENCES campaigns(id),
    initiated_count INT NOT NULL,
    connected_count INT NOT NULL,
    avg_duration_sec INT,
    connection_rate NUMERIC(5, 2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whatsapp_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    constituency_id VARCHAR(50) REFERENCES assembly_constituencies(id),
    messages_sent INT NOT NULL,
    delivered_count INT NOT NULL,
    read_count INT NOT NULL,
    replies_count INT NOT NULL,
    link_clicks INT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sms_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    constituency_id VARCHAR(50) REFERENCES assembly_constituencies(id),
    dlt_template_id VARCHAR(50),
    sent_count INT NOT NULL,
    delivered_count INT NOT NULL,
    failed_count INT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS social_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    constituency_id VARCHAR(50) REFERENCES assembly_constituencies(id),
    platform VARCHAR(50) NOT NULL,
    impressions INT NOT NULL,
    reach INT NOT NULL,
    likes INT,
    comments INT,
    shares INT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS digital_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    constituency_id VARCHAR(50) REFERENCES assembly_constituencies(id),
    event_name VARCHAR(100) NOT NULL,
    business_label VARCHAR(150) NOT NULL,
    event_count INT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Aggregate AI Conversation Insights (Strictly Anonymized, Non-Profiling)
CREATE TABLE IF NOT EXISTS conversation_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    constituency_id VARCHAR(50) REFERENCES assembly_constituencies(id),
    topic_category VARCHAR(100) NOT NULL,
    volume INT NOT NULL,
    positive_percentage NUMERIC(5, 2),
    neutral_percentage NUMERIC(5, 2),
    concern_percentage NUMERIC(5, 2),
    sample_faq TEXT,
    common_civic_concern TEXT,
    field_directive TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Reports Registry
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(50) PRIMARY KEY,
    state_id VARCHAR(10) REFERENCES states(id),
    title VARCHAR(200) NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    file_format VARCHAR(20) NOT NULL,
    file_size VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Ready',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
