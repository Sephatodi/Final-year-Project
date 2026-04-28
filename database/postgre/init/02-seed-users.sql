-- Insert users (passwords are hashed - in production use proper bcrypt)
-- Password: 'Farmer123!' for farmers, 'Vet123!' for experts, 'Admin123!' for admin
INSERT INTO users (id, username, email, phone, password_hash, role, first_name, last_name, language_pref, is_active) VALUES
    -- Farmers
    ('11111111-1111-1111-1111-111111111111', 'modise_thato', 'thato.modise@example.com', '+26771123456', '$2a$10$xJwY5xQ9zXyZ8v3rLmNqOu1kLmNqOu1kLmNqOu1kLmNqOu1kLmNqO', 'farmer', 'Thato', 'Modise', 'tn', true),
    ('22222222-2222-2222-2222-222222222222', 'molefe_kealeboga', 'kealeboga.molefe@example.com', '+26772234567', '$2a$10$xJwY5xQ9zXyZ8v3rLmNqOu1kLmNqOu1kLmNqOu1kLmNqOu1kLmNqO', 'farmer', 'Kealeboga', 'Molefe', 'en', true),
    ('33333333-3333-3333-3333-333333333333', 'ntsima_boipelo', 'boipelo.ntsima@example.com', '+26773345678', '$2a$10$xJwY5xQ9zXyZ8v3rLmNqOu1kLmNqOu1kLmNqOu1kLmNqOu1kLmNqO', 'farmer', 'Boipelo', 'Ntsima', 'tn', true),
    
    -- Experts (Veterinarians)
    ('44444444-4444-4444-4444-444444444444', 'dr_mosimanegape', 'mosimanegape@vet.gov.bw', '+26774456789', '$2a$10$yKzZ8v3rLmNqOu1kLmNqOu1kLmNqOu1kLmNqOu1kLmNqOu1kLmNqO', 'expert', 'Kagiso', 'Mosimanegape', 'en', true),
    ('55555555-5555-5555-5555-555555555555', 'dr_sekgwa', 'sekgwa@livestock.bw', '+26775567890', '$2a$10$zLmNqOu1kLmNqOu1kLmNqOu1kLmNqOu1kLmNqOu1kLmNqOu1kLmNqO', 'expert', 'Boitumelo', 'Sekgwa', 'tn', true),
    
    -- Administrator
    ('66666666-6666-6666-6666-666666666666', 'admin_farmaid', 'admin@farmaid.org', '+26776678901', '$2a$10$1kLmNqOu1kLmNqOu1kLmNqOu1kLmNqOu1kLmNqOu1kLmNqOu1kLmO', 'admin', 'Admin', 'User', 'en', true);

-- Insert farmers
INSERT INTO farmers (id, user_id, farm_name, village, district, total_land_hectares, primary_livestock, experience_years, emergency_contact, is_verified) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Modise Livestock', 'Tonota', 'Central', 50.5, ARRAY['cattle', 'goat'], 15, '+26771123457', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Molefe Farms', 'Francistown', 'North-East', 35.0, ARRAY['cattle'], 8, '+26772234568', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Ntsima Goat Farm', 'Masunga', 'North-East', 20.0, ARRAY['goat', 'sheep'], 5, '+26773345679', true);

-- Insert experts
INSERT INTO experts (id, user_id, license_number, specialization, qualification, years_experience, region, is_available, rating, total_reviews, verified_by_admin) VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'VET/BOT/2020/001', ARRAY['Cattle', 'Small Ruminants', 'Disease Surveillance'], 'DVM University of Pretoria', 12, 'North-East', true, 4.8, 45, true),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'VET/BOT/2018/089', ARRAY['Goats', 'Sheep', 'Parasitology'], 'BVM University of Zambia', 15, 'Central', true, 4.9, 67, true);