# Task Manager - Backend Integration Complete

## Summary

I've successfully created a complete backend structure with MongoDB models for Projects, Tasks, and Notifications, and integrated them with your React frontend.

## What Was Created

### Backend Structure (`backend/` folder)

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js          ✅ (existing - enhanced)
│   │   ├── Project.js       ✅ NEW
│   │   ├── Task.js          ✅ NEW
│   │   └── Notification.js  ✅ NEW
│   ├── controllers/
│   │   ├── userController.js       ✅ (existing)
│   │   ├── projectController.js    ✅ NEW
│   │   ├── taskController.js       ✅ NEW
│   │   └── notificationController.js ✅ NEW
│   ├── routes/
│   │   ├── userRoutes.js          ✅ (existing)
│   │   ├── projectRoutes.js       ✅ NEW
│   │   ├── taskRoutes.js          ✅ NEW
│   │   └── notificationRoutes.js  ✅ NEW
│   ├── middleware/
│   │   └── auth.js        ✅ (existing - JWT authentication)
│   └── server.js          ✅ UPDATED (added CORS and new routes)
├── package.json           ✅ UPDATED (added cors dependency)
├── .env                   ✅ (existing - configure MongoDB URI)
└── README.md              ✅ NEW (complete API documentation)
```

### Frontend Updates (`taskmanager-main/` folder)

```
taskmanager-main/
├── src/
│   ├── services/
│   │   └── api.js                    ✅ NEW (API service layer)
│   ├── pages/
│   │   ├── ProjectsPage.js           ✅ UPDATED (uses backend API)
│   │   └── NotificationsPage.js      ✅ UPDATED (full UI + backend integration)
│   └── components/
│       └── TaskBoard.js              ✅ UPDATED (CRUD operations via API)
└── .env                              ✅ NEW (API URL configuration)
```

## Data Models

### Project Model
```javascript
{
  name: String (required),
  status: 'Planning' | 'In Progress' | 'Completed',
  dueDate: String,
  collaborators: [String],  // e.g., ['JD', 'SM']
  color: String,            // hex color
  totalTasks: Number,
  completedTasks: Number,
  userId: ObjectId (ref: User)
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String,
  status: 'todo' | 'in-progress' | 'completed',
  assignedTo: [String],     // e.g., ['JD', 'SM']
  projectId: ObjectId (ref: Project),
  userId: ObjectId (ref: User)
}
```

### Notification Model
```javascript
{
  title: String (required),
  message: String (required),
  type: 'task' | 'project' | 'user' | 'system',
  isRead: Boolean,
  userId: ObjectId (ref: User),
  relatedId: ObjectId (optional),
  relatedModel: String (optional)
}
```

## API Endpoints

### Projects (Protected)
- `GET /api/projects` - Get all user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project and all its tasks

### Tasks (Protected)
- `GET /api/tasks/project/:projectId` - Get all tasks for a project
- `GET /api/tasks/project/:projectId/stats` - Get task statistics
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task (status, title, description, assignedTo)
- `DELETE /api/tasks/:id` - Delete task

### Notifications (Protected)
- `GET /api/notifications` - Get all notifications (query: `?isRead=false` for unread)
- `GET /api/notifications/unread-count` - Get unread count
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables** (`.env`)
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_super_secret_key_here
   ```

3. **Start MongoDB**
   - Local: Run `mongod` in a terminal
   - Or use MongoDB Atlas (cloud database)

4. **Start Backend Server**
   ```bash
   npm run dev     # Development mode with auto-reload
   # or
   npm start       # Production mode
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Verify `.env` File** (`taskmanager-main/.env`)
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

2. **Install Dependencies** (if not already done)
   ```bash
   cd taskmanager-main
   npm install
   ```

3. **Start Frontend**
   ```bash
   npm start
   ```

   App will run on `http://localhost:3000`

## Authentication Required

To use the app, you need to:

1. **Register a user:**
   ```bash
   POST http://localhost:5000/api/users/register
   Content-Type: application/json

   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login to get token:**
   ```bash
   POST http://localhost:5000/api/users/login
   Content-Type: application/json

   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Store the token** in `localStorage`:
   ```javascript
   localStorage.setItem('token', '<your-token-here>');
   ```

## Features Implemented

### ✅ Backend Features
- Full CRUD operations for Projects, Tasks, and Notifications
- JWT authentication with protected routes
- Automatic project task count updates
- User ownership validation (users can only access their own data)
- CORS enabled for frontend communication
- RESTful API design

### ✅ Frontend Features
- Project listing with backend integration
- Task board with drag-and-drop (persists to backend)
- Create/Edit/Delete tasks via API
- Notification center with read/unread filtering
- Optimistic UI updates with error handling
- Loading states and error messages

## How Data Flows

1. **User logs in** → Gets JWT token → Stored in localStorage
2. **User creates project** → POST to `/api/projects` → Saved in MongoDB
3. **User opens project** → GET tasks from `/api/tasks/project/:id`
4. **User drags task** → PUT to `/api/tasks/:id` with new status
5. **Task status changes** → Backend auto-updates project counts
6. **User sees notifications** → GET from `/api/notifications`

## Important Notes

### Authentication
- All API routes (except register/login) require JWT token
- Token must be in `Authorization: Bearer <token>` header
- Frontend `api.js` automatically adds token from localStorage

### Data Consistency
- When tasks are created/updated/deleted, project counts auto-update
- When project is deleted, all its tasks are also deleted
- Each user only sees their own projects/tasks/notifications

### Error Handling
- Frontend shows alerts on API errors
- Optimistic updates revert on failure
- Missing token shows "Please ensure you are logged in"

## Testing the Integration

### Using Browser DevTools
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Add a token manually: `localStorage.setItem('token', 'your-token')`
4. Refresh the page

### Using Postman/Thunder Client
1. Create a user via register endpoint
2. Login to get token
3. Test each endpoint with token in headers
4. Verify data in MongoDB Compass

### Quick Test Script
Create `backend/test-api.http` for VS Code REST Client:
```http
### Register
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@test.com",
  "password": "test123"
}

### Login
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "test123"
}

### Create Project
POST http://localhost:5000/api/projects
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Test Project",
  "status": "In Progress",
  "dueDate": "Dec 31, 2025",
  "collaborators": ["TU", "JD"],
  "color": "#FFE5E5"
}
```

## Next Steps (Optional Enhancements)

1. **Add Login/Register UI** in frontend (currently uses localStorage)
2. **Add real-time updates** with Socket.io
3. **Add file uploads** for task attachments
4. **Add email notifications** for task assignments
5. **Add task comments** and activity log
6. **Add team management** for shared projects
7. **Add task priorities** and due dates
8. **Add search and filtering** for projects/tasks

## Troubleshooting

### "Failed to load projects" Error
- Check backend is running (`npm run dev` in backend folder)
- Check MongoDB is running
- Verify `.env` has correct `MONGO_URI`
- Check browser console for CORS errors

### "Please ensure you are logged in" Error
- Register and login via API first
- Store token in localStorage: `localStorage.setItem('token', 'your-token')`
- Check token hasn't expired (tokens expire after 7 days)

### Tasks not showing
- Verify project ID is correct (MongoDB ObjectId)
- Check backend console for errors
- Verify task `projectId` matches project `_id`

### CORS Errors
- Verify `cors` package is installed in backend
- Check `app.use(cors())` is in `server.js`
- Restart backend server after changes

## Files Changed/Created

### Created (Backend)
- `backend/src/models/Project.js`
- `backend/src/models/Task.js`
- `backend/src/models/Notification.js`
- `backend/src/controllers/projectController.js`
- `backend/src/controllers/taskController.js`
- `backend/src/controllers/notificationController.js`
- `backend/src/routes/projectRoutes.js`
- `backend/src/routes/taskRoutes.js`
- `backend/src/routes/notificationRoutes.js`
- `backend/README.md`

### Created (Frontend)
- `taskmanager-main/src/services/api.js`
- `taskmanager-main/.env`

### Updated
- `backend/src/server.js` (added CORS and new routes)
- `backend/package.json` (added cors dependency)
- `taskmanager-main/src/pages/ProjectsPage.js` (backend integration)
- `taskmanager-main/src/pages/NotificationsPage.js` (backend integration + full UI)
- `taskmanager-main/src/components/TaskBoard.js` (backend integration)

## Success! 🎉

Your backend is now fully structured and integrated with the frontend. All that's left is to:
1. Run `npm install` in the backend folder
2. Start MongoDB
3. Start the backend server
4. Register a user and get a token
5. Start using the app!

The entire project now has a proper full-stack architecture with persistent data storage.
