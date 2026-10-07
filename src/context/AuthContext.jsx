import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  updateProfile,
  reload,
  onAuthStateChanged,
} from "firebase/auth";
import { useDispatch } from "react-redux";

import { auth, googleProvider } from "../config/firebase";
import authService from "../services/authService";
import {
  setFirebaseAuthState,
  resetAuthState,
} from "../store/slices/authSlice";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if Google user or email verified
          const isGoogleUser = firebaseUser.providerData.some(
            (p) => p.providerId === "google.com"
          );
          const isVerified = Boolean(firebaseUser.emailVerified || isGoogleUser);

          let backendUserData = null;
          // If verified or Google user, sync with backend
          if (isVerified) {
            try {
              await firebaseUser.getIdToken(true);
              const syncRes = await authService.syncUser();
              backendUserData = syncRes.user;
            } catch (syncErr) {
              console.warn("Backend user sync warning:", syncErr.message);
            }
          }

          const combinedUser = {
            id: backendUserData?.id || firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            name: firebaseUser.displayName || backendUserData?.name || "MoneyMap User",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "",
            provider: isGoogleUser ? "google" : "password",
            emailVerified: isVerified,
          };

          setCurrentUser(combinedUser);
          dispatch(
            setFirebaseAuthState({
              user: combinedUser,
              isAuthenticated: true,
              isEmailVerified: isVerified,
            })
          );
        } catch (error) {
          console.error("Auth state processing error:", error);
        }
      } else {
        setCurrentUser(null);
        dispatch(resetAuthState());
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  /**
   * Register with email and password, set display name, and send verification email.
   */
  const register = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Set displayName on Firebase User
    if (name) {
      await updateProfile(user, {
        displayName: name.trim(),
      });
    }

    // Send Firebase email verification
    await sendEmailVerification(user);

    return user;
  };

  /**
   * Sign in with email and password, and reload user to check verification status.
   */
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    await reload(userCredential.user);
    if (userCredential.user.emailVerified) {
      await userCredential.user.getIdToken(true);
    }

    return userCredential.user;
  };

  /**
   * Sign in using Firebase Google popup.
   */
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await user.getIdToken(true);

    // Immediately sync Google user with backend
    try {
      await authService.syncUser();
    } catch (err) {
      console.warn("Google login backend sync warning:", err.message);
    }

    return user;
  };

  /**
   * Send or resend verification email for the current Firebase user.
   */
  const resendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error("No authenticated user found. Please sign in first.");
    }

    await sendEmailVerification(auth.currentUser);
  };

  /**
   * Reload current Firebase user to verify updated emailVerified state.
   */
  const refreshUser = async () => {
    if (!auth.currentUser) return null;

    await reload(auth.currentUser);
    const updated = auth.currentUser;

    const isGoogleUser = updated.providerData.some(
      (p) => p.providerId === "google.com"
    );
    const isVerified = Boolean(updated.emailVerified || isGoogleUser);

    let backendUserData = null;
    if (isVerified) {
      try {
        await updated.getIdToken(true);
        const syncRes = await authService.syncUser();
        backendUserData = syncRes.user;
      } catch (err) {
        console.warn("User refresh sync warning:", err.message);
      }
    }

    const combinedUser = {
      id: backendUserData?.id || updated.uid,
      firebaseUid: updated.uid,
      name: updated.displayName || backendUserData?.name || "MoneyMap User",
      email: updated.email || "",
      photoURL: updated.photoURL || "",
      provider: isGoogleUser ? "google" : "password",
      emailVerified: isVerified,
    };

    setCurrentUser(combinedUser);
    dispatch(
      setFirebaseAuthState({
        user: combinedUser,
        isAuthenticated: true,
        isEmailVerified: isVerified,
      })
    );

    return updated;
  };

  /**
   * Sign out current Firebase user and clear sessions.
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    }

    await signOut(auth);
    setCurrentUser(null);
    dispatch(resetAuthState());
  };

  const isEmailVerified = Boolean(currentUser?.emailVerified);
  const isAuthenticated = Boolean(currentUser);

  const value = {
    user: currentUser,
    loading,
    isAuthenticated,
    isEmailVerified,
    login,
    register,
    logout,
    loginWithGoogle,
    resendVerificationEmail,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
