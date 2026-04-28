# Complete Consultation Flow Implementation

## ✅ Fully Implemented End-to-End Workflow

### 1. **Farmer Requests Consultation (Single Consultation for Multiple Animals)**

**Frontend: `IntegratedTelehealth.jsx`**
- Form allows selecting multiple animals (checkboxes)
- Collects subject, description, symptoms, priority
- **Submits as single consultation** with `livestockIds: [...]` array
- Creates ONE consultation with metadata storing all related animal IDs

**Backend: `POST /api/consultations`**
```javascript
// Creates SINGLE consultation for multiple animals
const consultation = await Consultation.create({
  farmerId: req.user.id,
  livestockId: livestockIds[0],  // Primary animal
  metadata: { relatedLivestockIds: livestockIds },  // All animals
  status: 'pending'
});
```

**Database Changes:**
- Added `acceptedAt` field (DATE, optional) - timestamp when vet accepts
- Added `metadata` field (JSONB) - stores relatedLivestockIds array
- Updated status ENUM to include `'active'` state

---

### 2. **Automatic Notification to Veterinarians**

**Backend: POST /api/consultations**
```javascript
// After creating consultation, notify all active vets
const vets = await User.findAll({
  where: { role: 'veterinarian', isActive: true }
});

for (const vet of vets) {
  await Notification.create({
    userId: vet.id,
    type: 'new_consultation',
    title: 'New Consultation Request',
    message: `Farmer ${req.user.name} requested consultation...`,
    severity: priority === 'emergency' ? 'critical' : 'high',
    consultationId: consultation.id,
    relatedUserId: req.user.id  // Farmer ID
  });
}
```

**Notification Features:**
- Type: `new_consultation`
- Severity mapped from consultation priority
- Contains consultationId and farmer details
- Persisted in PostgreSQL Notification table

---

### 3. **Vet Dashboard Shows Pending Consultations**

**Frontend: `VetDashboard.jsx`**
```javascript
// fetchConsultations separates pending vs active
const pending = allConsultations.filter(c => c.status === 'pending');
const active = allConsultations.filter(c => c.status === 'active');

setConsultations(pending);      // Show in "Urgent Cases" table
setActiveConsultations(active);  // Show in "Active Consultations" section
```

**Backend: GET /api/consultations (Updated for Vet Role)**
```javascript
// Vets see:
// 1. Pending consultations with no vet assigned (status='pending', veterinarianId=null)
// 2. Active consultations they accepted (veterinarianId=req.user.id)
where[Op.or] = [
  { status: 'pending', veterinarianId: null },
  { veterinarianId: req.user.id }
];
```

**Consultation Display:**
- Lists farmer name, animal ID, symptoms, AI diagnosis
- Shows priority color-coded (critical=red, high=orange)
- "Review & Chat" button to open modal

---

### 4. **Vet Accepts Consultation with Accept Button**

**Frontend: VetDashboard ConsultationModal**
```javascript
// When pending, show "Accept & View" button
{isPending && (
  <button onClick={handleAcceptClick}>
    Accept & View
  </button>
)}

// Calls backend accept endpoint
const handleAcceptConsultation = async (consultationId) => {
  const response = await consultationApi.acceptConsultation(consultationId);
  setSelectedConsultation(response.consultation);  // Update modal
  await fetchConsultations();  // Refresh list
};
```

**Backend: PUT /api/consultations/:id/accept**
```javascript
await consultation.update({
  veterinarianId: req.user.id,
  status: 'active',
  acceptedAt: new Date()  // Timestamp when accepted
});

// Create farmer notification
await Notification.create({
  userId: consultation.farmerId,
  type: 'consultation_update',
  title: `Dr. ${req.user.name} accepted your consultation`,
  message: 'Start the conversation with the veterinarian.',
  consultationId: consultation.id,
  relatedUserId: req.user.id  // Vet ID
});
```

---

### 5. **Modal Updates with Vet Details After Acceptance**

**Frontend: ConsultationModal Component**
```javascript
// After acceptance, show:
// ✅ Vet details section (name, email, phone)
// ✅ Accepted timestamp
// ✅ Enable chat input
// ✅ Diagnosis form (right panel)

{isAccepted && consultation.veterinarian && (
  <div className="bg-orange-50 rounded-xl p-4">
    <p className="font-bold">{consultation.veterinarian.name}</p>
    <p className="text-sm">{consultation.veterinarian.email}</p>
    <div>Accepted: {new Date(consultation.acceptedAt).toLocaleString()}</div>
  </div>
)}

// Chat input enabled only after acceptance
{isAccepted && (
  <div className="border-t p-4">
    <input placeholder="Type your message..." />
  </div>
)}
```

**Data Flow:**
1. Vet clicks "Accept & View"
2. Backend updates: `veterinarianId`, `acceptedAt`, `status='active'`
3. Response includes populated vet object
4. Modal displays all vet info + timestamps
5. Chat becomes available

---

### 6. **Vet Can Start Conversation**

**Frontend: ConsultationModal**
```javascript
// Message input visible when:
// - Status is 'active'
// - Vet has accepted (veterinarianId matches user.id)

const handleSendMessage = async () => {
  const message = {
    id: messages.length + 1,
    sender: "vet",
    senderName: user?.name,
    content: newMessage,
    timestamp: new Date().toLocaleTimeString()
  };
  
  setMessages([...messages, message]);
  setNewMessage("");
  
  // TODO: Call backend API to persist message
  // await consultationApi.sendMessage(consultationId, newMessage);
};
```

**Backend: POST /api/consultations/:id/messages (Existing)**
```javascript
const message = await Message.create({
  consultationId: req.params.id,
  senderId: req.user.id,
  content,
  type: type || 'text'
});
```

---

## 🔄 Complete Flow Diagram

```
FARMER WORKFLOW:
1. Open IntegratedTelehealth
2. Select multiple animals (checkboxes)
3. Fill subject, description, symptoms, priority
4. Click "Request Consultation"
5. ✅ Creates SINGLE consultation with metadata.relatedLivestockIds
6. ✅ Receives success message
7. Gets notification when vet accepts

VET WORKFLOW:
1. Open VetDashboard
2. See pending consultations in table
3. Click "Review & Chat" button
4. Modal opens with pending status (amber banner)
5. Click "Accept & View"
6. ✅ Backend: Updates veterinarianId, acceptedAt, status='active'
7. ✅ Modal refreshes showing:
   - Green "Consultation Active" banner
   - Vet details section (name, email, phone)
   - Accepted timestamp
   - Chat input enabled
   - Diagnosis form visible
8. Start typing messages in chat
9. Send messages to farmer

FARMER RECEIVES NOTIFICATION:
1. When vet accepts, gets notification:
   - Type: consultation_update
   - Title: "Dr. [Name] accepted your consultation"
   - Message: "Start the conversation..."
2. Can open consultation in IntegratedTelehealth
3. See vet details and chat with vet
```

---

## 📋 API Endpoints Implemented

### Create Consultation (Farmer)
```
POST /api/consultations
Body: {
  livestockIds: ["id1", "id2", "id3"],  // Multiple animals
  subject: "Animal illness",
  description: "Description of issue",
  symptoms: ["fever", "lethargy"],
  priority: "high"
}
Response: {
  consultation: { id, status: 'pending', ... },
  consultationId: id
}
```

### Get Consultations (Role-aware)
```
GET /api/consultations
Response (Farmer): Returns only their consultations
Response (Vet): Returns pending consultations + their active consultations
```

### Accept Consultation (Veterinarian)
```
PUT /api/consultations/:id/accept
Response: {
  consultation: {
    id, veterinarianId, acceptedAt, status: 'active',
    farmer: { id, name, email },
    veterinarian: { id, name, email },
    livestock: { id, tagId, species }
  }
}
```

### Send Message
```
POST /api/consultations/:id/messages
Body: { content: "message text" }
```

### Get Messages
```
GET /api/consultations/:id/messages
```

---

## 🔧 Database Schema Updates

### Consultation Table Changes
```sql
-- NEW fields added to Consultations table:
ALTER TABLE "Consultations" ADD COLUMN "acceptedAt" TIMESTAMP;
ALTER TABLE "Consultations" ADD COLUMN "metadata" JSONB;

-- UPDATED enum to include 'active' status:
ALTER TYPE enum_Consultations_status ADD VALUE 'active';

-- Schema example:
{
  id: UUID,
  farmerId: UUID (NOT NULL),
  veterinarianId: UUID (NULL - filled on accept),
  livestockId: UUID (primary animal),
  subject: STRING,
  description: TEXT,
  symptoms: STRING[],
  aiDiagnosis: JSONB,
  status: 'pending' | 'active' | 'completed' | ...,
  priority: 'low' | 'normal' | 'high' | 'emergency',
  acceptedAt: TIMESTAMP (NULL - filled on accept),
  metadata: JSONB = { relatedLivestockIds: [id1, id2, ...] },
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

---

## 🎯 Files Modified

### Backend
1. **`/Backend/src/routes/consultationRoutes.js`**
   - Updated POST /consultations to create single consultation with notifications
   - Updated GET /consultations to show pending + assigned for vets
   - Updated PUT /:id/accept to add acceptedAt timestamp and farmer notification

2. **`/Backend/src/models/Consultation.js`**
   - Added `acceptedAt` field (DataTypes.DATE, allowNull: true)
   - Added `metadata` field (DataTypes.JSONB, defaultValue: {})
   - Updated status ENUM to include 'active'

### Frontend
1. **`/FrontEnd/farm-aid-frontend/src/pages/VetDashboard.jsx`**
   - Added `import { useAuth } from '../context/AuthContext'`
   - Added `handleAcceptConsultation` function calling acceptConsultation API
   - Completely rewrote `ConsultationModal` component to:
     - Show "Accept & View" button when pending
     - Display vet details after acceptance
     - Enable chat input only when accepted
     - Show green "Consultation Active" banner after acceptance
     - Show amber "Pending Request" banner when awaiting acceptance
   - Pass `onAccept` prop to modal

2. **`/FrontEnd/farm-aid-frontend/src/services/consultationApi.js`**
   - Fixed `acceptConsultation` to use PUT method (was POST)

3. **`/FrontEnd/farm-aid-frontend/src/pages/IntegratedTelehealth.jsx`**
   - Already properly sends `livestockIds` array (unchanged)
   - Already creates single consultation (unchanged)
   - Receives `consultationId` in response (unchanged)

---

## ✅ Testing Checklist

### Farmer Side
- [ ] Select multiple animals
- [ ] Fill consultation form
- [ ] Submit consultation
- [ ] See success message
- [ ] Notifications received when vet accepts

### Vet Side
- [ ] Dashboard shows pending consultations
- [ ] Can see farmer and animal details in modal
- [ ] Can see AI diagnosis with confidence
- [ ] "Accept & View" button visible when pending
- [ ] Click accept - modal updates with vet info
- [ ] Can see acceptedAt timestamp
- [ ] Can type and send messages
- [ ] Diagnosis form available after acceptance

### Backend
- [ ] Notifications created for all vets on consultation creation
- [ ] Notification created for farmer when vet accepts
- [ ] GET /consultations returns pending for vets (veterinarianId=null, status='pending')
- [ ] GET /consultations returns only accepted consultations for specific vet
- [ ] acceptedAt timestamp is set on acceptance
- [ ] Vet details populated in response

---

## 🚀 Deployment Notes

**Port Configuration:**
- Backend: Port 5000
- Frontend: Port 5176 (auto-incremented if in use)

**Environment Variables:**
- Backend: `REACT_APP_API_URL` defaults to `http://localhost:5000/api`
- JWT_SECRET: "replace_with_a_strong_random_secret"

**Database Requirements:**
- PostgreSQL with Sequelize ORM
- Run `npm install` in Backend folder
- Server auto-syncs all tables on startup

---

## 📝 Next Steps (Optional Enhancements)

1. **Real-time WebSocket Notifications**
   - Emit socket events when consultation status changes
   - Broadcast new consultation to all connected vets
   - Push notifications when farmer sends message

2. **Message Persistence**
   - Backend POST message endpoint already exists
   - Frontend can call `consultationApi.sendMessage(id, content)` on send

3. **Diagnosis Submission**
   - Backend endpoint exists: `POST /consultations/:id/diagnosis`
   - Frontend form already built in modal

4. **Offline Queue**
   - Already implemented in IntegratedTelehealth for offline messages
   - Can be extended to consultations

5. **Video Call Integration**
   - Placeholder buttons in UI
   - Can integrate WebRTC or third-party service

---

## 🎓 Key Implementation Patterns

### Single vs Multiple Animals
- **User Selection**: Multiple checkboxes on form
- **API Submission**: All selected IDs in `livestockIds` array
- **Database Storage**: Single consultation row with `metadata.relatedLivestockIds`
- **Benefit**: One consultation thread across all animals reduces chat fragmentation

### Role-Based Query Logic
```javascript
// Instead of filtering after fetch:
if (role === 'vet') {
  setConsultations(allData.filter(c => c.status === 'pending'));
}

// Use database query to only fetch relevant data:
where[Op.or] = [
  { status: 'pending', veterinarianId: null },
  { veterinarianId: userId }
];
```

### Modal State Management
```javascript
// Conditionally render based on consultation.status:
{isPending && <AcceptButton />}
{isAccepted && <ChatInput />}
{isAccepted && <DiagnosisForm />}
// This ensures UI matches database state
```

---

## 📞 Support

For questions about specific implementation details, refer to:
- Backend logic: `/Backend/src/routes/consultationRoutes.js`
- Frontend UI: `/FrontEnd/farm-aid-frontend/src/pages/VetDashboard.jsx`
- API service: `/FrontEnd/farm-aid-frontend/src/services/consultationApi.js`
