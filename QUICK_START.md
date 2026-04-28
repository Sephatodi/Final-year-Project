# Authentication Fix - Quick Start Guide

## 🎯 What Was Fixed

Your authentication system has been completely refactored and now properly connects to PostgreSQL database. The fix includes:

✅ Unified backend authentication routes  
✅ PostgreSQL database integration  
✅ Two-token JWT system (access + refresh)  
✅ Frontend API integration  
✅ Automatic token refresh mechanism  
✅ Proper error handling  
✅ Environment configuration  

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install PostgreSQL (if not already installed)
```bash
# macOS (Homebrew)
brew install postgresql@15

# Windows: Download from https://www.postgresql.org/download/windows/

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
```

### Step 2: Create Database
```bash
# Start PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE farm_aid_db;
\q
```

### Step 3: Backend Setup
```bash
cd "Farm AID"

# Install dependencies (if not done)
npm install

# Start backend server
npm start
# or
node server.js
```

**Expected Output:**
```
✅ PostgreSQL connected
✅ Database tables synchronized
🚀 Server running on port 5000
```

### Step 4: Frontend Setup
```bash
cd FrontEnd

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
# or
npm start
```

**Expected Output:**
```
  ➜  Local:   http://localhost:5173/
```

---

## 🧪 Test Authentication

### Method 1: Using the App (UI)
1. Open http://localhost:5173
2. Register a new account
3. Login with the credentials
4. Check profile page

### Method 2: Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

---

## 📋 Configuration Files

### Backend (.env in root folder)
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=farm_aid_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=farm-aid-super-secret-jwt-key-2024
JWT_REFRESH_SECRET=farm-aid-refresh-secret-2024
```

### Frontend (.env in FrontEnd folder)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔑 Key Files Modified

### Backend
- `server.js` - Fixed imports and startup
- `Backend/src/config/database.js` - PostgreSQL setup
- `Backend/src/routes/authRoutes.js` - All auth endpoints
- `Backend/src/models/User.js` - User model with new fields

### Frontend
- `FrontEnd/src/context/AuthContext.jsx` - Auth state management
- `FrontEnd/src/services/authService.jsx` - Auth API calls
- `FrontEnd/src/services/api.jsx` - HTTP client with token handling

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh-token` | Get new access token |
| GET | `/api/auth/profile` | Get user info (protected) |
| PUT | `/api/auth/profile` | Update user info (protected) |
| POST | `/api/auth/change-password` | Change password (protected) |
| DELETE | `/api/auth/account` | Delete account (protected) |

All protected endpoints need: `Authorization: Bearer <accessToken>`

---

## 🚨 Common Issues

### Issue: "Port 5000 already in use"
```bash
# Find and kill process using port 5000
lsof -i :5000
kill -9 <PID>
```

### Issue: "Cannot connect to PostgreSQL"
```bash
# Check if PostgreSQL is running
psql -U postgres -d farm_aid_db

# If fails, start PostgreSQL:
# macOS: brew services start postgresql@15
# Linux: sudo systemctl start postgresql
```

### Issue: Frontend shows "Cannot reach backend"
```bash
# Verify backend is running on port 5000
curl http://localhost:5000/health

# Check REACT_APP_API_URL in FrontEnd/.env
```

### Issue: Login works but profile page is empty
```bash
# Clear browser localStorage
# Press F12 → Application → LocalStorage → Clear All
# Refresh page and login again
```

---

## 📖 Full Documentation

For complete information, see:

1. **[AUTH_SETUP_GUIDE.md](AUTH_SETUP_GUIDE.md)** - Comprehensive setup guide
2. **[AUTH_FIX_SUMMARY.md](AUTH_FIX_SUMMARY.md)** - Detailed changes and technical info

---

## 🔐 Security Notes

1. **Change JWT Secret** in `.env` before production
2. **Use HTTPS** in production
3. **Environment variables** - Never commit `.env` to git
4. **Tokens** - Stored in localStorage for now (consider httpOnly cookies for production)

---

## ✅ Checklist Before Going Production

- [ ] PostgreSQL backup configured
- [ ] JWT secrets changed to strong values
- [ ] CORS configured for production domain
- [ ] Environment variables in production set correctly
- [ ] HTTPS enabled
- [ ] Database migrations tested
- [ ] Email verification implemented
- [ ] Rate limiting added
- [ ] Logging and monitoring set up
- [ ] Error tracking (Sentry, etc.) configured

---

## 💡 Need Help?

Check:
1. Browser console (F12) for JavaScript errors
2. Backend terminal for server errors
3. PostgreSQL logs for database issues
4. Network tab (F12 → Network) to see API calls

---

## 🎓 Next Steps

1. ✅ Test authentication flows
2. ✅ Verify database persistence
3. 🔄 Implement user profile UI
4. 🔄 Add password reset feature
5. 🔄 Implement 2FA
6. 🔄 Add role-based access control

---

## 📞 Support

All endpoints return consistent JSON:
```json
{
  "success": true/false,
  "message": "Error or success message",
  "token": "...",
  "user": { ... }
}
```

Error responses include status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error

---

**Authentication system is now ready! 🎉**
