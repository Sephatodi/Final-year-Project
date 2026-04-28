# Farm-Aid Test User Credentials

This document contains all test user credentials for the Farm-Aid application. These users are created by running the seeder script.

**Default Password for All Test Users:** `Test@123456`

---

## How to Run the Seeder

```bash
# Navigate to Backend directory
cd Backend

# Run the seeder (standalone)
node src/seeders/usersSeed.js

# OR as part of the full database seeding
npm run seed
```

---

## Test Users & Testing Guide

## Test User Credentials

### Farmer User 1
```
Email:    farmer1@farmaid.bw
Password: FarmerPassword123!
Role:     farmer
Farm:     Green Valley Farm
Location: Francistown
Phone:    +267 76123456
Name:     Segokgo Molefi
```

### Farmer User 2
```
Email:    farmer2@farmaid.bw
Password: FarmerPassword123!
Role:     farmer
Farm:     Sunset Cattle Ranch
Location: Gaborone
Phone:    +267 76234567
Name:     Thabo Ndlela
```

### Veterinarian User 1
```
Email:    vet1@farmaid.bw
Password: VetPassword123!
Role:     veterinarian
Clinic:   Central Veterinary Services
Location: Gaborone
Phone:    +267 71987654
Name:     Dr. Kagiso Ramaphosa
License:  VET-2024-001
```

### Veterinarian User 2
```
Email:    vet2@farmaid.bw
Password: VetPassword123!
Role:     veterinarian
Clinic:   Northern Livestock Care
Location: Francistown
Phone:    +267 71876543
Name:     Dr. Naledi Okafor
License:  VET-2024-002
```

### Admin User
```
Email:    admin@farmaid.bw
Password: AdminPassword123!
Role:     admin
Name:     System Administrator
```

## Role-Based Authorization Testing

### Farmer Features (After Login)
✅ **Can Do:**
- Request consultations
- View own consultations
- Send messages to vets
- Upload images
- View treatment plans (read-only)

❌ **Cannot Do:**
- Accept other consultations
- Submit diagnoses
- See "Pending Consultations" list
- Access diagnosis form

### Veterinarian Features (After Login)
✅ **Can Do:**
- View pending consultations
- Accept consultation requests
- Send messages to farmers
- Submit clinical diagnoses
- Submit treatment plans
- Submit notifiable disease reports
- Mark consultations complete

❌ **Cannot Do:**
- Create consultation requests
- See "Request Consultation" button
- Access create consultation form

## Integration Testing Flow

### Test Sequence
1. **Farmer Login & Request**
   - Login as farmer1
   - Navigate to `/integrated-telehealth`
   - Click [+] to request consultation
   - Submit form
   
2. **Veterinarian Login & Accept**
   - Logout farmer
   - Login as vet1
   - See pending request
   - Click Accept
   - Consultation moves to "in_progress"

3. **Two-Way Messaging**
   - Exchange messages between farmer and vet
   - Verify message sender names display
   - Check message timestamps

4. **Diagnosis Submission**
   - As vet: Fill diagnosis form
   - Submit diagnosis
   - Check consultation status → "completed"

5. **Farmer Notification**
   - Login as farmer again
   - See completed consultation
   - View submitted diagnosis

## Quick Test Checklist

- [ ] Farmer can login with correct role
- [ ] Vet can login with correct role
- [ ] Farmer sees [+] request button
- [ ] Vet sees Accept button
- [ ] Farmer cannot see diagnosis form
- [ ] Vet can see diagnosis form
- [ ] Messages exchange works
- [ ] Database data displays (real names)
- [ ] API integration successful
- [ ] Offline queuing works

---

**Last Updated**: April 15, 2026
**Version**: 1.0.0 - With Role-Based Authorization by Role

### 🔐 ADMIN USERS (System Management)

| Email | Name | Password | Phone | Region | Notes |
|-------|------|----------|-------|--------|-------|
| admin@farm-aid.com | System Administrator | Test@123456 | +26771234567 | Gaborone | Full system access |
| manager@farm-aid.com | John Manager | Test@123456 | +26772345678 | Francistown | Operations management |

---

### 🚜 FARMER USERS (Livestock Management)

| Email | Name | Phone | Region | Farm Name | Animals | Species |
|-------|------|-------|--------|-----------|---------|---------|
| thabiso.farmer@farm-aid.com | Thabiso Mokoena | +26773456789 | Gaborone | Mokoena Cattle Farm | 45 | Cattle, Goat |
| nkamogelang.farmer@farm-aid.com | Nkamogelang Petso | +26774567890 | Francistown | Petso Mixed Livestock | 65 | Cattle, Sheep, Goat |
| kagiso.farmer@farm-aid.com | Kagiso Mpontsana | +26775678901 | Maun | Mpontsana Goat Ranch | 120 | Goat |
| boitumelo.farmer@farm-aid.com | Boitumelo Ratsaka | +26776789012 | Kasane | Ratsaka Integrated Farm | 89 | Cattle, Sheep |
| palesa.farmer@farm-aid.com | Palesa Lepako | +26777890123 | Gaborone | Lepako Family Farm | 32 | Goat |

**Password for all:** `Test@123456`

**Features to Test:**
- Livestock management (BAITS tag format: BW-YYYY-XXXXX)
- Health record tracking
- AI symptom checker
- Consultation with vets
- Disease reporting to DVS
- Knowledge base search
- Notification preferences

---

### 👨‍⚕️ VETERINARIAN USERS (Consultation)

| Email | Name | License | Specializations | Rate | Phone |
|-------|------|---------|-----------------|------|-------|
| dr.kagiso@farm-aid.com | Dr. Kagiso Morambi | VET/2015/001 | Cattle health, diagnosis | P150 | +26778901234 |
| dr.moloi@farm-aid.com | Dr. Moloi Tshwane | VET/2018/045 | Small ruminants, parasites | P120 | +26779012345 |
| dr.keabetswe@farm-aid.com | Dr. Keabetswe Modise | VET/2021/089 | General practice, emergency | P80 | +26780123456 |

**Password for all:** `Test@123456`

**Features to Test:**
- Accept/reject consultation requests
- Real-time WebSocket consultation chat
- Provide veterinary advice
- Create health reports
- View consultation history

**Availability:**
- **Dr. Morambi:** Mon-Fri 08:00-17:00, Sat 09:00-12:00
- **Dr. Tshwane:** Mon-Fri 07:00-18:00, Sat 10:00-14:00
- **Dr. Modise:** Mon-Fri 08:30-17:30

---

### 🏛️ DVS OFFICER USERS (Disease Surveillance)

| Email | Name | Office | Jurisdiction | Reports | Phone |
|-------|------|--------|---------------|---------|-------|
| gift.dvs@farm-aid.com | Gift Selala | Gaborone | South East District | 567 | +26781234567 |
| phenyo.dvs@farm-aid.com | Phenyo Kubeka | Francistown | Central District | 234 | +26782345678 |
| thabo.dvs@farm-aid.com | Thabo Lebaka | Maun | Kgatleng & NW Districts | 89 | +26783456789 |

**Password for all:** `Test@123456`

**Features to Test:**
- Receive disease reports from farmers
- Investigate reportable diseases
- Issue movement control orders
- Track disease outbreaks
- Generate surveillance reports
- FMD detection and escalation

**Authority Levels:**
- **Senior Officer (Selala):** Full investigation, movement control, quarantine
- **Officer (Kubeka):** Investigation, movement control
- **Field Officer (Lebaka):** Field surveillance, sample collection

---

## End-to-End Testing Workflow

### Test Scenario 1: Simple Health Check
1. Login as **thabiso.farmer@farm-aid.com**
2. Go to Health Records → Add Health Record
3. Select a livestock animal
4. Add symptoms (fever, weight loss)
5. Check Symptom Checker for AI diagnosis
6. Record the health event

### Test Scenario 2: Consultation with Veterinarian
1. Login as **thabiso.farmer@farm-aid.com**
2. Go to Consultations → Request Consultation
3. Describe the issue
4. Wait for vet to accept (login as **dr.kagiso@farm-aid.com** and accept)
5. Chat in real-time with the veterinarian
6. Receive recommendations
7. Rate the consultation

### Test Scenario 3: Disease Reporting
1. Login as **nkamogelang.farmer@farm-aid.com**
2. Go to Disease Reporting
3. Report FMD-like symptoms (fever, blisters, lameness)
4. System auto-detects as high priority
5. Report submitted to DVS
6. Login as **gift.dvs@farm-aid.com** to verify report received
7. DVS officer investigates and updates status

### Test Scenario 4: Notifications
1. Login as **thabiso.farmer@farm-aid.com**
2. Go to Settings → Notification Preferences
3. Toggle different notification types:
   - Push notifications
   - SMS alerts
   - Email summaries
4. Add phone number for SMS
5. Log out and have vet send consultation request
6. Check if notifications arrive via selected channels

### Test Scenario 5: Analytics Dashboard
1. Login as **boitumelo.farmer@farm-aid.com**
2. Go to Dashboard → Analytics
3. View herd health trends
4. Check breed distribution
5. View expense breakdown
6. Export analytics report (PDF/CSV)
7. View activity timeline

---

## Database Notes

**All passwords are hashed with bcryptjs (cost factor: 10)**

Example password hash: `$2a$10$...` (never store plain text)

**User Roles:**
- `admin` - Full system access, user management
- `farmer` - Livestock management, health tracking, consultations
- `veterinarian` - Consultation provider, health diagnosis
- `dvs_officer` - Disease surveillance, reporting, outbreak management

**Verification Status:**
- All users are pre-verified except **palesa.farmer@farm-aid.com** (pending email verification)
- Verified users can access all features immediately

---

## Resetting Test Data

To reset and reseed the database:

```bash
cd Backend

# Drop all tables and reseed
npm run reset-db

# Or manually:
npm run migrate:reset
npm run seed
```

---

## Troubleshooting

**Issue:** "User already exists" error
- **Solution:** The seeder uses `findOrCreate`, so it's safe to run multiple times. Existing users will be updated.

**Issue:** Farmers can't see consultations with vets
- **Solution:** Make sure both farmer and vet are logged in. Use different browser windows/tabs for testing.

**Issue:** WebSocket not connecting
- **Solution:** Ensure backend is running with `npm start` and socket.io is initialized.

**Issue:** Notifications not arriving
- **Solution:** Check notification preferences in Settings. Enable push/SMS. Verify phone number format (+267XXXXXXXX).

---

## Database Schema Integration

These test users are created for the following models:

```
User
├── firstName, lastName, email, phoneNumber
├── password (hashed with bcryptjs)
├── role (admin, farmer, veterinarian, dvs_officer)
├── region, district
├── isVerified, verifiedDate
├── status (active, inactive, suspended)
├── lastLogin
└── metadata (role-specific additional data)
```

The `metadata` field stores:
- **Farmers:** farmName, farmSize, animalCount, specializations, preferences
- **Vets:** license, specializations, availability, ratings, consultations completed
- **DVS:** department, office, jurisdiction, authority levels
- **Admins:** department, permissions

---

## Next Steps

After seeding:

1. **Verify Users Created:**
   ```bash
   npm run inspect-users
   # OR query manually: SELECT COUNT(*) FROM users;
   ```

2. **Test Each Role:**
   - Login as each user type
   - Verify role-specific features appear
   - Test cross-role interactions

3. **Monitor Logs:**
   ```bash
   tail -f logs/app.log
   ```

4. **Check Database:**
   ```bash
   psql -U farm_aid_user -d farm_aid -c "SELECT role, COUNT(*) FROM users GROUP BY role;"
   ```

---

**Created:** January 2025  
**Last Updated:** January 2025  
**Farm-Aid Development Team**
