import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import authService from "../../services/authService";

const initialState = {
  user: null,
  isAuthenticated: false,
  isEmailVerified: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const syncUserWithBackend = createAsyncThunk(
  "auth/syncUserWithBackend",
  async (_, thunkAPI) => {
    try {
      const data = await authService.syncUser();
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to sync user with backend"
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const data = await authService.getCurrentUser();
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Session expired"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      try {
        await authService.logout();
      } catch {
        // Ignore backend network errors on logout
      }
      await signOut(auth);
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to log out"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setFirebaseAuthState: (state, action) => {
      const { user, isAuthenticated, isEmailVerified } = action.payload;
      state.user = user;
      state.isAuthenticated = isAuthenticated;
      state.isEmailVerified = isEmailVerified;
      state.isInitialized = true;
      state.isLoading = false;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isEmailVerified = false;
      state.isInitialized = true;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncUserWithBackend.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(syncUserWithBackend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isEmailVerified = Boolean(action.payload.emailVerified);
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(syncUserWithBackend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isEmailVerified = Boolean(action.payload.emailVerified);
        state.isInitialized = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isEmailVerified = false;
        state.isInitialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isEmailVerified = false;
        state.isInitialized = true;
        state.error = null;
      });
  },
});

export const {
  clearAuthError,
  setAuthLoading,
  setAuthError,
  setFirebaseAuthState,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;