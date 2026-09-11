Plan for Exploring Authentication Flow:

1. **Analyze Auth Middleware**: Examine `server/middleware/auth.ts` to understand how requests are authenticated and how the user identity is extracted.
2. **Analyze Auth Routes**: Examine `server/modules/auth/auth.routes.ts` to identify the entry points for login, registration, and potentially password resets or token refreshes.
3. **Analyze Auth Service**: Examine `server/modules/auth/auth.service.ts` to understand the implementation of user verification, password hashing, and JWT issuance.
4. **Identify Session Management**: Determine if tokens are stored in cookies, LocalStorage (via frontend), or passed in headers, and how they are validated.
5. **Summarize Auth Flow**: Combine these findings into a clear description of the end-to-end authentication process.
