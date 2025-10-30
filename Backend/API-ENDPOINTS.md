# Backend API Endpoints

## Direct Messages
- `GET /api/direct-messages/:userId1/:userId2` — Get all direct messages between two users
- `POST /api/direct-messages/` — Send a direct message
  - Body: `{ sender, recipient, content }`

## Project Messages
- `GET /api/messages/:projectId` — Get all messages for a project
- `POST /api/messages/` — Send a message to a project
  - Body: `{ sender, project, content }`

---

## Integration Steps
1. Ensure MongoDB is running and `.env` is set up with `MONGO_URI`.
2. Start the backend server:
   ```sh
   node index.js
   ```
3. Use the above endpoints from your frontend for messaging features.

---

You now have full integration for direct and project-based messaging in your backend!