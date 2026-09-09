import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocFromServer,
} from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  authInstance?: Auth | null
) {
  const currentUser = authInstance?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || false,
      isAnonymous: currentUser?.isAnonymous || false,
      tenantId: currentUser?.tenantId || null,
      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Canonical Firebase project ID for Savanna Bites
export const FIREBASE_PROJECT_ID = 'savanna-bites';

// Canonical Firebase Web Configuration
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBBM6HwNzBy7ZRIM_TrjK4yvDlZ1_djXvA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'savanna-bites.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'savanna-bites.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '83343260563',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:83343260563:web:6333a299072b722a418666',
};

// Retrieve configuration from env or local stored override with canonical fallback
export function getFirebaseConfig() {
  const storedConfig = typeof window !== 'undefined' ? localStorage.getItem('savanna_firebase_config') : null;
  if (storedConfig) {
    try {
      const parsed = JSON.parse(storedConfig);
      if (parsed.apiKey && parsed.projectId) {
        return {
          ...DEFAULT_FIREBASE_CONFIG,
          ...parsed,
          projectId: parsed.projectId || FIREBASE_PROJECT_ID,
        };
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
  };
}

export const firebaseConfig = getFirebaseConfig();
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let appInstance: FirebaseApp;
try {
  appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (err) {
  console.warn('Initializing Firebase fallback app:', err);
  appInstance = initializeApp(DEFAULT_FIREBASE_CONFIG, 'savanna-bites-app');
}

export const firebaseApp: FirebaseApp = appInstance;
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);

/**
 * Maps Firebase Auth error codes to user-friendly, descriptive messages
 */
export function formatFirebaseAuthError(err: unknown): string {
  const errorObj = err as { code?: string; message?: string };
  const code = errorObj?.code || '';
  const message = errorObj?.message || String(err);

  if (
    code === 'auth/invalid-credential' ||
    message.includes('auth/invalid-credential') ||
    message.includes('INVALID_LOGIN_CREDENTIALS')
  ) {
    return 'Invalid credentials provided. Please verify the email and password and try again.';
  }

  if (
    code === 'auth/user-not-found' ||
    message.includes('auth/user-not-found') ||
    message.includes('EMAIL_NOT_FOUND')
  ) {
    return 'Administrator account not found in Firebase Authentication for savanna-bites.';
  }

  if (
    code === 'auth/wrong-password' ||
    message.includes('auth/wrong-password') ||
    message.includes('INVALID_PASSWORD')
  ) {
    return 'Incorrect administrator password. Please try again or use Forgot Password.';
  }

  if (
    code === 'auth/configuration-not-found' ||
    message.includes('auth/configuration-not-found') ||
    message.includes('CONFIGURATION_NOT_FOUND')
  ) {
    return 'Firebase Authentication configuration not found for project "savanna-bites". Please ensure Email/Password provider is enabled in Firebase Console (Authentication > Sign-in method > Email/Password).';
  }

  if (
    code === 'auth/too-many-requests' ||
    message.includes('auth/too-many-requests') ||
    message.includes('TOO_MANY_ATTEMPTS_TRY_LATER')
  ) {
    return 'Access temporarily blocked due to too many failed login attempts. Please reset your password or try again later.';
  }

  if (code === 'auth/email-already-in-use' || message.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists in Firebase Authentication.';
  }

  if (code === 'auth/weak-password' || message.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }

  return message || 'Authentication failed. Please check your credentials and try again.';
}

/**
 * Test server connectivity to Firestore as recommended by skill
 */
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  if (!db) {
    return {
      success: false,
      message: 'Firebase is not initialized. Please configure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID.',
    };
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { success: true, message: 'Successfully connected to Firebase Firestore project "savanna-bites"!' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('the client is offline')) {
      return { success: false, message: 'Firestore client is offline or network is blocked.' };
    }
    // Permission denied is also a proof of connectivity to the server!
    return { success: true, message: 'Firebase reached (' + msg + ')' };
  }
}

/**
 * Send password reset email via Firebase Authentication
 */
export async function resetPassword(email: string): Promise<{ success: boolean; message: string }> {
  if (!auth) {
    return {
      success: false,
      message: 'Firebase Authentication is not initialized.',
    };
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: `Password reset link has been sent to ${email}. Please check your inbox or spam folder.`,
    };
  } catch (error) {
    const msg = formatFirebaseAuthError(error);
    return {
      success: false,
      message: msg,
    };
  }
}
