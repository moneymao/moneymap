export const getFirebaseErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred. Please try again.";

  const code = error.code || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
    case "auth/missing-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Pop-up was blocked by your browser. Please allow pop-ups for this site.";
    case "auth/requires-recent-login":
      return "Please log in again to continue.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    default:
      return error.message || "An authentication error occurred. Please try again.";
  }
};
