# FF Management System - Setup & Testing Guide

## Fixed Issues ✅

### 1. **Tailwind CSS / PostCSS**
- Updated to use `@tailwindcss/postcss` v4.2.2
- Fixed `globals.css` with proper Tailwind v4 syntax
- Updated component classes for better responsive design

### 2. **UI/Styling**
- Improved button styling with proper focus/hover states
- Better form layout with centered signup/login pages
- Enhanced navbar with better mobile menu
- Redesigned landing page with better visual hierarchy
- All components use proper Tailwind classes

### 3. **Authentication**
- Added console logging to debug signup/login
- Improved error messages and display
- Added loading states with spinner icon
- Better form validation feedback

---

## Quick Start (Fresh Install)

### Step 1: Backend Setup

```bash
cd backend
npm install
# MongoDB should be running locally before this
npm run dev
```

**Expected**: Backend starts on `http://localhost:5000`

Console output should show:
```
✓ MongoDB connected
✓ Server running on http://localhost:5000
```

### Step 2: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**Expected**: Frontend starts on `http://localhost:5173`

Open your browser to `http://localhost:5173`

---

## Testing the System

### 1. **Test Landing Page** ✅
- Open http://localhost:5173
- You should see the FF Tournament Manager landing page
- Buttons should be styled (blue for primary, gray for secondary)
- Try responsive on mobile (hamburger menu)

### 2. **Test Signup** ✅
- Click "Get Started" button
- Page should redirect to signup form
- **Test credentials**:
  - Email: `test@example.com`
  - Username: `testuser`
  - Password: `password123`
- Click "Sign Up"
- Check browser console for logs (Ctrl+Shift+J)
- If successful: redirects to dashboard

### 3. **If Signup Fails** ❌
Check these in order:

**a) Is MongoDB running?**
```bash
# Open new terminal tab
mongod
# Should say "waiting for connections on port 27017"
```

**b) Check backend logs**
```bash
# Terminal where backend is running
# Should show "✓ MongoDB connected"
```

**c) Check browser console (F12 → Console tab)**
- Look for error messages
- Should see: "Sending signup request with: {email, username}"
- If you see "Network Error" → backend not running

**d) Check backend API directly**
```bash
# curl http://localhost:5000/api/health
# Should return: {"status":"OK","timestamp":"..."}
```

### 4. **Test Login** ✅
- Go to `/login`
- Use credentials you just signed up with:
  - Email: `test@example.com`
  - Password: `password123`
- Should redirect to dashboard

### 5. **Test Dashboard** ✅
- After login, you should see:
  - "Welcome, testuser!"
  - "Your Registrations" section
  - "Available Matches" section
  - Navbar should show username and logout button

---

## Common Issues & Fixes

### Issue: "Signup failed. Please try again."

**Fix 1: Check MongoDB**
```bash
# In new terminal
mongod
```

**Fix 2: Check backend logs**
```bash
# Look for: ✓ MongoDB connected
# If not, backend isn't connected to DB
```

**Fix 3: Check .env file**
```bash
# /backend/.env
MONGODB_URI=mongodb://localhost:27017/ff-management
JWT_SECRET=your_secret_key_here
PORT=5000
```

**Fix 4: Check network in browser**
- Open DevTools (F12)
- Go to Network tab
- Try signup again
- Look for requests to `localhost:5000/api/auth/signup`
- Check if request succeeds (200) or fails (500)

---

### Issue: "UI looks broken, buttons not styled"

**Fix 1: Clear CSS cache**
```bash
# In frontend directory
rm -rf node_modules/.vite  # Clear Vite cache
npm run dev  # Restart dev server
```

**Fix 2: Rebuild Tailwind**
```bash
# Exit dev server (Ctrl+C)
npm install  # Reinstall deps
npm run dev  # Start again
```

**Fix 3: Check if globals.css is imported**
```bash
# Open browser DevTools
# Go to Elements/Inspector tab
# Look for <style> tags with Tailwind
# Should see: @import "tailwindcss"
```

---

### Issue: "Frontend can't connect to backend"

**Check CORS**
```bash
# Make sure in /backend/server.js:
# app.use(cors());  ← Should be there

# And .env has:
# FRONTEND_URL=http://localhost:5173
```

**Check ports**
- Backend: http://localhost:5000 (check with `curl http://localhost:5000/api/health`)
- Frontend: http://localhost:5173 (check in browser)

---

## API Testing (Optional)

### Test Backend API with curl

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"testuser","password":"password123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

---

## What Should Work Now ✅

✅ Landing page loads with proper styling
✅ Buttons are blue and responsive
✅ Signup form validates inputs
✅ Login form works after signup
✅ Dashboard loads after login
✅ Mobile menu works
✅ Logout button works
✅ Console shows helpful debug logs

---

## File Changes Made

```
✓ /frontend/src/styles/globals.css - Updated Tailwind syntax
✓ /frontend/tailwind.config.js - Fixed config
✓ /frontend/postcss.config.js - Using @tailwindcss/postcss
✓ /frontend/src/pages/Signup.jsx - Better styling & logging
✓ /frontend/src/pages/Login.jsx - Better styling & logging
✓ /frontend/src/components/Navbar.jsx - Improved design
✓ /frontend/src/pages/Landing.jsx - Redesigned with better UX
```

---

## Next Steps

1. **Test the complete flow**:
   - Signup → Login → Dashboard → Create Team → Register for Match

2. **For Admin testing**:
   - Need to create an admin user manually in MongoDB:
     ```js
     db.users.updateOne({email:"admin@test.com"}, {$set:{role:"admin"}})
     ```

3. **Enable Debug Logging**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Watch logs as you signup/login

---

## Support

If something still doesn't work:

1. **Check browser console** (F12 → Console)
2. **Check backend terminal** (look for error messages)
3. **Check MongoDB** (`mongod` running in separate terminal)
4. **Check ports** (5000 for backend, 5173 for frontend)
5. **Check .env files** (both backend and frontend)

**If still stuck**: Share the exact error message from console/terminal and I'll help debug!

---

**Ready to test? Run both servers and visit http://localhost:5173** 🚀
