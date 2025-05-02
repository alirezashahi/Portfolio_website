import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { convex } from './lib/convex'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import './index.css'
import App from './App'

// Hardcode the Clerk key temporarily until environment variables are fixed
// You should replace this with proper environment variables once resolved
const clerkPubKey = 'pk_test_bWFzc2l2ZS1naG91bC00NC5jbGVyay5hY2NvdW50cy5kZXYk';

// This fallback is no longer needed since we hardcoded the key above
// const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
//                    import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>
)
