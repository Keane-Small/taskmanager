# Quick Start Guide - Real-Time Messaging

## ✅ Setup Complete!

Your application is now connected to MongoDB Atlas and ready to use!

**Backend:** Running on http://localhost:5000
**Frontend:** Running on http://localhost:3000
**Database:** MongoDB Atlas (Sproutshere cluster)

## Test the Messaging System

### Step 1: Register First User
1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill in:
   - Name: `Alice Smith`
   - Email: `alice@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Sign Up"
5. You'll be automatically logged in and redirected to the app

### Step 2: Register Second User
1. Click the "Logout" button (top right)
2. Click "Sign Up" again
3. Fill in:
   - Name: `Bob Johnson`
   - Email: `bob@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Sign Up"

### Step 3: Send Messages
1. Click the Messages icon (💬) in the left sidebar
2. Click "Direct Messages" tab
3. You should see "Alice Smith" in the list
4. Click on Alice
5. Type a message: "Hi Alice! 👋"
6. Press Enter or click Send
7. Your message appears on the right side

### Step 4: Test from Other User
1. Logout
2. Login as Alice:
   - Email: `alice@test.com`
   - Password: `password123`
3. Go to Messages
4. Click on "Bob Johnson"
5. You should see Bob's message!
6. Reply: "Hi Bob! How are you?"

### Step 5: Create More Users
Repeat the registration process with different emails:
- `charlie@test.com`
- `diana@test.com`
- `emma@test.com`

Now you can test group conversations and multiple users chatting!

## Features Working Now

✅ **User Registration** - Create new accounts stored in MongoDB Atlas
✅ **User Login** - Authenticate with JWT tokens
✅ **Direct Messaging** - Send messages between any two users
✅ **Message History** - All messages saved in database
✅ **User List** - See all registered users
✅ **Real-time Updates** - Messages refresh every 3 seconds
✅ **Online Status** - See who's active
✅ **Search** - Search for users and conversations
✅ **Group Chats** - Message in project groups

## Database Structure

Your MongoDB Atlas database now contains:

**Collections:**
- `users` - All registered users
- `directmessages` - Direct messages between users
- `messages` - Project/group messages
- `projects` - Project data with collaborators

## API Endpoints Working

### Authentication
- `POST /api/users/register` - Create new user
- `POST /api/users/login` - Login and get JWT token

### Users
- `GET /api/users` - Get all users (requires token)
- `GET /api/users/:id` - Get specific user

### Messaging
- `GET /api/direct-messages/:userId1/:userId2` - Get conversation
- `POST /api/direct-messages` - Send message
- `GET /api/messages/:projectId` - Get project messages
- `POST /api/messages` - Send project message

## Troubleshooting

### Can't register?
- Check browser console (F12) for errors
- Verify backend is running (check terminal)
- Make sure MongoDB Atlas connection is active

### Can't see messages?
- Make sure you're logged in
- Check if token exists in localStorage (F12 → Application → Local Storage)
- Verify both users are registered
- Refresh the page

### Backend errors?
- Check the backend terminal for error messages
- Verify MongoDB Atlas credentials are correct
- Check if your IP is whitelisted in MongoDB Atlas

## MongoDB Atlas Dashboard

To view your data:
1. Go to https://cloud.mongodb.com
2. Login with your credentials
3. Click on your cluster "Sproutshere"
4. Click "Browse Collections"
5. Select "taskmanager" database
6. View your users and messages!

## Next Steps

1. **Test with multiple users** - Register 3-5 users and test messaging
2. **Create projects** - Go to Projects page and create some projects
3. **Test group chats** - Add collaborators to projects and test group messaging
4. **Customize** - Update user profiles, add avatars, etc.

## Need Help?

Check the backend terminal for any error messages. All API calls are logged there.

Happy messaging! 🚀
