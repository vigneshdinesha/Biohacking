# Biohacking

## Auth setup

This app uses a custom Google OAuth flow with cookie-based sessions.

Create `.env.local` with:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
AUTH_SESSION_SECRET=your-long-random-secret
```

Then start the dev server and click “Continue with Google”.
