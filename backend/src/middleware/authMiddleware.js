import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required",
      });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (verifyError) {
      console.error("Firebase ID token verification failed:", verifyError.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }

    const { uid, email, name, picture, firebase, email_verified } = decodedToken;
    const provider = firebase?.sign_in_provider || "password";

    // Check email verification for password users (Google users are automatically verified by Google/Firebase)
    let isEmailVerified = Boolean(email_verified);
    if (provider === "password" && !isEmailVerified) {
      try {
        const liveUser = await admin.auth().getUser(uid);
        if (liveUser && liveUser.emailVerified) {
          isEmailVerified = true;
        }
      } catch (err) {
        // Ignore fallback fetch error
      }
    }

    if (provider === "password" && !isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before continuing.",
        requiresVerification: true,
      });
    }

    const normalizedEmail = email ? email.toLowerCase().trim() : null;

    // Find or sync the user in MongoDB
    let user = await User.findOne({
      $or: [
        { firebaseUid: uid },
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
      ],
    });

    if (!user) {
      const fallbackName = name || (normalizedEmail ? normalizedEmail.split("@")[0] : "MoneyMap User");
      user = await User.create({
        firebaseUid: uid,
        name: fallbackName,
        email: normalizedEmail || "",
        photoURL: picture || "",
        provider,
      });
    } else {
      // Keep profile metadata synced if available
      let modified = false;
      if (!user.firebaseUid || user.firebaseUid !== uid) {
        user.firebaseUid = uid;
        modified = true;
      }
      if (name && user.name !== name) {
        user.name = name;
        modified = true;
      }
      if (picture && user.photoURL !== picture) {
        user.photoURL = picture;
        modified = true;
      }
      if (provider && user.provider !== provider) {
        user.provider = provider;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    }

    req.user = user;
    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default protect;