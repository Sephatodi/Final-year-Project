# COMPLETE CONSULTATION FLOW - QUICK REFERENCE

## 🎯 What Was Implemented

The complete, production-ready consultation workflow from farmer request through vet acceptance and conversation initiation.

---

## 📊 WORKFLOW SEQUENCE

### **STEP 1: Farmer Creates Consultation**
```
IntegratedTelehealth.jsx
└─ Select Multiple Animals (checkboxes)
└─ Fill: Subject, Description, Symptoms, Priority
└─ Click: "Request Consultation"
└─ State: selectedAnimals = ['id1', 'id2', 'id3']
└─ API Call: POST /api/consultations
   └─ Payload: { livestockIds: [id1, id2, id3], subject, description, ... }
   └─ Backend Creates: ONE Consultation with metadata.relatedLivestockIds = [id1, id2, id3]
   └─ Status: 'pending'
```

**Key Change**: Creates ONE consultation (not multiple) even with multiple animals


### **STEP 2: Automatic Notifications Sent to All Vets**
```
Backend: POST /api/consultations (AFTER creating consultation)
└─ Query: Find all active veterinarians
   └─ User.findAll({ role: 'veterinarian', isActive: true })
└─ For Each Vet:
   └─ Create Notification:
      ├─ type: 'new_consultation'
      ├─ title: 'New Consultation Request'
      ├─ message: 'Farmer {name} requested consultation for {subject}'
      ├─ severity: 'critical' | 'high' (based on priority)
      ├─ consultationId: {id}
      └─ relatedUserId: {farmerId}
   └─ Notification stored in PostgreSQL
```

**Result**: All available vets see notification immediately


### **STEP 3: Vet Opens Dashboard**
```
VetDashboard.jsx
└─ useEffect: fetchConsultations()
└─ Backend: GET /api/consultations (for veterinarian user)
   └─ Query: WHERE (status='pending' AND veterinarianId IS NULL) 
                OR (veterinarianId = req.user.id)
   └─ Response includes: Pending consultations + Accepted consultations
└─ Frontend Processing:
   ├─ pending = filter(c => c.status === 'pending')
   ├─ active = filter(c => c.status === 'active')
   └─ Display:
      ├─ "Urgent Cases" Table ← pending consultations
      └─ "Active Consultations" Section ← active consultations
```

**Dashboard Shows**: Pending cases from farmers waiting for acceptance


### **STEP 4: Vet Reviews Consultation**
```
VetDashboard.jsx
└─ Click: "Review & Chat" button on pending consultation
└─ ConsultationModal Opens with:
   ├─ LEFT PANEL: 
   │  ├─ Farmer Details (name, farm, location)
   │  ├─ Animal Details (tag ID, species, age)
   │  └─ AI Diagnosis (disease, confidence%)
   │
   ├─ MIDDLE PANEL: Chat (disabled, "Awaiting acceptance" message)
   │
   ├─ RIGHT PANEL: Diagnosis Form (hidden)
   │
   └─ TOP: AMBER BANNER: "Pending Request - Click Accept & View to start"
           + "ACCEPT & VIEW" GREEN BUTTON
```

**State**: isPending = true, isAccepted = false


### **STEP 5: Vet Accepts Consultation**
```
VetDashboard.jsx - ConsultationModal
└─ Click: "Accept & View" button
└─ Call: handleAcceptConsultation(consultationId)
   └─ API: PUT /api/consultations/{id}/accept
      └─ Backend:
         ├─ UPDATE Consultation SET:
         │  ├─ veterinarianId = req.user.id
         │  ├─ status = 'active'
         │  └─ acceptedAt = new Date()
         │
         ├─ Fetch updated consultation with relationships:
         │  └─ Include: farmer { name, email, phone }
         │  └─ Include: veterinarian { name, email, phone }
         │  └─ Include: livestock { tagId, species }
         │
         ├─ Create notification for FARMER:
         │  ├─ type: 'consultation_update'
         │  ├─ title: 'Dr. {vetName} accepted your consultation'
         │  └─ message: 'Start the conversation with the veterinarian'
         │
         └─ Response: { consultation: {...with vet details} }
   
   └─ Frontend:
      ├─ setSelectedConsultation(response.consultation)
      └─ fetchConsultations() → refreshes list
```

**Changes in Database**:
- veterinarianId: filled with vet ID
- status: changed from 'pending' to 'active'
- acceptedAt: timestamp of acceptance


### **STEP 6: Modal Updates (UX Changes)**
```
ConsultationModal.jsx - After Accept
└─ State Updates: isPending = false, isAccepted = true

LEFT PANEL - SAME (Farmer + Animal + AI Diagnosis)

MIDDLE PANEL - CHAT ENABLED:
├─ Initial message from farmer: visible
├─ Input field: NOW ENABLED
├─ Send button: NOW ACTIVE
├─ Attach image/camera: NOW ACTIVE
└─ User can type and send messages to farmer

TOP BANNER - CHANGED:
└─ GREEN BANNER: "Consultation Active"
   └─ "Accepted at {acceptedTime}"

VET DETAILS SECTION - NEW (LEFT PANEL):
├─ Your Details
├─ Avatar
├─ Name: {vet.name}
├─ Email: {vet.email}
├─ Phone: {vet.phone}
└─ Accepted: {consultation.acceptedAt}

RIGHT PANEL - DIAGNOSIS FORM (NOW VISIBLE):
├─ Disease field (editable)
├─ Confidence slider (0-100%)
├─ Treatment Plan textarea
├─ Follow-up date picker
├─ Notifiable disease checkbox
└─ Submit Diagnosis button
```

**Key Feature**: Modal automatically shows all vet information + enables all interactive features


### **STEP 7: Vet Starts Conversation**
```
ConsultationModal.jsx - Chat Section
└─ Vet types: "Based on your description and AI analysis..."
└─ Click: Send button OR Press Enter
└─ Frontend:
   ├─ Add message to messages array:
   │  └─ { id, sender: 'vet', senderName, content, timestamp }
   ├─ Clear input field
   └─ Message appears in chat (orange bubble)

Backend: POST /api/consultations/{id}/messages
└─ Body: { content: "message text" }
└─ Creates: Message record with senderId, content, type
└─ Returns: Message with sender details
```

**Bidirectional**: Both farmer and vet can continue conversation


### **STEP 8: Farmer Receives Notification**
```
IntegratedTelehealth.jsx - NotificationsModal
└─ Backend created notification on vet acceptance
   ├─ type: 'consultation_update'
   ├─ title: 'Dr. {name} accepted your consultation'
   └─ message: 'Start the conversation...'
└─ Farmer sees notification:
   ├─ In NotificationsModal (right sidebar)
   ├─ Icon: appropriate notification icon
   ├─ Severity: normal (blue)
   └─ Can click to open consultation
└─ Can see vet details and start chatting
```

---

## 🗄️ DATABASE STATE CHANGES

### Consultation Table

**BEFORE (pending):**
```json
{
  "id": "abc123",
  "farmerId": "farmer1",
  "veterinarianId": null,
  "livestockId": "livestock1",
  "metadata": {
    "relatedLivestockIds": ["livestock1", "livestock2", "livestock3"]
  },
  "status": "pending",
  "acceptedAt": null,
  "createdAt": "2024-04-16T10:00:00Z"
}
```

**AFTER (accepted):**
```json
{
  "id": "abc123",
  "farmerId": "farmer1",
  "veterinarianId": "vet1",  // ← FILLED
  "livestockId": "livestock1",
  "metadata": {
    "relatedLivestockIds": ["livestock1", "livestock2", "livestock3"]
  },
  "status": "active",        // ← CHANGED
  "acceptedAt": "2024-04-16T10:05:30Z",  // ← SET
  "createdAt": "2024-04-16T10:00:00Z",
  "updatedAt": "2024-04-16T10:05:30Z"
}
```

### Notification Table (Entry 1 - on creation)

```json
{
  "id": "notif1",
  "userId": "vet1",
  "type": "new_consultation",
  "title": "New Consultation Request",
  "message": "Farmer John requested consultation for Animal illness",
  "severity": "high",
  "consultationId": "abc123",
  "relatedUserId": "farmer1",
  "read": false,
  "archived": false,
  "createdAt": "2024-04-16T10:00:05Z"
}
```

### Notification Table (Entry 2 - on acceptance)

```json
{
  "id": "notif2",
  "userId": "farmer1",
  "type": "consultation_update",
  "title": "Dr. Kagiso accepted your consultation",
  "message": "Start the conversation with the veterinarian.",
  "severity": "normal",
  "consultationId": "abc123",
  "relatedUserId": "vet1",
  "read": false,
  "archived": false,
  "createdAt": "2024-04-16T10:05:35Z"
}
```

---

## 🔌 API ENDPOINTS USED

### 1. Create Consultation (Farmer)
```http
POST /api/consultations
Authorization: Bearer {farmerToken}

{
  "livestockIds": ["id1", "id2", "id3"],
  "subject": "Animal illness",
  "description": "Not eating, lethargy symptoms",
  "symptoms": ["lethargy", "loss_of_appetite"],
  "priority": "high"
}

Response 201:
{
  "message": "Consultation created successfully",
  "consultation": {...},
  "consultationId": "abc123"
}
```

### 2. Get Consultations (Vet)
```http
GET /api/consultations
Authorization: Bearer {vetToken}

Response:
{
  "consultations": [
    {
      "id": "pending1",
      "farmerId": "farmer1",
      "veterinarianId": null,
      "status": "pending",
      "farmer": { "id", "name", "email", "phone", "farmName" },
      "livestock": { "id", "tagId", "species" },
      "aiDiagnosis": { "disease": "...", "confidence": 0.85 }
    },
    {
      "id": "active1",
      "farmerId": "farmer2",
      "veterinarianId": "vet1",
      "status": "active",
      "acceptedAt": "2024-04-16T10:05:30Z",
      "farmer": {...},
      "veterinarian": { "id", "name", "email", "phone" },
      "livestock": {...}
    }
  ]
}
```

### 3. Accept Consultation (Vet)
```http
PUT /api/consultations/{id}/accept
Authorization: Bearer {vetToken}

Response 200:
{
  "message": "Consultation accepted successfully",
  "consultation": {
    "id": "abc123",
    "status": "active",
    "acceptedAt": "2024-04-16T10:05:30Z",
    "veterinarianId": "vet1",
    "farmer": { "id", "name", "email", "phone", "farmName" },
    "veterinarian": { "id", "name", "email", "phone" },
    "livestock": { "id", "tagId", "species" }
  }
}
```

### 4. Send Message (Both)
```http
POST /api/consultations/{id}/messages
Authorization: Bearer {token}

{
  "content": "Your message here"
}

Response 201:
{
  "message": "Message sent",
  "data": {
    "id": "msg1",
    "consultationId": "abc123",
    "senderId": "vet1",
    "content": "Your message here",
    "sender": { "id", "name", "role" }
  }
}
```

---

## 🧪 MANUAL TESTING FLOW

### Test As Farmer:
1. Login with farmer account
2. Go to IntegratedTelehealth page
3. Check "Show Create Form" checkbox
4. Select 2-3 animals (checkboxes)
5. Fill subject: "Test consultation"
6. Fill description: "Testing multi-animal consultation"
7. Add symptoms from list
8. Set priority: "high"
9. Click "Request Consultation"
10. ✅ Should see: Success message
11. ✅ Should see: New consultation appears in "Pending" section
12. ✅ Check NotificationsModal - should appear as new notification

### Test As Vet:
1. Login with vet account
2. Go to VetDashboard
3. ✅ Should see: Pending consultation in "Urgent Cases" table
4. Click: "Review & Chat" button
5. ✅ Should see:
   - Modal opens
   - Amber banner: "Pending Request"
   - Farmer details on left
   - Animal details
   - AI diagnosis
   - "Accept & View" button
   - Chat area with message: "Awaiting acceptance"
   - Diagnosis form: HIDDEN
6. Click: "Accept & View" button
7. ✅ Modal should update:
   - Banner changes to green: "Consultation Active"
   - Shows: Accepted time
   - Vet Details section appears
   - Chat input becomes enabled
   - Diagnosis form becomes visible
8. Type: "Thank you for the information..."
9. Click: Send button
10. ✅ Message appears in chat (orange bubble)

### Test As Farmer (After Vet Accepts):
1. IntegratedTelehealth page refreshes or user checks notifications
2. ✅ Should see: New notification "Dr. {vet} accepted your consultation"
3. Click: Notification or consultation in "Pending" section
4. ✅ Should see:
   - Consultation now shows vet details
   - Can see vet's message in chat
   - Can type reply to vet

---

## ✅ IMPLEMENTATION CHECKLIST

- [x] Single consultation created for multiple animals (not one per animal)
- [x] Consultation stored with metadata.relatedLivestockIds array
- [x] Notifications created for all active vets when consultation submitted
- [x] Notification type: 'new_consultation' with severity mapping
- [x] VetDashboard fetches pending consultations (status='pending', veterinarianId=null)
- [x] VetDashboard fetches accepted consultations (veterinarianId=current_vet)
- [x] ConsultationModal shows pending state with Accept button
- [x] Accept button calls PUT /consultations/:id/accept endpoint
- [x] Backend updates veterinarianId, status, acceptedAt on accept
- [x] Backend creates farmer notification on accept
- [x] Modal updates with vet details after acceptance
- [x] Chat input enabled after acceptance
- [x] Diagnosis form visible after acceptance
- [x] Green banner shows acceptance status with timestamp
- [x] Messages can be sent between farmer and vet
- [x] All relationships properly loaded (farmer, vet, livestock)

---

## 📱 UI STATE MATRIX

| Component | Pending | Accepted |
|-----------|---------|----------|
| Accept Button | ✅ Visible | ❌ Hidden |
| Amber Banner | ✅ Visible | ❌ Hidden |
| Green Banner | ❌ Hidden | ✅ Visible |
| Chat Input | ❌ Disabled | ✅ Enabled |
| Diagnosis Form | ❌ Hidden | ✅ Visible |
| Vet Details | ❌ Hidden | ✅ Visible |
| Farmer Details | ✅ Visible | ✅ Visible |
| Animal Details | ✅ Visible | ✅ Visible |
| AI Diagnosis | ✅ Visible | ✅ Visible |

---

## 🎓 Key Implementation Highlights

### 1. **Single Consultation Strategy**
- Multiple animals selected → metadata.relatedLivestockIds stores all IDs
- Keeps consultation thread unified
- Reduces chat fragmentation
- Cleaner database model

### 2. **Automatic Notification System**
- Runs after consultation creation
- Queries all active vets
- Creates individual notifications for each vet
- Ensures no vet misses new requests

### 3. **Role-Based Query Logic**
- Backend filters consultations by role at database level
- Vets see: pending (unassigned) + active (assigned to them)
- Farmers see: only their consultations
- Efficient database queries (no post-filtering)

### 4. **State-Driven UI**
- Modal JSX uses `isPending` and `isAccepted` flags
- Conditional rendering based on `consultation.status`
- All UI elements automatically sync with database state
- No manual state management needed

### 5. **Timestamped Workflow**
- `createdAt`: When consultation was requested
- `acceptedAt`: When vet accepted (now populated)
- Can track consultation lifecycle easily

---

## 🚀 READY FOR PRODUCTION

This implementation is complete and production-ready. All core requirements met:
- ✅ Farmer creates consultation for multiple animals
- ✅ Single consultation (not fragmented)
- ✅ Vets notified automatically
- ✅ Vet dashboard shows pending requests
- ✅ Vet can view full consultation details
- ✅ Vet can accept consultation
- ✅ Modal updates with all vet information
- ✅ Vet can start conversation immediately
- ✅ Farmer notified of acceptance
- ✅ Real-time UI updates
- ✅ Database state properly managed

Servers running:
- Backend: http://localhost:5000
- Frontend: http://localhost:5176
