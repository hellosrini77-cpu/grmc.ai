import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    return signOut(auth);
  }

  async function checkSubscription(uid) {
    const ref = doc(db, 'subscriptions', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setSubscription(snap.data());
    } else {
      setSubscription(null);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await checkSubscription(user.uid);
      } else {
        setSubscription(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isSubscribed = subscription?.status === 'active';

  const value = {
    currentUser,
    subscription,
    isSubscribed,
    signup,
    login,
    logout,
    checkSubscription
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
