import { useEffect, useContext, createContext, useState } from "react";
import { auth, db, usersCollection } from "../firebase/configFirebase";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import Login from "../auth/Login";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false when authentication state is resolved
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Return loading state if still loading
  if (loading) {
    return null; // Replace with your loading component
  }

  return (
    <AuthContext.Provider value={{ logIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
