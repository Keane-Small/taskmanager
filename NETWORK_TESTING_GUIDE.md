# Network Testing Guide - Messaging Between 2 PCs

## Overview
This guide helps you test the messaging functionality between two different computers on the same local network.

---

## Prerequisites

- Both PCs must be on the same WiFi/network
- Backend PC IP: **192.168.12.194**
- Firewall must allow connections on port 5000 and 3000

---

## Setup Instructions

### PC 1 (Backend Host - Your Current PC)

This PC will run both the backend server and frontend.

#### Step 1: Start Backend Server
```bash
cd taskmanager-main/Backend
npm start
```

You should see:
```
Server running on port 5000
Local: http://localhost:5000
Network: http://192.168.12.194:5000
```

#### Step 2: Start Frontend
```bash
cd taskmanager-main/FrontEnd
npm start
```

Frontend will run on: `http://localhost:3000`

#### Step 3: Create User 1
1. Open browser: `http://localhost:3000`
2. Click "Sign Up"
3. Create account:
   - Name: User One
   - Email: user1@test.com
   - Password: password123
4. Login and navigate to Messages

---

### PC 2 (Second User - Different PC)

This PC will only run the frontend, connecting to PC 1's backend.

#### Step 1: Get the Code
Option A - Clone from GitHub:
```bash
git clone https://github.com/Keane-Small/taskmanager.git
cd taskmanager/FrontEnd
```

Option B - Copy the FrontEnd folder from PC 1 via USB/network share

#### Step 2: Install Dependencies
```bash
cd FrontEnd
npm install
```

#### Step 3: Configure Network Connection
Create a `.env` file in the FrontEnd folder:
```bash
# FrontEnd/.env
REACT_APP_API_URL=http://192.168.12.194:5000/api
```

Or copy the `.env.network` file:
```bash
copy .env.network .env
```

#### Step 4: Start Frontend
```bash
npm start
```

If port 3000 is taken, it will ask to use 3001. Accept it.

#### Step 5: Create User 2
1. Open browser: `http://localhost:3000` (or 3001)
2. Click "Sign Up"
3. Create account:
   - Name: User Two
   - Email: user2@test.com
   - Password: password123
4. Login and navigate to Messages

---

## Testing Messaging

### Send Message from User 1 to User 2

**On PC 1:**
1. Go to Messages page
2. Click on "User Two" in the user list
3. Type a message: "Hello from User 1!"
4. Click Send

**On PC 2:**
1. You should see the unread count update
2. Click on "User One" in the user list
3. You should see the message: "Hello from User 1!"

### Send Message from User 2 to User 1

**On PC 2:**
1. Type a reply: "Hi User 1! I got your message!"
2. Click Send

**On PC 1:**
1. You should see the unread count update
2. The message should appear in the conversation

---

## Troubleshooting

### Issue 1: Cannot Connect to Backend

**Error:** `Failed to fetch` or `Network Error`

**Solutions:**

1. **Check Firewall:**
   ```bash
   # On PC 1 (Windows), allow port 5000
   # Open Windows Defender Firewall
   # Add inbound rule for port 5000
   ```

2. **Verify Backend is Running:**
   ```bash
   # On PC 1, test locally
   curl http://localhost:5000
   
   # Should return: "API is running"
   ```

3. **Test Network Connection:**
   ```bash
   # On PC 2, ping PC 1
   ping 192.168.12.194
   
   # Should get replies
   ```

4. **Test Backend from PC 2:**
   ```bash
   # On PC 2, open browser
   http://192.168.12.194:5000
   
   # Should show: "API is running"
   ```

### Issue 2: CORS Error

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
Backend is already configured to allow all origins. If you still see this:

1. Check Backend console for errors
2. Restart backend server
3. Clear browser cache on PC 2

### Issue 3: Messages Not Appearing

**Possible Causes:**

1. **Database Issue:**
   - Ensure MongoDB is running on PC 1
   - Check Backend console for database errors

2. **Polling Not Working:**
   - Messages should update every 3 seconds
   - Check browser console for errors
   - Try refreshing the page

3. **Wrong User Selected:**
   - Make sure you're viewing the correct conversation
   - Check that both users are logged in

### Issue 4: Firewall Blocking Connection

**Windows Firewall:**

1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules"
4. Click "New Rule"
5. Select "Port"
6. Enter port: 5000
7. Allow the connection
8. Apply to all profiles
9. Name it: "Task Manager Backend"

**Alternative - Temporarily Disable:**
```bash
# Not recommended for production, but for testing:
# Turn off Windows Firewall temporarily
```

---

## Alternative: Using Same PC with Different Browsers

If you don't have access to 2 PCs, you can test with:

### Option 1: Two Browser Windows
1. Open Chrome: Login as User 1
2. Open Firefox: Login as User 2
3. Test messaging between browsers

### Option 2: Incognito/Private Mode
1. Regular window: Login as User 1
2. Incognito window: Login as User 2
3. Test messaging

### Option 3: Different Browser Profiles
1. Chrome Profile 1: Login as User 1
2. Chrome Profile 2: Login as User 2
3. Test messaging

---

## Network Configuration Details

### Current Setup

```
┌─────────────────────────────────────────┐
│         Your WiFi Network               │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  PC 1 (192.168.12.194)           │  │
│  │                                  │  │
│  │  Backend:  :5000                 │  │
│  │  Frontend: :3000                 │  │
│  │  MongoDB:  :27017                │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  PC 2 (192.168.12.xxx)           │  │
│  │                                  │  │
│  │  Frontend: :3000                 │  │
│  │  ↓ connects to ↓                 │  │
│  │  PC1 Backend: 192.168.12.194:5000│  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Port Usage

- **5000:** Backend API (must be accessible from network)
- **3000:** Frontend (PC 1)
- **3000/3001:** Frontend (PC 2)
- **27017:** MongoDB (only needs localhost access)

---

## Quick Commands Reference

### PC 1 (Backend Host)

```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend
cd FrontEnd
npm start

# Check IP
ipconfig | findstr IPv4
```

### PC 2 (Second User)

```bash
# Setup
cd FrontEnd
npm install

# Create .env file
echo REACT_APP_API_URL=http://192.168.12.194:5000/api > .env

# Start
npm start

# Test connection
curl http://192.168.12.194:5000
```

---

## Testing Checklist

- [ ] Backend running on PC 1
- [ ] Frontend running on PC 1
- [ ] User 1 created and logged in (PC 1)
- [ ] Frontend running on PC 2
- [ ] .env configured on PC 2
- [ ] User 2 created and logged in (PC 2)
- [ ] Both users can see each other in Messages
- [ ] User 1 can send message to User 2
- [ ] User 2 receives message
- [ ] User 2 can reply to User 1
- [ ] User 1 receives reply
- [ ] Unread counts update correctly
- [ ] Messages persist after refresh

---

## Advanced: Mobile Testing

You can also test from a mobile phone on the same WiFi:

1. On your phone, open browser
2. Go to: `http://192.168.12.194:3000`
3. Create User 3
4. Test messaging with PC users

---

## Production Deployment

For real-world use (not just testing), deploy to cloud:
- See `CLOUD_DEPLOYMENT_GUIDE.md`
- Use Vercel + Railway + MongoDB Atlas
- Get proper domain and SSL

---

## Support

If you encounter issues:

1. Check both Backend and Frontend console logs
2. Verify network connectivity with ping
3. Test backend endpoint directly in browser
4. Check firewall settings
5. Ensure both PCs are on same network

---

**Last Updated:** October 31, 2025  
**Network IP:** 192.168.12.194  
**Backend Port:** 5000  
**Frontend Port:** 3000
