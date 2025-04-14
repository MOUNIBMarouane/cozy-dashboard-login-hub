
import { toast } from "@/components/ui/sonner";

// Types for user authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

// Mock authenticated user state
let currentUser: User | null = null;

// Simple localStorage persistence
const STORAGE_KEY = "dashboard_auth_user";

// Initialize auth state from localStorage if available
export const initAuth = (): void => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Failed to initialize auth:", error);
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Get the current user
export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return currentUser !== null;
};

// Mock login function
export const login = async (
  email: string,
  password: string
): Promise<User> => {
  // This is where you would normally make an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simple validation (in a real app, this would be server-side)
      if (email && password.length >= 6) {
        const user: User = {
          id: "1",
          email,
          name: email.split("@")[0],
          role: "admin",
        };
        
        // Store user in local state and localStorage
        currentUser = user;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        
        toast.success("Successfully logged in");
        resolve(user);
      } else {
        toast.error("Invalid credentials");
        reject(new Error("Invalid credentials"));
      }
    }, 800); // Simulate network delay
  });
};

// Mock signup function
export const signup = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  // This is where you would normally make an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simple validation (in a real app, this would be server-side)
      if (email && password.length >= 6 && name) {
        const user: User = {
          id: "1",
          email,
          name,
          role: "user",
        };
        
        // Store user in local state and localStorage
        currentUser = user;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        
        toast.success("Account created successfully");
        resolve(user);
      } else {
        toast.error("Invalid signup information");
        reject(new Error("Invalid signup information"));
      }
    }, 800); // Simulate network delay
  });
};

// Logout function
export const logout = (): void => {
  currentUser = null;
  localStorage.removeItem(STORAGE_KEY);
  toast.success("Successfully logged out");
};
