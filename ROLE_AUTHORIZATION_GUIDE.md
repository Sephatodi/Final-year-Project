# Role-Based Authorization & Telehealth System Documentation

## Overview

The Farm-AID platform now includes a comprehensive role-based authorization system that differentiates between **Farmers** and **Veterinarians**, providing each role with appropriate UI elements, features, and workflows.

## User Roles

### 1. **Farmer Role** (`role: 'farmer'`)
- **Features Available:**
  - ✅ Request consultations (with "+ Request" button)
  - ✅ View own consultation requests
  - ✅ Send messages to assigned veterinarian
  - ✅ Upload images/documents
  - ✅ Receive diagnoses and treatment plans
  - ✅ Track consultation status
  
- **UI Indicators:**
  - "Request Consultation" button visible in sidebar
  - Create consultation form with fields:
    - Animal/Livestock selection
    - Subject of concern
    - Priority level (Normal/High/Emergency)
  - Message placeholder: "Describe your concern..."
  - No diagnosis form (read-only consultation view)

### 2. **Veterinarian Role** (`role: 'veterinarian'` or `role: 'vet'`)
- **Features Available:**
  - ✅ View pending consultation requests
  - ✅ Accept/reject consultations
  - ✅ Send messages to farmers
  - ✅ Submit clinical diagnoses
  - ✅ Provide treatment plans
  - ✅ Mark consultations as complete
  - ✅ Flag notifiable diseases (auto-report to DVS)
  
- **UI Indicators:**
  - "Accept" button on pending consultations
  - Consultations labeled as "Pending Consultations"
  - Diagnosis & Treatment Plan form (collapsible section)
  - Confidence level slider for diagnosis certainty
  - Notifiable disease checkbox
  - Message placeholder: "Provide guidance to farmer..."

## Implementation Details

### File Structure

```
Frontend/farm-aid-frontend/src/
├── context/
│   └── AuthContext.jsx              # Contains useAuth hook & user role
├── hooks/
│   └── useAuth.js                   # Hook to access current user
├── services/
│   └── consultationApi.js           # API endpoints for consultations
├── pages/
│   ├── IntegratedTelehealth.jsx     # Unified farmer/vet interface
│   ├── TelehealthVetConsult.jsx     # Original vet interface
│   └── ...

Backend/src/
├── models/
│   ├── User.js                      # User with roles: farmer, veterinarian, admin
│   ├── Consultation.js              # Consultation model
│   └── ...
├── routes/
│   ├── authRoutes.js                # Login/Register with role handling
│   └── consultationRoutes.js        # Role-based consultation routes
├── middleware/
│   └── auth.js                      # JWT verification
└── ...
```

### Key Components

#### 1. **AuthContext** (`src/context/AuthContext.jsx`)
Stores and manages authentication state:
```javascript
{
  user: {
    userId: "uuid",
    email: "user@example.com",
    name: "John Doe",
    role: "farmer" | "veterinarian" | "admin",
    farmName: "Green Valley Farm",
    phone: "...",
    token: "jwt-token"
  }
}
```

#### 2. **useAuth Hook** (`src/hooks/useAuth.js`)
Easy access to current user and auth methods:
```javascript
const { user, login, logout, register, loading } = useAuth();

// Check role
if (user?.role === 'farmer') { ... }
if (user?.role === 'veterinarian') { ... }
```

#### 3. **Consultation API Service** (`src/services/consultationApi.js`)
Handles all API calls with automatic JWT authentication:
```javascript
// Farmers
await consultationApi.createConsultation(data);
await consultationApi.getConsultations();
await consultationApi.sendMessage(consultationId, message);

// Veterinarians
await consultationApi.acceptConsultation(consultationId);
await consultationApi.submitDiagnosis(consultationId, diagnosis);
```

#### 4. **IntegratedTelehealth Page** (`src/pages/IntegratedTelehealth.jsx`)
Unified interface showing different UI based on user role:

**Role Detection:**
```javascript
const isVeterinarian = user?.role === 'veterinarian' || user?.role === 'vet';
const isFarmer = user?.role === 'farmer';
```

**Conditional Rendering Examples:**

```javascript
// Farmer: Show "Request Consultation" button
{isFarmer && (
  <button onClick={() => setShowCreateForm(!showCreateForm)}>
    <Plus className="w-5 h-5" /> Request
  </button>
)}

// Veterinarian: Show "Accept" button on pending consultations
{isVeterinarian && consult.status === 'pending' && (
  <button onClick={() => handleAcceptConsultation(consult.id)}>
    Accept
  </button>
)}

// Veterinarian only: Show diagnosis form
{isVeterinarian && activeConsultation && (
  <div className="p-6 bg-white">
    {/* Diagnosis form here */}
  </div>
)}
```

## Consultation Workflow

### Farmer → Veterinarian Flow

```
1. Farmer selects "Request Consultation"
   ↓
2. Farmer fills form (livestock, subject, priority, symptoms)
   ↓
3. System creates consultation request (status: "pending")
   ↓
4. Veterinarian sees pending request in list
   ↓
5. Veterinarian clicks "Accept" button
   ↓
6. Consultation status changes to "in_progress"
   ↓
7. Farmer & Vet can exchange messages
   ↓
8. Veterinarian submits diagnosis and treatment plan
   ↓
9. System sends notification to farmer with results
   ↓
10. If notifiable disease: Auto-report to DVS
```

### Data Flow (Database → Display)

```
API Call (with JWT token)
    ↓
Backend Route (role-checked)
    ↓
Database Query (filtered by role)
    ↓
Response with consultation data
    ↓
Frontend State Update
    ↓
Conditional UI Rendering
```

## API Endpoints (Backend)

All endpoints require `Authorization: Bearer {jwt_token}` header.

### Consultation Endpoints

#### GET `/api/consultations`
Returns consultations based on user role:
- **Farmer**: Own consultation requests
- **Veterinarian**: Assigned or pending consultations

**Response:**
```javascript
{
  consultations: [
    {
      id: "uuid",
      farmerId: "uuid",
      veterinarianId: "uuid" | null,
      subject: "Animal health concern",
      description: "Detailed description",
      symptoms: ["symptom1", "symptom2"],
      status: "pending" | "in_progress" | "completed",
      priority: "normal" | "high" | "emergency",
      createdAt: "2024-04-15T10:30:00Z",
      ...
    }
  ]
}
```

#### POST `/api/consultations` (Farmer only)
Creates new consultation request:
```javascript
{
  livestockId: "uuid",
  subject: "Cow not eating",
  description: "Full details...",
  symptoms: ["Loss of appetite", "Lethargy"],
  priority: "high"
}
```

#### POST `/api/consultations/:id/accept` (Veterinarian only)
Accepts a pending consultation:
```javascript
// Response updates status to "in_progress"
// Assigns veterinarianId to current user
```

#### POST `/api/consultations/:id/messages` (Both roles)
Sends message in consultation:
```javascript
{
  content: "Message text here"
}
```

#### POST `/api/consultations/:id/diagnosis` (Veterinarian only)
Submits diagnosis and treatment plan:
```javascript
{
  clinicalDiagnosis: "Foot and Mouth Disease",
  confidenceLevel: 0.92,
  treatmentInstructions: "Immediate isolation...",
  followUpDate: "2024-05-15",
  notifiable: true,
  medications: [...]
}
```

## Frontend State Management

### Key State Variables

```javascript
// Authentication
const { user, logout } = useAuth();
const isVeterinarian = user?.role === 'veterinarian';
const isFarmer = user?.role === 'farmer';

// Consultation Data
const [consultations, setConsultations] = useState([]);
const [activeConsultation, setActiveConsultation] = useState(null);
const [messages, setMessages] = useState([]);

// Forms
const [newConsultationForm, setNewConsultationForm] = useState({
  livestockId: '',
  subject: '',
  description: '',
  symptoms: [],
  priority: 'normal'
});

const [diagnosisForm, setDiagnosisForm] = useState({
  clinicalDiagnosis: '',
  confidenceLevel: 85,
  treatmentInstructions: '',
  followUpDate: '',
  notifiable: false
});
```

## Testing the Authorization System

### Test Case 1: Farmer Flow
1. Login with farmer credentials
2. Verify "Request Consultation" button is visible
3. Click button and fill form
4. Submit consultation
5. Verify message placeholder says "Describe your concern..."
6. Verify NO diagnosis form is shown

### Test Case 2: Veterinarian Flow
1. Login with veterinarian credentials
2. Verify consultations list labeled as "Pending Consultations"
3. Verify "Accept" button appears on pending items
4. Click Accept
5. Select consultation
6. Verify diagnosis form is visible
7. Fill diagnosis and submit
8. Verify farmer receives notification

### Test Case 3: Role-Based Access
1. Login as farmer
2. Verify `/integrated-telehealth` shows farmer interface
3. Logout and login as vet
4. Verify `/integrated-telehealth` shows vet interface with different features
5. Try accessing diagnosis endpoints as farmer (should fail)

## Offline Functionality

Messages are queued locally when offline and synced when connection is restored:

```javascript
if (isOffline) {
  setPendingMessages([...pendingMessages, message]);
  // Later when online
  syncPendingMessages();
}
```

## Security Considerations

✅ **Implemented:**
- JWT token verification on backend
- Role-based route protection
- User data stored securely in localStorage (can be upgraded to IndexedDB)
- API calls include JWT authorization header
- Database queries filtered by user role

✅ **To Consider:**
- Add refresh token rotation
- Implement token expiration handling
- Add CORS configuration
- Validate all inputs on backend
- Implement rate limiting
- Add audit logging for sensitive operations

## Troubleshooting

### Issue: Role not loading correctly
**Solution:** Check localStorage has user data:
```javascript
console.log(JSON.parse(localStorage.getItem('user')));
```

### Issue: Diagnosis form not showing for vet
**Solution:** Verify:
1. User role is 'veterinarian' (not 'vet')
2. Consultation is active/selected
3. Consultation status is not 'completed'

### Issue: API calls returning 401 Unauthorized
**Solution:**
1. Verify JWT token exists in Authorization header
2. Check token hasn't expired
3. Verify backend JWT_SECRET matches

### Issue: Consultations list empty
**Solution:**
1. Check backend `/api/consultations` endpoint
2. Verify database has consultation records
3. Check role-based filtering in backend query
4. Check fetch error in browser console

## Future Enhancements

- [ ] Video consultation integration (WebRTC)
- [ ] Real-time notifications (WebSocket)
- [ ] Prescription printing
- [ ] Consultation history export
- [ ] Rating and review system
- [ ] Two-factor authentication
- [ ] Mobile app with offline sync
- [ ] Multi-language support
- [ ] Integration with DVS (Disease Vectoring System)
- [ ] AI-powered symptom analysis

---

**Last Updated:** April 15, 2026
**Version:** 1.0.0
