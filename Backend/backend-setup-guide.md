# Backend Setup Guide (Node.js, Express.js, MongoDB)

This guide will help you set up a backend using Node.js, Express.js, and MongoDB in your `backend` folder.

---

## Recommended Directory Structure

```
backend/
  |-- controllers/
  |     |-- taskController.js
  |-- models/
  |     |-- Task.js
  |-- routes/
  |     |-- tasks.js
  |-- .env
  |-- index.js
  |-- package.json
  |-- README.md
```

---

## Step-by-Step Setup

### 1. Create the Backend Folder
```
mkdir backend
cd backend
```

### 2. Initialize Node.js Project
```
npm init -y
```

### 3. Install Dependencies
```
npm install express mongoose dotenv cors
```
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `dotenv`: Manage environment variables
- `cors`: Enable CORS for frontend-backend communication

### 4. Create Main Server File
- Create `index.js` and add:
```js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('API is running');
});

// Import routes
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 5. Set Up Environment Variables
- Create a `.env` file:
```
MONGO_URI=mongodb://localhost:27017/taskmanager
```
- For MongoDB Atlas, use your Atlas connection string.

### 6. Create Mongoose Model
- In `models/Task.js`:
```js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: 'todo' },
  dueDate: Date,
});

module.exports = mongoose.model('Task', TaskSchema);
```

### 7. Create Controller (Optional)
- In `controllers/taskController.js`:
```js
const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};
// Add more controller functions as needed
```

### 8. Create Routes
- In `routes/tasks.js`:
```js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add more routes as needed

module.exports = router;
```

### 9. Start the Server
```
node index.js
```
- Or use nodemon for development:
```
npm install --save-dev nodemon
npx nodemon index.js
```

---

You now have a basic backend setup with Node.js, Express.js, and MongoDB!
