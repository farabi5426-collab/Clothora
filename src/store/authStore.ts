import { create } from 'zustand';
import { User as FirebaseUser, signInWithPopup, signOut } from 'firebase/auth';
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
      if (fbUser.email && ADMIN_EMAILS.includes(fbUser.email)) {
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
          role = userSnap.data().role || role;
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
        if (fbUser.email && ADMIN_EMAILS.includes(fbUser.email)) {
          role = 'admin';
        }
        
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            role = userSnap.data().role || role;
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
