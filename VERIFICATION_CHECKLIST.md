# Farm AID Authentication Fix - Verification Checklist

## ✅ Pre-Setup Checklist

### Environment Setup
- [ ] Node.js v14+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] PostgreSQL installed and running (`psql --version`)
- [ ] Git installed for version control

### Repository State
- [ ] All modified files are in place
- [ ] No uncommitted changes breaking the code
- [ ] Environment files (.env) are configured

---

## 📦 Installation Verification

### Backend Setup
- [ ] Navigate to project root: `cd "Farm AID"`
- [ ] Install dependencies: `npm install`
- [ ] Check for installation errors: `npm list --depth=0`
- [ ] Verify packages installed:
  - [ ] express
  - [ ] sequelize
  - [ ] pg (PostgreSQL driver)
  - [ ] bcryptjs
  - [ ] jsonwebtoken
  - [ ] dotenv

### Frontend Setup
- [ ] Navigate to frontend: `cd FrontEnd`
- [ ] Install dependencies: `npm install`
- [ ] Check for installation errors: `npm list --depth=0`
- [ ] Verify React packages installed

---

## 🗄️ Database Setup Verification

### PostgreSQL Installation
- [ ] Check if PostgreSQL is installed: `psql --version`
- [ ] Check if PostgreSQL service is running:
  ```bash
  # macOS: Check if running
  brew services list | grep postgresql
  
  # Linux: Check status
  systemctl status postgresql
  
  # Windows: Check services
  ```
- [ ] Default user 'postgres' can connect: `psql -U postgres`

### Database Creation
- [ ] Create database:
  ```bash
  createdb farm_aid_db
  ```
  Or in psql:
  ```sql
  CREATE DATABASE farm_aid_db;
  ```
- [ ] Verify database exists:
  ```bash
  psql -U postgres -l | grep farm_aid_db
  ```
- [ ] Connect to database:
  ```bash
  psql -U postgres -d farm_aid_db
  ```

---

## ⚙️ Configuration Verification

### Backend .env File
- [ ] `.env` exists in project root
- [ ] Contains all required variables:
  - [ ] `NODE_ENV=development`
  - [ ] `PORT=5000`
  - [ ] `DB_HOST=localhost`
  - [ ] `DB_PORT=5432`
  - [ ] `DB_NAME=farm_aid_db`
  - [ ] `DB_USER=postgres`
  - [ ] `DB_PASSWORD=postgres` (or your password)
  - [ ] `JWT_SECRET=...` (set to something secure)
  - [ ] `JWT_REFRESH_SECRET=...` (set to something secure)

### Frontend .env File
- [ ] `.env` exists in `FrontEnd` folder
- [ ] Contains all required variables:
  - [ ] `REACT_APP_API_URL=http://localhost:5000/api`
  - [ ] `REACT_APP_ENV=development`

---

## 🚀 Backend Server Startup Verification

### Start Backend
```bash
cd "Farm AID"
npm start
```

### Check Output
- [ ] No error messages during startup
- [ ] Output shows: `✅ PostgreSQL connected`
- [ ] Output shows: `✅ Database tables synchronized`
- [ ] Output shows: `🚀 Server running on port 5000`
- [ ] Port 5000 is accessible: `curl http://localhost:5000/health`

### Backend Port Verification
- [ ] Backend listening on port 5000: `netstat -an | grep 5000` (or lsof -i :5000)
- [ ] Health check responds: `curl http://localhost:5000/health`

---

## 🎨 Frontend Server Startup Verification

### Start Frontend
```bash
cd FrontEnd
npm run dev
```

### Check Output
- [ ] No build errors
- [ ] Output shows local URL: `http://localhost:5173` (or similar)
- [ ] Frontend is accessible in browser
- [ ] Console shows no JavaScript errors (F12 -> Console)

---

## 🧪 Basic Authentication Test

### Test 1: Server Health Check
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-04-14T...",
  "uptime": 123.45
}
```
- [ ] Health check returns 200 status

### Test 2: User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```
Expected response: 201 status with `accessToken` and `refreshToken`
- [ ] Returns 201 Created
- [ ] Response includes `accessToken`
- [ ] Response includes `refreshToken`
- [ ] Response includes `user` object

### Test 3: User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```
Expected response: 200 status with tokens
- [ ] Returns 200 OK
- [ ] Response includes `accessToken`
- [ ] Response includes `refreshToken`
- [ ] Response includes `user` with email

### Test 4: Get Profile (Protected)
```bash
# Replace TOKEN with actual accessToken from login
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```
Expected response: 200 status with user profile
- [ ] Returns 200 OK
- [ ] Response includes user profile
- [ ] Response includes email, name, role

---

## 🎯 Frontend UI Testing

### Test Login Flow
- [ ] Open http://localhost:5173 in browser
- [ ] Click on Register or Login
- [ ] Enter test credentials:
  - [ ] Email: `frontend@example.com`
  - [ ] Password: `Frontend123!`
- [ ] Register button works (or Login with existing user)
- [ ] After login, check:
  - [ ] Logged in status shows in UI
  - [ ] User name displays
  - [ ] Can access profile page
  - [ ] localStorage has `accessToken` and `refreshToken` (F12 -> Application -> LocalStorage)

### Test Profile Page
- [ ] Profile page loads
- [ ] User information displays correctly
- [ ] Can update profile
- [ ] Changes save successfully

### Test Logout
- [ ] Logout button available
- [ ] After logout, redirects to login
- [ ] localStorage tokens are cleared
- [ ] Cannot access protected pages

---

## 🔒 Token Verification

### Check localStorage
- [ ] Open DevTools (F12)
- [ ] Go to Application tab
- [ ] Check LocalStorage:
  - [ ] `accessToken` present after login
  - [ ] `refreshToken` present after login
  - [ ] `user` object present with user data

### Check Token Content
```javascript
// In browser console
const token = localStorage.getItem('accessToken');
console.log(token);
// Should be a JWT (three parts separated by dots)
```
- [ ] Token has format: `xxxxx.yyyyy.zzzzz`
- [ ] Can be decoded (paste into jwt.io for verification)

---

## 🔄 Token Refresh Test

### Test Manual Refresh
```bash
# Get refreshToken from login response
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "REFRESH_TOKEN_HERE"
  }'
```
Expected response: 200 with new `accessToken`
- [ ] Returns 200 OK
- [ ] Response includes new `accessToken`
- [ ] New token is different from old token

---

## 🗂️ Database Verification

### Check Database Tables
```bash
psql -U postgres -d farm_aid_db
\dt
```
- [ ] `users` table exists
- [ ] `sequelize_meta` table exists (for migrations)

### Check User Record
```sql
SELECT id, email, name, role FROM users;
```
- [ ] User created during registration appears in table
- [ ] Email field is correct
- [ ] Role defaults to 'farmer'

---

## 📝 File Structure Verification

### Backend Directories
- [ ] `Backend/src/config/database.js` exists
- [ ] `Backend/src/models/User.js` exists
- [ ] `Backend/src/routes/authRoutes.js` exists
- [ ] `Backend/src/controllers/authController.js` exists

### Frontend Directories
- [ ] `FrontEnd/src/context/AuthContext.jsx` exists
- [ ] `FrontEnd/src/services/authService.jsx` exists
- [ ] `FrontEnd/src/services/api.jsx` exists

### Configuration Files
- [ ] `.env` exists in root
- [ ] `.env.example` exists in root
- [ ] `FrontEnd/.env` exists

### Documentation Files
- [ ] `AUTH_SETUP_GUIDE.md` exists
- [ ] `AUTH_FIX_SUMMARY.md` exists
- [ ] `QUICK_START.md` exists

---

## 🚨 Error Troubleshooting

### If Backend Won't Start
- [ ] Check `.env` file has correct database credentials
- [ ] PostgreSQL service is running
- [ ] Port 5000 is not in use (change in `.env` if needed)
- [ ] Check for connection errors in terminal
- [ ] Try: `npm install --save-dev` to reinstall dependencies

### If PostgreSQL Connection Fails
- [ ] Check PostgreSQL is running: `psql -U postgres`
- [ ] Verify database exists: `psql -U postgres -l | grep farm_aid_db`
- [ ] Check `.env` has correct host/port/username/password
- [ ] On Windows, might need to use `password` authentication

### If Frontend Won't Connect
- [ ] Check backend is running: `curl http://localhost:5000/health`
- [ ] Check `FrontEnd/.env` has correct `REACT_APP_API_URL`
- [ ] Check browser console (F12) for CORS errors
- [ ] Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Clear browser cache

### If Login Returns Error
- [ ] Check email doesn't already exist (try different email)
- [ ] Check password meets requirements
- [ ] Check backend console for error details
- [ ] Try creating user with cURL first to test backend

---

## ✨ Additional Verification

### Test Error Handling
1. Try registering with invalid email:
   - [ ] Returns 400 error
   - [ ] Error message is clear

2. Try logging in with wrong password:
   - [ ] Returns 401 error
   - [ ] No tokens in response

3. Try accessing protected endpoint without token:
   - [ ] Returns 401 error

4. Try using expired/invalid token:
   - [ ] Returns 401 error
   - [ ] Frontend should handle gracefully

---

## 🎓 Final Integration Test

### Complete Workflow
1. [ ] Register new user
2. [ ] Receive tokens in response
3. [ ] Login returns same tokens
4. [ ] Use accessToken to get profile
5. [ ] Update profile successfully
6. [ ] Change password works
7. [ ] Logout clears tokens
8. [ ] Cannot access protected endpoints after logout
9. [ ] Can login again with new password

---

## 📋 Pre-Production Checklist

Before deploying to production:
- [ ] Change all JWT secrets in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for production domain
- [ ] Set up HTTPS
- [ ] Configure production database
- [ ] Review security settings
- [ ] Set up monitoring and logging
- [ ] Test with real SSL certificate
- [ ] Set up automated backups
- [ ] Document deployment steps

---

## ✅ Completion Criteria

Your authentication system is ready when:
- ✅ Backend starts without errors
- ✅ Frontend loads without errors
- ✅ Can register new user
- ✅ Can login with credentials
- ✅ Tokens are stored in localStorage
- ✅ Can access protected endpoints
- ✅ Profile updates work
- ✅ Logout works
- ✅ All documentation has been read

---

## 📞 Getting Help

If something doesn't work:
1. Check the error message carefully
2. Review [QUICK_START.md](QUICK_START.md)
3. Check [AUTH_SETUP_GUIDE.md](AUTH_SETUP_GUIDE.md) for detailed instructions
4. Review [AUTH_FIX_SUMMARY.md](AUTH_FIX_SUMMARY.md) for technical details
5. Check browser console (F12) for JavaScript errors
6. Check backend terminal for server errors

---

**Note:** Keep this checklist handy. Use it to verify your setup is working correctly and to troubleshoot any issues.

Last Updated: April 14, 2024
