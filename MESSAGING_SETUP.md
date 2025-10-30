# Messaging System Setup Guide

## Backend Setup

1. **Install Backend Dependencies**
   ```bash
   cd taskmanager-main/Backend
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the Backend folder:
   ```
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

4. **Start Backend Server**
   ```bash
   node index.js
   ```
   Server should run on http://localhost:5000

## Frontend Setup

1. **Configure API URL**
   Create a `.env` file in the FrontEnd folder:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

2. **Frontend is already running**
   The React app should already be running on http://localhost:3000

## Features Implemented

### Messaging System
- ✅ Real-time direct messaging between users
- ✅ User list with search functionality
- ✅ Message history with auto-scroll
- ✅ Online/offline status indicators
- ✅ Message timestamps
- ✅ Smooth animations and transitions
- ✅ Responsive design

### API Endpoints Used
- `GET /api/users` - Fetch all users
- `GET /api/direct-messages/:userId1/:userId2` - Get conversation
- `POST /api/direct-messages` - Send message

### Current Limitations
- Authentication is simplified (uses hardcoded user ID)
- Messages poll every 3 seconds (WebSocket would be better for production)
- No file attachments yet
- No message read receipts

## Next Steps

1. **Add Authentication**
   - Implement proper login/register flow
   - Store JWT token in localStorage
   - Use real user ID from auth context

2. **Enhance Real-time Features**
   - Implement WebSocket for instant message delivery
   - Add typing indicators
   - Add read receipts

3. **Additional Features**
   - File/image attachments
   - Message reactions
   - Group chats
   - Message search
   - Delete/edit messages

## Testing the Messaging System

1. Start both backend and frontend servers
2. Navigate to the Messages page (click the message icon in the sidebar)
3. Click on a user from the list
4. Type a message and press Enter or click Send
5. Messages will appear in the chat area

Note: For testing, you may need to create some users first using the registration endpoint or directly in MongoDB.
