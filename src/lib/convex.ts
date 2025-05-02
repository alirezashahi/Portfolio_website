import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

// Create a Convex client
export const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string); 