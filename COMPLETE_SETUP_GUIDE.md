# Complete TaskFlow Setup Guide

## Prerequisites
- Node.js installed
- MongoDB installed and running
- Git (optional)

## Backend Setup

### 1. Install Dependencies
```bash
cd taskmanager-main/Backend
npm install
```

### 2. Configure Environment
Create a `.env` file in the Backend folder:
```
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### 3. Start MongoDB
**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 4. Start Backend Server
```bash
node index.js
```

You should see:
```
Server running on port 5000
MongoDB connected
```

## Frontend Setup

### 1. Install Dependencies (if not already done)
```bash
cd taskmanager-main/FrontEnd
npm install
```

### 2. Configure Environment
The `.env` file is already created with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Frontend
```bash
npm start
```

The app will open at http://localhost:3000

## Using the Application

### 1. Register Users
1. Click "Sign Up" on the landing page
2. Fill in:
   - Name: Your full name
   - Email: your@email.com
   - Password: minimum 6 characters
3. Click "Sign Up"
4. You'll be automatically logged in

### 2. Create Multiple Users
To test messaging between users:
1. Logout (top right button)
2. Register another user with different email
3. Repeat for as many users as you want

### 3. Start Messaging

#### Direct Messages:
1. Click the Messages icon (💬) in the sidebar
2. Click "Direct Messages" tab
3. You'll see all other registered users
4. Click on any user to start chatting
5. Type your message and press Enter or click Send

#### Group Chats:
1. First, create a project (click Projects in sidebar)
2. Go back to Messages
3. Click "Group Chats" tab
4. Click on a project to open group chat
5. All project collaborators can see and send messages

### 4. Features Available

**Messaging:**
- ✅ Real-time direct messaging between users
- ✅ Group messaging for projects
- ✅ Message history
- ✅ Online/offline status
- ✅ Search conversations
- ✅ Auto-scroll to latest messages
- ✅ Collaborator avatars in group chats

**Authentication:**
- ✅ User registration
- ✅ User login
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Persistent sessions

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users (requires auth)
- `GET /api/users/:id` - Get user by ID (requires auth)

### Direct Messages
- `GET /api/direct-messages/:userId1/:userId2` - Get conversation
- `POST /api/direct-messages` - Send direct message

### Project Messages
- `GET /api/messages/:projectId` - Get project messages
- `POST /api/messages` - Send project message

### Projects
- `GET /api/projects` - Get all projects (requires auth)
- `POST /api/projects` - Create project (requires auth)

## Testing the Messaging System

### Test Scenario 1: Direct Messages
1. Register User A (e.g., alice@example.com)
2. Logout
3. Register User B (e.g., bob@example.com)
4. Go to Messages → Direct Messages
5. Click on Alice
6. Send a message: "Hi Alice!"
7. Logout and login as Alice
8. Go to Messages → Direct Messages
9. Click on Bob
10. You should see Bob's message
11. Reply: "Hi Bob!"

### Test Scenario 2: Group Chat
1. Login as User A
2. Create a project with collaborators
3. Go to Messages → Group Chats
4. Click on the project
5. Send a message
6. Login as another user (who is a collaborator)
7. Go to Messages → Group Chats
8. Click on the same project
9. You should see User A's message

## Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongod --version`
- Check if port 5000 is available
- Verify .env file exists with correct values

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check browser console for errors
- Verify .env file in FrontEnd folder
- Try hard refresh (Ctrl+Shift+R)

### Messages not appearing
- Check browser console for API errors
- Verify you're logged in (check localStorage for 'token')
- Verify MongoDB is running and connected
- Check backend console for errors

### Can't see other users
- Make sure you've registered multiple users
- Verify backend /api/users endpoint is working
- Check if token is valid in localStorage

## Current Limitations

1. **No WebSocket** - Messages poll every 3 seconds instead of real-time push
2. **No Read Receipts** - Can't see if messages were read
3. **No Typing Indicators** - Can't see when someone is typing
4. **No File Attachments** - Text messages only
5. **No Message Editing/Deletion** - Messages are permanent
6. **No Notifications** - No browser notifications for new messages

## Next Steps for Production

1. **Add WebSocket** - Use Socket.io for real-time messaging
2. **Add Message Features** - Read receipts, typing indicators, reactions
3. **Add File Upload** - Support images and file attachments
4. **Add Notifications** - Browser and email notifications
5. **Add Message Search** - Search through message history
6. **Add User Profiles** - Profile pictures, status messages
7. **Add Security** - Rate limiting, input sanitization
8. **Add Tests** - Unit and integration tests
9. **Deploy** - Deploy to production server

## Support

If you encounter issues:
1. Check the console logs (both browser and backend)
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Try restarting both servers
5. Clear browser cache and localStorage

Happy messaging! 🎉
