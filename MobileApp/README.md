# Task Manager Mobile App

A React Native mobile application for task management, built with Expo and TypeScript.

## Features

- 🔐 User Authentication (Login, Signup, Password Reset)
- 📊 Dashboard with urgent tasks and project overview
- 📁 Projects Management
- 💬 Messaging System
- 📅 Calendar View
- ⚙️ User Settings
- 🔔 Real-time Notifications

## Tech Stack

- **React Native** with **Expo SDK**
- **TypeScript** for type safety
- **React Navigation** (Stack & Bottom Tabs)
- **Expo Secure Store** for secure token storage
- **Axios** for API requests
- **React Native Paper** for UI components

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (for Android emulator)
- Expo Go app on your physical device (optional)

## Backend Setup

Make sure the backend server is running:

```bash
cd ../Backend
npm install
npm start
```

The backend should be running on `http://localhost:5000`

**Important:** If testing on a physical device, update the API_URL in `src/constants/api.ts` to use your computer's local IP address instead of `localhost`.

## Installation

1. Navigate to the MobileApp directory:
```bash
cd MobileApp
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL (if needed):
   - Open `src/constants/api.ts`
   - Change `API_URL` to your backend server address
   - For physical device: `http://YOUR_IP:5000/api`

## Running the App

### Start the Expo development server:
```bash
npm start
```

### Run on specific platforms:

**iOS Simulator (Mac only):**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Web Browser:**
```bash
npm run web
```

**Physical Device:**
1. Install Expo Go from App Store or Google Play
2. Scan the QR code shown in the terminal
3. Make sure your device is on the same network as your computer

## Project Structure

```
MobileApp/
├── src/
│   ├── screens/          # App screens
│   │   ├── auth/         # Authentication screens
│   │   ├── dashboard/    # Dashboard screen
│   │   ├── projects/     # Projects screens
│   │   ├── messages/     # Messaging screens
│   │   ├── calendar/     # Calendar screen
│   │   └── settings/     # Settings screen
│   ├── components/       # Reusable components
│   ├── contexts/         # React Context (Auth, etc.)
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API service layer
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper functions
│   └── constants/       # App constants & theme
├── App.tsx              # Root component
└── package.json
```

## Color Theme

The app uses a green color palette consistent with the web version:

- Primary: `#235347`
- Primary Light: `#2D5A3D`
- Primary Dark: `#163832`
- Background: `#DAF1DE`

## API Endpoints

All API endpoints are defined in `src/constants/api.ts`:

- Authentication: `/users/login`, `/users/signup`, `/users/forgot-password`
- Tasks: `/tasks`, `/tasks/urgent`
- Projects: `/projects`
- Messages: `/messages`, `/direct-messages`
- Notifications: `/notifications`
- Comments: `/comments`
- Activity: `/activity`

## Authentication Flow

1. User opens app → AuthContext checks for stored token
2. If token exists → Fetch user profile → Navigate to Dashboard
3. If no token → Show Login screen
4. After login/signup → Store token in SecureStore → Navigate to Dashboard
5. Logout → Clear token from SecureStore → Navigate to Login

## Development Notes

- The app uses JWT authentication with Bearer tokens
- Tokens are securely stored using Expo SecureStore
- API service automatically adds Authorization header to all requests
- 401 responses trigger automatic token cleanup

## Building for Production

### iOS (requires Mac):
```bash
expo build:ios
```

### Android:
```bash
expo build:android
```

For detailed build instructions, see [Expo's documentation](https://docs.expo.dev/distribution/building-standalone-apps/).

## Troubleshooting

**Can't connect to backend:**
- Ensure backend is running on port 5000
- Check API_URL in `src/constants/api.ts`
- For physical devices, use your computer's IP address, not localhost

**Module not found errors:**
- Run `npm install` again
- Clear cache: `expo start -c`

**Build errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Future Enhancements

- [ ] Kanban board for project tasks
- [ ] Drag-and-drop task management
- [ ] Real-time messaging with Socket.io
- [ ] Push notifications
- [ ] Offline mode with AsyncStorage
- [ ] Image upload for tasks and profiles
- [ ] Task filtering and search
- [ ] Calendar integration

## License

MIT

## Support

For issues or questions, please create an issue in the GitHub repository.
