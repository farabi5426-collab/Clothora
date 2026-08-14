import { create } from 'zustand';
import { User as FirebaseUser, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Admin emails (should match firestore.rules)
const ADMIN_EMAILS = ['myadminemail@gmail.com', 'farabi5426@gmail.com'];

interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'customer';
}

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  loginWithGoogle: async () => {
    set({ loading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      // Derive default role based on email
      let role: 'admin' | 'customer' = 'customer';
      const isAdminEmail = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase());
      
      if (isAdminEmail) {
        role = 'admin';
      }

      try {
        // Check if user exists in Firestore
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Create new user record
          await setDoc(userRef, {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            role,
            createdAt: new Date()
          });
        } else {
          const dbRole = userSnap.data().role;
          if (isAdminEmail && dbRole !== 'admin') {
            await setDoc(userRef, { role: 'admin' }, { merge: true });
            role = 'admin';
          } else if (!isAdminEmail) {
            role = dbRole || 'customer';
          }
        }
      } catch (firestoreError) {
        console.warn('Firestore offline or failed to fetch user data, using default role:', firestoreError);
      }

      set({
        user: {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'User',
          role
        },
        loading: false
      });
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Error logging in:', error);
      }
      set({ loading: false });
      throw error;
    }
  },

  loginWithEmail: async (email, password) => {
    set({ loading: true });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = result.user;
      
      let role: 'admin' | 'customer' = 'customer';
      const isAdminEmail = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase());
      if (isAdminEmail) role = 'admin';

      try {
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || email.split('@')[0],
            role,
            createdAt: new Date()
          });
        } else {
          const dbRole = userSnap.data().role;
          if (isAdminEmail && dbRole !== 'admin') {
            await setDoc(userRef, { role: 'admin' }, { merge: true });
            role = 'admin';
          } else if (!isAdminEmail) {
            role = dbRole || 'customer';
          }
        }
      } catch (firestoreError) {
        console.warn('Firestore error, using default role:', firestoreError);
      }

      set({
        user: {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || email.split('@')[0],
          role
        },
        loading: false
      });
    } catch (error: any) {
      console.error('Error logging in with email:', error);
      set({ loading: false });
      throw error;
    }
  },

  signupWithEmail: async (email, password, displayName) => {
    set({ loading: true });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = result.user;
      
      let role: 'admin' | 'customer' = 'customer';
      const isAdminEmail = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase());
      if (isAdminEmail) role = 'admin';

      const finalDisplayName = displayName || email.split('@')[0];

      try {
        const userRef = doc(db, 'users', fbUser.uid);
        await setDoc(userRef, {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: finalDisplayName,
          role,
          createdAt: new Date()
        });
      } catch (firestoreError) {
        console.warn('Firestore error:', firestoreError);
      }

      set({
        user: {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: finalDisplayName,
          role
        },
        loading: false
      });
    } catch (error: any) {
      console.error('Error signing up with email:', error);
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  checkAuth: () => {
    auth.onAuthStateChanged(async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        let role: 'admin' | 'customer' = 'customer';
        const isAdminEmail = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase());
        
        if (isAdminEmail) {
          role = 'admin';
        }
        
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const dbRole = userSnap.data().role;
            if (isAdminEmail && dbRole !== 'admin') {
              // Upgrade user to admin in DB if they are in ADMIN_EMAILS
              await setDoc(userRef, { role: 'admin' }, { merge: true });
              role = 'admin';
            } else if (!isAdminEmail) {
              role = dbRole || 'customer';
            }
          }
        } catch (firestoreError) {
          console.warn('Firestore offline or failed to fetch user data, using default role:', firestoreError);
        }
        
        set({
          user: {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'User',
            role
          },
          loading: false
        });
      } else {
        set({ user: null, loading: false });
      }
    });
  }
}));
