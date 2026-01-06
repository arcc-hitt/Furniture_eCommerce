// Authentication service functions
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../config/firebase';

// Login user with email and password
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

// Register new user with email, password, and additional data
export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: userData.name
    });

    // Save additional user data to Realtime Database
    const userRecord = {
      id: user.uid,
      email: user.email,
      name: userData.name,
      phone: userData.phone,
      addresses: {},
      createdAt: Date.now()
    };

    await set(ref(database, `users/${user.uid}`), userRecord);

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

// Logout current user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

// Get current authenticated user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get user data from database
export const getUserData = async (uid) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Listen for authentication state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Update user profile
export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, updates);
      return { success: true };
    }
    return { success: false, error: 'No authenticated user' };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: error.message };
  }
};

// Update user data in database
export const updateUserData = async (uid, updates) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    await set(userRef, { ...updates, updatedAt: Date.now() });
    return { success: true };
  } catch (error) {
    console.error('User data update error:', error);
    return { success: false, error: error.message };
  }
};