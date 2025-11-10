# Task Manager Mobile App - Expo React Native Setup

## Project Overview
Converting existing React web app to React Native mobile app using Expo.

## Technology Stack
- React Native with Expo SDK 50+
- TypeScript for type safety
- React Navigation v6 (Tab + Stack)
- React Native Paper for UI components
- Axios for API requests
- Expo SecureStore for token storage
- Expo Image Picker for profile photos
- Expo Notifications for push notifications
- AsyncStorage for offline data

## Project Structure
```
MobileApp/
├── src/
│   ├── screens/          # All app screens
│   │   ├── auth/         # Login, SignUp, ForgotPassword
│   │   ├── dashboard/    # Dashboard screen
│   │   ├── projects/     # Projects & Kanban
│   │   ├── messages/     # Messaging screens
│   │   ├── calendar/     # Calendar view
│   │   └── settings/     # User settings
│   ├── components/       # Reusable components
│   ├── contexts/         # React Context providers
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API service layer
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   └── constants/       # App constants
```

## Backend Integration
- Base URL: http://localhost:5000/api
- Existing endpoints remain unchanged
- JWT authentication with SecureStore

## Setup Progress
- [x] Create copilot-instructions.md
- [ ] Get project setup info
- [ ] Initialize Expo project
- [ ] Install dependencies
- [ ] Create folder structure
- [ ] Build authentication flow
- [ ] Set up navigation
- [ ] Create context providers
- [ ] Build main screens
- [ ] Test and document
