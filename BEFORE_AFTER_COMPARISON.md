# Quick Reference: Role-Based Features Comparison

## UI Elements Visibility

### SIDEBAR (Left Panel)

```
┌─────────────────────────────────────────┐
│        BEFORE (Mock Data)               │
├─────────────────────────────────────────┤
│                                         │
│  [BOTH ROLES SAME]                      │
│  - "Active Consultations" (static)      │
│  - Mock consultation: "Segokgo"         │
│  - Static AI confidence 89%             │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        AFTER (Role-Based)               │
├─────────────────────────────────────────┤
│                                         │
│  FARMER VIEW:                           │
│  ┌─ Title: "My Consultations" ─┐       │
│  │ [+] Request Consultation      │       │
│  │ (Farmer sees request form)    │       │
│  └─────────────────────────────┘       │
│                                         │  
│  VET VIEW:                              │
│  ┌─ Title: "Pending Consultations"─┐   │
│  │ 3 urgent cases pending          │    │
│  │ (Vet sees Accept buttons)       │    │
│  └─────────────────────────────────┘   │
│                                         │
│  REAL DATA:                             │
│  - Actual consultations from DB         │
│  - Real farmer/vet names                │
│  - Actual status & priority             │
│  - Loading & error states               │
│                                         │
└─────────────────────────────────────────┘
```

### CONSULTATION CREATION (Farmer Only)

```
FARMER SEES: ✅

┌─────────────────────────────────────┐
│   REQUEST CONSULTATION FORM         │
├─────────────────────────────────────┤
│                                     │
│  Animal/Livestock: [Dropdown ▼]    │
│  Subject:         [Select animal]   │
│  Priority:        [Normal/High/Emg] │
│  [Request] [Cancel]                 │
│                                     │
└─────────────────────────────────────┘

VET SEES: ❌
(No form visible - only sees consultations)
```

### DIAGNOSIS FORM (Vet Only)

```
VET SEES: ✅ (When consultation selected)

┌──────────────────────────────────────┐
│  Diagnosis & Treatment Plan          │
├──────────────────────────────────────┤
│                                      │
│  Clinical Diagnosis    [Text input]  │
│  Confidence Level      [0%-----100%] │
│  Treatment            [Textarea]     │
│  Follow-up Date       [Date picker]  │
│  ☐ Notifiable Disease               │
│  [Submit Diagnosis]                  │
│                                      │
└──────────────────────────────────────┘

FARMER SEES: ❌
(Form not rendered if role='farmer')
```

## Message Display

### Before (Mock)
```javascript
msg.sender === 'expert' ? 'bg-orange-500' : 'bg-white'
// Just two simple states
```

### After (Real Data)
```javascript
const isCurrentUserMessage = msg.sender === user?.id;
const isVetMessage = msg.senderRole === 'veterinarian';

// More nuanced styling:
isCurrentUserMessage
  ? 'bg-[#ea580c] text-white'         // User's message (orange)
  : isVetMessage
  ? 'bg-blue-100 text-gray-900'       // Vet message (blue)
  : 'bg-white border text-gray-900'   // Farmer message (white)

// Shows actual sender names:
<p className="text-xs font-bold">{msg.senderName}</p>
```

## Accept Consultation (Vet Only)

### Before
```javascript
// No acceptance workflow
// Consultations pre-assigned
```

### After
```javascript
{isVeterinarian && consult.status === 'pending' && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleAcceptConsultation(consult.id);
    }}
    className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
  >
    Accept
  </button>
)}

// Workflow:
// pending → Accept → in_progress → vet assigned
```

## Request Consultation (Farmer Only)

### Before
```javascript
// No consultation creation
// All mocked
```

### After
```javascript
const handleCreateConsultation = async () => {
  // Validates form
  // Calls API: POST /api/consultations
  // Refreshes list
  // Shows success message
};

// Sends:
{
  livestockId: "uuid",
  subject: "Cow not eating",
  description: "...",
  symptoms: ["Loss of appetite"],
  priority: "high"
}
```

## State Management Changes

### Before (Mock)
```javascript
const consultations = [
  {
    id: 1,
    farmer: { name: "Segokgo", farm: "Green Valley" },
    animal: { id: "B-054", species: "Cattle" },
    aiConfidence: 89,
    status: "active"
  }
];
```

### After (Real Data)
```javascript
// From database
const consultations = []; // Fetched via API
const loading = true;
const error = null;

// Fetch on mount
useEffect(() => {
  const response = await consultationApi.getConsultations();
  setConsultations(response.consultations || []);
}, []);

// When consultation selected
useEffect(() => {
  if (activeConsultation?.id) {
    fetchMessages(activeConsultation.id);
  }
}, [activeConsultation]);
```

## Role Detection

```javascript
// Simple role checks
const { user } = useAuth();
const isVeterinarian = user?.role === 'veterinarian' || user?.role === 'vet';
const isFarmer = user?.role === 'farmer';

// Used throughout component
if (isVeterinarian) {
  // Show vet features
} else if (isFarmer) {
  // Show farmer features
}
```

## Message Routing & Storage

### Before
```javascript
// Mock message storage
const messages = [
  { id: 1, senderId: 'farmer', content: '...' }
];
```

### After
```javascript
// Real API-based messages
const messageObj = {
  id: Date.now(),
  sender: user?.id,
  senderName: user?.name,
  senderRole: user?.role,
  text: message,
  timestamp: new Date().toISOString(),
  consultationId: activeConsultation?.id
};

// Send via API
await consultationApi.sendMessage(
  activeConsultation.id,
  message
);

// Fetch via API
const response = await consultationApi.getMessages(consultationId);
setMessages(response.messages || []);
```

## API Integration

### New API Service (`consultationApi`)
```javascript
// Provides methods:
consultationApi.getConsultations()      // GET /api/consultations
consultationApi.getConsultationById()   // GET /api/consultations/:id
consultationApi.createConsultation()    // POST /api/consultations (farmer)
consultationApi.acceptConsultation()    // POST /api/consultations/:id/accept (vet)
consultationApi.sendMessage()           // POST /api/consultations/:id/messages
consultationApi.getMessages()           // GET /api/consultations/:id/messages
consultationApi.submitDiagnosis()       // POST /api/consultations/:id/diagnosis (vet)
consultationApi.getLivestock()          // GET /api/livestock (farmer)
consultationApi.uploadImage()           // POST image upload
```

## Conditional Rendering Examples

### Example 1: Request Button (Farmer Only)
```javascript
{isFarmer && (
  <button
    onClick={() => setShowCreateForm(!showCreateForm)}
    className="bg-[#ea580c] text-white p-2 rounded-lg"
    title="Request new consultation"
  >
    <Plus className="w-5 h-5" />
  </button>
)}
```

### Example 2: Request Form (Farmer Only)
```javascript
{isFarmer && showCreateForm && (
  <div className="p-4 border-b border-gray-100 bg-orange-50 space-y-3">
    <h3 className="font-bold">Request Consultation</h3>
    {/* Form fields */}
    <button onClick={handleCreateConsultation}>Request</button>
  </div>
)}
```

### Example 3: Accept Button (Vet Only)
```javascript
{isVeterinarian && consult.status === 'pending' && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleAcceptConsultation(consult.id);
    }}
    className="bg-green-500 text-white px-2 py-1 rounded"
  >
    Accept
  </button>
)}
```

### Example 4: Diagnosis Form (Vet Only)
```javascript
{isVeterinarian && activeConsultation && 
 activeConsultation.status !== 'completed' && (
  <div className="p-6 bg-white border-t border-gray-200">
    <h3>Diagnosis & Treatment Plan</h3>
    {/* Form fields */}
    <button onClick={submitDiagnosis}>Submit Diagnosis</button>
  </div>
)}
```

## Error Handling

### Before (Silent Failures)
```javascript
// No error display
```

### After (User Feedback)
```javascript
{error && (
  <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
    <p className="text-sm text-red-700">{error}</p>
    <button onClick={fetchConsultations} className="mt-2">
      Retry
    </button>
  </div>
)}
```

## Loading States

### Before
```javascript
// No loading indicator
```

### After
```javascript
{loading && (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
  </div>
)}
```

## Offline Support

```javascript
// Queue messages when offline
if (isOffline) {
  setPendingMessages(prev => [...prev, messageObj]);
  alert("Message saved offline. Will send when connected.");
}

// Offline indicator
{isOffline && (
  <div className="p-4 bg-amber-50 border-t border-amber-100">
    <div className="flex items-center gap-2 text-amber-700">
      <WifiOff className="w-4 h-4" />
      <span>{pendingMessages.length} messages pending sync</span>
    </div>
  </div>
)}
```

---

## Summary of Changes

| Feature | Before | After |
|---------|--------|-------|
| Data Source | Mock arrays | Real API |
| Consultations | Hardcoded list | Fetched from DB |
| User Names | "Segokgo", "John Doe" | Real farmer/vet names |
| Farmer Actions | None | Can request consultation |
| Vet Actions | None | Can accept & diagnose |
| Diagnosis Form | Always shown | Vet-only visibility |
| Request Form | None | Farmer-only modal |
| Error Handling | None | User-friendly messages |
| Loading State | None | Spinner shown |
| Offline Mode | None | Message queuing |
| Authentication | No token | JWT authorization |

---

**Last Updated**: April 15, 2026
