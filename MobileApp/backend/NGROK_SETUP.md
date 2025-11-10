# Using ngrok to Expose Your Backend

## Option 1: Use ngrok (Requires Free Account)

### Step 1: Sign up for ngrok
1. Go to https://ngrok.com/
2. Sign up for a free account
3. Get your authtoken from the dashboard

### Step 2: Setup ngrok
```bash
# Install ngrok globally
npm install -g ngrok

# Add your authtoken (replace YOUR_TOKEN with your actual token)
ngrok config add-authtoken YOUR_TOKEN
```

### Step 3: Start ngrok tunnel
```bash
ngrok http 5000
```

This will give you a public URL like: `https://abc123.ngrok.io`

### Step 4: Update API URL
Copy the ngrok URL and update `src/constants/api.ts`:
```typescript
export const API_URL = 'https://abc123.ngrok.io/api';
```

## Option 2: Use LocalTunnel (No Account Required)

### Step 1: Install localtunnel
```bash
npm install -g localtunnel
```

### Step 2: Start tunnel
```bash
lt --port 5000
```

This will give you a URL like: `https://sharp-cat-12.loca.lt`

### Step 3: Update API URL
Update `src/constants/api.ts` with the localtunnel URL:
```typescript
export const API_URL = 'https://sharp-cat-12.loca.lt/api';
```

## Option 3: Use Expo's Built-in Tunnel (Simplest)

Since you're already using `expo start --tunnel`, you can use the same network.

Just make sure your backend is accessible on your local network IP:
```typescript
export const API_URL = 'http://192.168.12.238:5000/api';
```

And add the Windows Firewall rule (run PowerShell as Admin):
```powershell
netsh advfirewall firewall add rule name="Node.js Server Port 5000" dir=in action=allow protocol=TCP localport=5000
```
