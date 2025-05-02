# Portfolio Project with Clerk Authentication

This project is a personal portfolio website with blog functionality and secured admin access using Clerk authentication.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
VITE_CONVEX_URL=your_convex_deployment_url
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

### 2. Clerk Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your API keys from the Clerk dashboard
4. Configure your application:
   - Set up User & Authentication
   - Create an admin user
   - Configure webhooks to point to your Convex endpoint: `https://your-convex-url/clerk-webhook`

### 3. Admin Setup

To mark a user as an admin, you have two options:

1. **Using Email Domain**: Edit the `isAdmin` function in `convex/lib/auth.ts` to use your admin email domain.
2. **Using Metadata**: In the Clerk dashboard, add metadata to your user with the key `role` and value `admin`.

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Deployment

The project can be deployed to Vercel:

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel
```

Make sure to set up the same environment variables in your deployment environment.

## Security Considerations

- The admin blog page is protected both on the client side (with the ProtectedRoute component) and on the server side (with Convex functions checking for admin status).
- All mutations related to blog posts can only be performed by authenticated admin users.
- The webhook integration ensures Clerk user data stays in sync with your application.
