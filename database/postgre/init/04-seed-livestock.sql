-- Insert livestock - Cattle
INSERT INTO livestock (id, farm_id, tag_number, name, species, breed, birth_date, acquisition_date, acquisition_type, gender, weight_kg, health_status, pregnancy_status, vaccination_status, last_vaccination_date, last_deworming_date) VALUES
    ('l1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'BOT-C-2024-001', 'Kgosi', 'cattle', 'Tswana', '2020-03-15', '2020-03-15', 'born', 'male', 550.0, 'healthy', 'not_pregnant', '{"vaccinations": [{"type": "FMD", "date": "2024-01-15", "next_due": "2024-07-15"}, {"type": "CBPP", "date": "2024-02-20", "next_due": "2024-08-20"}]}', '2024-01-15', '2024-03-10'),
    
    ('l2222222-2222-2222-2222-222222222222', 'f1111111-1111-1111-1111-111111111111', 'BOT-C-2024-002', 'Pula', 'cattle', 'Brahman cross', '2019-05-20', '2019-05-20', 'born', 'female', 480.0, 'healthy', 'pregnant', '{"vaccinations": [{"type": "FMD", "date": "2024-01-15", "next_due": "2024-07-15"}, {"type": "Brucellosis", "date": "2023-11-10", "next_due": "2024-11-10"}]}', '2024-01-15', '2024-03-10'),
    ('l3333333-3333-3333-3333-333333333333', 'f1111111-1111-1111-1111-111111111111', 'BOT-C-2024-003', 'Lesedi', 'cattle', 'Tswana', '2021-08-10', '2021-08-10', 'born', 'female', 420.0, 'under_treatment', 'not_pregnant', '{"vaccinations": [{"type": "FMD", "date": "2024-01-15", "next_due": "2024-07-15"}]}', '2024-01-15', '2024-03-10'),

-- Goats
    ('l4444444-4444-4444-4444-444444444444', 'f1111111-1111-1111-1111-111111111111', 'BOT-G-2024-045', 'Mmutla', 'goat', 'Boer cross', '2022-02-28', '2022-08-15', 'purchased', 'female', 45.0, 'healthy', 'pregnant', '{"vaccinations": [{"type": "Heartwater", "date": "2024-02-01", "next_due": "2024-08-01"}]}', '2024-02-01', '2024-03-15'),
    
    ('l5555555-5555-5555-5555-555555555555', 'f3333333-3333-3333-3333-333333333333', 'BOT-G-2024-078', 'Naledi', 'goat', 'Tswana', '2023-01-10', '2023-01-10', 'born', 'female', 38.0, 'recovering', 'not_pregnant', '{"vaccinations": [{"type": "Heartwater", "date": "2024-02-15", "next_due": "2024-08-15"}]}', '2024-02-15', '2024-03-01'),
    ('l6666666-6666-6666-6666-666666666666', 'f3333333-3333-3333-3333-333333333333', 'BOT-G-2024-079', 'Tau', 'goat', 'Boer', '2023-06-20', '2023-06-20', 'born', 'male', 52.0, 'healthy', 'not_pregnant', '{"vaccinations": [{"type": "Heartwater", "date": "2024-02-15", "next_due": "2024-08-15"}]}', '2024-02-15', '2024-03-01'),
    
-- Sheep
    ('l7777777-7777-7777-7777-777777777777', 'f3333333-3333-3333-3333-333333333333', 'BOT-S-2024-012', 'Nku', 'sheep', 'Dorper', '2022-09-05', '2022-09-05', 'born', 'female', 65.0, 'healthy', 'pregnant', '{"vaccinations": [{"type": "FMD", "date": "2024-01-20", "next_due": "2024-07-20"}]}', '2024-01-20', '2024-02-28');

-- Update expected calving dates
UPDATE livestock SET expected_calving_date = '2024-08-15' WHERE id = 'l2222222-2222-2222-2222-222222222222';
UPDATE livestock SET expected_calving_date = '2024-09-01' WHERE id = 'l4444444-4444-4444-4444-444444444444';
UPDATE livestock SET expected_calving_date = '2024-08-20' WHERE id = 'l7777777-7777-7777-7777-777777777777';