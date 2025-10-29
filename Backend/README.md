# Task Manager Backend

Express + MongoDB backend for the Task Manager application.

## Structure

```
backend/
├── src/
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Notification.js
│   ├── controllers/      # Business logic
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── notificationController.js
│   ├── routes/          # API endpoints
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── notificationRoutes.js
│   ├── middleware/      # Auth and other middleware
│   │   └── auth.js
│   └── server.js        # Main application
├── package.json
└── .env
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secret_key_here
```

3. Start MongoDB (if running locally):
```bash
# Windows with MongoDB installed
mongod

# Or use MongoDB Atlas cloud database
```

4. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login and get JWT token

### Projects (Protected)
- `GET /api/projects` - Get all projects for logged-in user
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project and all its tasks

### Tasks (Protected)
- `GET /api/tasks/project/:projectId` - Get all tasks for a project
- `GET /api/tasks/project/:projectId/stats` - Get task statistics
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Notifications (Protected)
- `GET /api/notifications` - Get all notifications (optional query: `?isRead=false`)
- `GET /api/notifications/unread-count` - Get unread count
- `POST /api/notifications` - Create notification
- `GET /api/notifications/:id` - Get notification by ID
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Get a token by registering or logging in.

## Models

### User
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)

### Project
- name (String, required)
- status (String: 'Planning' | 'In Progress' | 'Completed')
- dueDate (String)
- collaborators (Array of Strings - initials)
- color (String - hex color)
- totalTasks (Number)
- completedTasks (Number)
- userId (ObjectId, ref: User)

### Task
- title (String, required)
- description (String)
- status (String: 'todo' | 'in-progress' | 'completed')
- assignedTo (Array of Strings - initials)
- projectId (ObjectId, ref: Project)
- userId (ObjectId, ref: User)

### Notification
- title (String, required)
- message (String, required)
- type (String: 'task' | 'project' | 'user' | 'system')
- isRead (Boolean)
- userId (ObjectId, ref: User)
- relatedId (ObjectId - optional)
- relatedModel (String - optional)

## Development

The backend automatically updates project task counts when tasks are created, updated, or deleted.
