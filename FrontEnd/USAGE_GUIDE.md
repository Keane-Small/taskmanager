# TaskFlow - Task Management Application

## 🎯 Overview
TaskFlow is a modern task management application inspired by Jira, featuring a beautiful landing page, user authentication, and task organization capabilities.

## 🚀 Features

### Landing Page
- Modern hero section with animated floating cards
- Feature showcase with 6 key capabilities
- Responsive design for all devices
- Professional blue, black, and white color scheme

### Authentication System
- **Sign Up**: Create new account with email and password
- **Login**: Secure authentication with session persistence
- **Logout**: Clear session and return to landing page
- **Protected Routes**: Automatic redirects based on auth status
- **LocalStorage Persistence**: Stay logged in across browser sessions

### Main Application
- Task management interface
- Vertical navigation bar
- User profile display
- Secure logout functionality

## 🛠️ Tech Stack
- React 19.2.0
- React Router DOM 7.x
- Styled Components
- Framer Motion (animations)
- React Icons

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🌐 Usage

### Running the Application
1. Start the development server: `npm start`
2. Open your browser to `http://localhost:3001`
3. You'll see the landing page

### User Flow

#### New Users
1. Click **"Get Started"** or **"Sign Up"** on the landing page
2. Fill in your details:
   - Full Name
   - Email Address
   - Password (min 6 characters)
   - Confirm Password
3. Click **"Create Account"**
4. You'll be automatically logged in and redirected to the main app

#### Returning Users
1. Click **"Log In"** on the landing page
2. Enter your email and password
3. Optionally check "Remember me"
4. Click **"Sign In"**
5. Access your task management dashboard

#### Logging Out
1. Click the **"Logout"** button in the top-right corner
2. You'll be returned to the landing page
3. Your session will be cleared

## 🎨 Design

### Color Scheme
- **Primary Blue**: `#1e40af`, `#3b82f6`
- **Black**: `#000000`, `#111827`
- **White**: `#ffffff`
- **Grays**: `#6b7280`, `#9ca3af`, `#e5e7eb`

### Pages
1. **Landing Page** (`/`) - Public homepage with features
2. **Login** (`/login`) - Authentication page
3. **Sign Up** (`/signup`) - Registration page
4. **Main App** (`/app`) - Protected task management interface

## 🔒 Security Features
- Client-side form validation
- Password confirmation on signup
- Email format validation
- Protected routes with automatic redirects
- Secure session management
- LocalStorage encryption ready

## 📱 Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Smooth animations across all devices

## 🧪 Testing Checklist

- [x] Landing page loads correctly
- [x] Navigation buttons work
- [x] Sign up form validates input
- [x] Login form authenticates users
- [x] Protected routes redirect properly
- [x] Logout clears session
- [x] LocalStorage persists user data
- [x] Animations render smoothly
- [x] Responsive on mobile/tablet/desktop

## 🔮 Future Enhancements
- Backend API integration
- Real task CRUD operations
- Team collaboration features
- Project boards (Kanban style)
- Sprint planning
- Analytics dashboard
- Email notifications
- Real-time updates

## 📄 License
MIT License - Feel free to use this project as you wish!

## 👨‍💻 Developer
Built with ❤️ using React and modern web technologies.

---

**Note**: This is currently a frontend-only application. For production use, integrate with a backend API for real authentication and data persistence.
