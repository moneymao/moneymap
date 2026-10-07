import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js";

/**
 * Sync Firebase authenticated user with MongoDB.
 * POST /api/auth/sync
 */
export const syncUser = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Firebase ID token is required",
      });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (verifyError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Firebase token",
      });
    }

    const { uid, email, name, picture, firebase, email_verified } = decodedToken;
    const provider = firebase?.sign_in_provider || "password";
    const normalizedEmail = email ? email.toLowerCase().trim() : null;

    let user = await User.findOne({
      $or: [
        { firebaseUid: uid },
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
      ],
    });
    const displayName = name || (normalizedEmail ? normalizedEmail.split("@")[0] : "MoneyMap User");

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: displayName,
        email: normalizedEmail || "",
        photoURL: picture || "",
        provider,
      });
    } else {
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

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        provider: user.provider,
        emailVerified: Boolean(email_verified),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile.
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      firebaseUid: req.user.firebaseUid,
      name: req.user.name,
      email: req.user.email,
      photoURL: req.user.photoURL,
      provider: req.user.provider,
      emailVerified: Boolean(req.firebaseUser?.email_verified),
    },
  });
};

/**
 * Logout user.
 * POST /api/auth/logout
 */
export const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};