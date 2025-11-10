export interface User {
  _id: string;
  name: string;
  email: string;
  fullName?: string;
  role?: string;
  bio?: string;
  skills?: string[];
  profilePicture?: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  projectId?: Project;
  userId: string;
  assignedTo?: User[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  userId: string;
  members?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  senderId: User;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DirectMessage {
  _id: string;
  content: string;
  senderId: User;
  recipientId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'task' | 'message' | 'project' | 'comment';
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  userId: User;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
