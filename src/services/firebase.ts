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

// Retrieve configuration from env or local stored override
export function getFirebaseConfig() {
  const storedConfig = typeof window !== 'undefined' ? localStorage.getItem('savanna_firebase_config') : null;
  if (storedConfig) {
    try {
      const parsed = JSON.parse(storedConfig);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }

  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };

  return envConfig;
}

const config = getFirebaseConfig();
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    appInstance = !getApps().length ? initializeApp(config) : getApp();
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }
}

export const firebaseApp = appInstance;
export const auth = authInstance;
export const db = dbInstance;

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
    return { success: true, message: 'Successfully connected to Firebase Firestore!' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('the client is offline')) {
      return { success: false, message: 'Firestore client is offline or network is blocked.' };
    }
    // Permission denied is also a proof of connectivity to the server!
    return { success: true, message: 'Server reached (' + msg + ')' };
  }
}

/**
 * Send password reset email via Firebase Authentication
 */
export async function resetPassword(email: string): Promise<{ success: boolean; message: string }> {
  if (!auth || !isFirebaseConfigured) {
    return {
      success: false,
      message: 'Firebase Authentication is not initialized. Please configure Firebase credentials in Settings.',
    };
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: `Password reset link has been sent to ${email}. Please check your inbox or spam folder.`,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: msg.includes('user-not-found')
        ? 'No user account found with this email address.'
        : `Password reset error: ${msg}`,
    };
  }
}
