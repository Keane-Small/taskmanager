const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('API is running');
});

// Routes
const directMessagesRouter = require('./src/routes/directMessages');
const messagesRouter = require('./src/routes/messages');
const userRouter = require('./src/routes/userRoutes');
const projectRouter = require('./src/routes/projectRoutes');
const taskRouter = require('./src/routes/taskRoutes');

app.use('/api/direct-messages', directMessagesRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
