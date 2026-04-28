# Admin User Management - Quick Testing Guide

## How to Test the Implementation

### 1. Access Admin Dashboard
```
Navigate to: http://localhost:3000/admin (or your configured path)
```

---

## Testing CRUD Operations

### ✅ CREATE (Add User)

**Add a Farmer:**
1. Click **"Add Farmer"** button (orange)
2. Fill form:
   - Name: "Test Farmer"
   - Email: "test@farm.com"
   - Phone: "+267 71 999 999"
   - Farm Name: "Test Farm"
   - Location: "Test City"
3. Click **"Add"** button
4. ✅ Should see green success message
5. ✅ New farmer appears in table with ID F-004

**Add a Veterinarian:**
1. Click on **"Veterinarians"** tab
2. Click **"Add Veterinarian"** button
3. Fill form:
   - Name: "Dr. Test Vet"
   - Email: "test@vet.com"
   - Phone: "+267 76 888 888"
   - License: "VETC/2024/003"
   - Specialization: "Ruminants" (dropdown)
4. Click **"Add"** button
5. ✅ Should see green success message
6. ✅ New veterinarian appears with ID V-003

---

### ✅ READ (View Users)

**View All Farmers:**
1. Click **"Farmers"** tab
2. ✅ Should see all 3 existing farmers in table
3. ✅ Table shows: ID, Name, Email, Phone, Farm, Location, Status, Actions
4. Columns display correctly:
   - ID: Dark gray
   - Name with registration date
   - Email with 📧 icon
   - Phone with ☎️ icon
   - Farm Name: "Mthembu Farm", etc.
   - Location with 📍 icon
   - Status badge (green ✓ or gray ◯)

**View All Veterinarians:**
1. Click **"Veterinarians"** tab
2. ✅ Should see all 2 existing veterinarians
3. Verify fields: License number, Specialization

**Statistics Update:**
1. Add a new farmer
2. ✅ "Total Farmers" card increments
3. ✅ "Active" count updates if status=active
4. Repeat for veterinarians

---

### ✅ UPDATE (Edit User)

**Edit a Farmer:**
1. Click **"Farmers"** tab
2. Find a farmer row
3. Click **✏️ (Edit)** icon on the right
4. Modal appears with current data populated
5. Change a field (e.g., Farm Name → "Updated Farm")
6. Click **"Update"** button
7. ✅ Success message appears
8. ✅ Table updates with new value

**Edit a Veterinarian:**
1. Click **"Veterinarians"** tab
2. Find a veterinarian row
3. Click **✏️ (Edit)** icon
4. Modal appears with vet data
5. Change specialization
6. Click **"Update"**
7. ✅ Changes reflected in table

**Cancel Edit:**
1. Open edit modal
2. Change a field
3. Click **"Cancel"** button
4. ✅ Modal closes without saving
5. ✅ Original data still in table

---

### ✅ DELETE (Remove User)

**Delete a Farmer:**
1. Click **"Farmers"** tab
2. Find a farmer (try F-003: David Osei)
3. Click **🗑️ (Delete)** icon
4. ✅ Confirmation dialog appears: "Are you sure you want to delete this farmer? This action cannot be undone."
5. Click "OK" to confirm
6. ✅ Success message: "User deleted successfully!"
7. ✅ Farmer removed from table
8. ✅ Total count decrements

**Cancel Delete:**
1. Click delete button
2. Confirmation dialog appears
3. Click "Cancel"
4. ✅ User NOT deleted, still visible in table

---

## Testing Search & Filter

### 🔍 Search

**Search by Name:**
1. In search box, type: "john"
2. ✅ Only "John Mthembu" appears
3. Type: "mary"
4. ✅ Only "Mary Setlhako" appears
5. Clear search box
6. ✅ All farmers reappear

**Search by Email:**
1. Type in search: "farm.com"
2. ✅ Only farmers with @farm.com appear
3. Type: "kagiso"
4. ✅ Filters to show matching results

**Search across tabs:**
1. Search in Farmers tab
2. Switch to Veterinarians tab
3. ✅ Search is cleared (new search context)

---

### 📊 Filter by Status

**Filter Active:**
1. Status dropdown → Select "Active"
2. ✅ Only users with status='active' shown
3. ✅ Count: 2 farmers, 2 veterinarians

**Filter Inactive:**
1. Status dropdown → Select "Inactive"
2. ✅ Only David Osei (F-003) visible in farmers
3. ✅ Table shows 1 user

**Filter All:**
1. Status dropdown → Select "All Status"
2. ✅ All users visible again
3. ✅ All 3 farmers shown

**Combine Search + Filter:**
1. Search: "set"
2. Filter: "Active"
3. ✅ Only "Mary Setlhako" appears (matches search + active)
4. Filter: "Inactive"
5. ✅ No results (Mary is active, not inactive)

---

## Testing Status Toggle

### 👁️ Toggle User Status

**Activate Inactive User:**
1. Filter → "Inactive"
2. Click status badge "◯ Inactive" (gray) on David Osei
3. ✅ Badge changes to "✓ Active" (green)
4. ✅ Success message: "User status updated successfully!"
5. ✅ User moves to "Active" when filtered

**Deactivate Active User:**
1. Filter → "All Status"
2. Click status badge "✓ Active" (green) on John Mthembu
3. ✅ Badge changes to "◯ Inactive" (gray)
4. ✅ Active count decrements in stats card

---

## Testing Form Validation

### ❌ Email Validation

**Invalid Email - No @:**
1. Add Farmer modal
2. Email: "testfarm"
3. Click Add
4. ✅ Error: "Please enter a valid email address"

**Invalid Email - No domain:**
1. Email: "test@"
2. Click Add
3. ✅ Error message appears

**Valid Email:**
1. Email: "test@example.com"
2. Click Add
3. ✅ Proceeds to validation next field

---

### ☎️ Phone Validation

**Invalid Phone - Too short:**
1. Phone: "123"
2. Click Add
3. ✅ Error: "Please enter a valid phone number"

**Valid Formats Accepted:**
- "+267 71 234 567" ✅
- "+26771234567" ✅
- "71-234-567" ✅
- "71.234.567" ✅

---

### 📝 Required Fields

**Missing Name:**
1. Add modal
2. Leave Name empty
3. Click Add
4. ✅ Error: "Please fill in all required fields"

**Missing Farm Details (Farmer only):**
1. Fill all common fields
2. Leave Farm Name empty
3. Click Add
4. ✅ Error: "Please fill in all farm details"

**Missing Vet Details (Veterinarian only):**
1. Fill all common fields
2. Leave License empty
3. Click Add
4. ✅ Error: "Please fill in all veterinary details"

---

## Testing Export (CSV)

### 📥 Export Users

**Export Farmers:**
1. Farmers tab → Click **"Export"** button
2. ✅ Download starts
3. ✅ File named: "farmers-export-YYYY-MM-DD.csv"
4. Open CSV in Excel/Sheets
5. ✅ Headers: id, name, email, phone, farmName, location, status, registeredDate, livestockCount
6. ✅ All farmer data rows present

**Export Veterinarians:**
1. Veterinarians tab → Click **"Export"**
2. ✅ File named: "veterinarians-export-YYYY-MM-DD.csv"
3. ✅ Headers: id, name, email, phone, license, specialization, status, registeredDate, consultations

**Export with Filter:**
1. Filter → "Active"
2. Click Export
3. ✅ CSV only contains active users (not inactive)

**Export Empty:**
1. Search: "zzzzzzz" (no match)
2. Click Export
3. ✅ Export button disabled (grayed out)

---

## Testing UI/UX

### 📱 Responsive Design

**Desktop (Full Width):**
- ✅ All columns visible
- ✅ Table scrolls horizontally if needed
- ✅ Proper spacing

**Tablet (Medium):**
- ✅ Stats cards stack to 2 per row
- ✅ Table might need horizontal scroll
- ✅ Buttons properly sized

**Mobile (Small):**
- ✅ Stats stack to 1 per row
- ✅ Modal takes full width
- ✅ Buttons remain usable

---

### 💬 Messages

**Success Messages:**
- ✅ Green background, white text
- ✅ Check icon
- ✅ Auto-disappear after 3 seconds
- ✅ Can add multiple messages

**Error Messages:**
- ✅ Red background, white text
- ✅ Alert circle icon
- ✅ Persist until resolved
- ✅ Multiple errors show one at a time

---

### 🎨 Visual States

**Button States:**
- Normal: Orange background
- Hover: Darker orange (#c2410a)
- Disabled: Faded/opacity-50
- Clicked: Slight animation

**Input States:**
- Empty: Gray border
- Focused: Ring highlight (orange)
- Error: Red border (when validation fails)

**Badge States:**
- Active: Green ✓
- Inactive: Gray ◯
- Clickable: Hover changes shade

---

## Testing Modal Behavior

### Modal Form

**Open Modal:**
1. Click Add button
2. ✅ Modal appears with overlay
3. ✅ Header shows title
4. ✅ Fields are empty (new) or populated (edit)

**Scroll Form:**
1. Add Veterinarian modal
2. Form has many fields
3. ✅ Can scroll within modal
4. ✅ Header remains sticky
5. ✅ Buttons visible at bottom

**Tab Navigation (Accessibility):**
1. Modal open
2. Press Tab key
3. ✅ Focus moves through inputs
4. ✅ Can reach buttons

**Escape Key:**
1. Modal open
2. Press Escape
3. ✅ Modal should close (if implemented) or use Cancel button

---

## Testing Tab Switching

### Farmer ↔ Veterinarian Tabs

**Switch to Veterinarians:**
1. Start on Farmers tab
2. Click Veterinarians tab
3. ✅ Tab highlight moves to Vet tab
4. ✅ Table updates to show vets
5. ✅ Stats update (shows vet counts)
6. ✅ Add button text changes to "Add Veterinarian"

**Switch back to Farmers:**
1. From Veterinarians tab
2. Click Farmers tab
3. ✅ Highlights switch
4. ✅ Previous search/filter is cleared
5. ✅ Full farmer list shows

**Tab Counts:**
- ✅ Farmers badge shows farmer count
- ✅ Veterinarians badge shows vet count
- ✅ Counts update when users added/deleted

---

## Edge Cases to Test

### 1. Empty Lists
- Delete all farmers
- ✅ Table shows: "No farmers found"
- ✅ Export button disabled

### 2. Search with No Results
- Search: "xyz999"
- ✅ Table shows: "No farmers found"
- ✅ Stats still show real counts (not filtered)

### 3. Add Then Edit
1. Add farmer: "New Farmer"
2. Immediately click Edit
3. ✅ Modal pre-fills with new data
4. ✅ Can edit successfully

### 4. Multiple Additions
1. Add 5 farmers in sequence
2. ✅ Each gets unique ID (F-004, F-005, etc.)
3. ✅ All appear in table
4. ✅ Total count increments each time

### 5. Status Toggle Multiple Times
1. Toggle farmer from Active → Inactive
2. Toggle again to Active
3. ✅ Works consistently
4. ✅ No data loss

---

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Mobile browsers

---

## Performance Notes

✅ Mock data operations are instant
✅ Search/filter has no lag
✅ CSV export completes immediately
✅ Modal opens without delay
✅ Form validation is synchronous

---

## Summary Checklist

- [ ] Add Farmer works
- [ ] Add Veterinarian works
- [ ] Edit Farmer works
- [ ] Edit Veterinarian works
- [ ] Delete Farmer works (with confirmation)
- [ ] Delete Veterinarian works
- [ ] Status toggle works
- [ ] Search by name works
- [ ] Search by email works
- [ ] Filter by status works
- [ ] Export to CSV works
- [ ] Form validation (email) works
- [ ] Form validation (phone) works
- [ ] Form validation (required) works
- [ ] Tab switching works
- [ ] Success messages appear & disappear
- [ ] Error messages appear
- [ ] Modal Cancel button works
- [ ] UI responsive on mobile
- [ ] All icons display correctly

---

**All tests passed? ✅ Ready for backend integration!**
