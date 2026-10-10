import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './config.js';

/**
 * Sign in admin using email and password
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase Auth Login Error:', error);
    throw error;
  }
}

/**
 * Log out currently signed-in user
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase Auth Logout Error:', error);
    throw error;
  }
}

/**
 * Subscribe to authentication state changes
 */
export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Firebase Password Reset Error:', error);
    throw error;
  }
}

/**
 * Get current user synchronously if available
 */
export function getCurrentUser() {
  return auth.currentUser;
}
