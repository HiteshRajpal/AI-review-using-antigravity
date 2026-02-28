import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Your web app's Firebase configuration
// For development without keys, these will just be dummy values that we catch errors for
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "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",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock_domain",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "myfirstproject-fb695" || "mock_project_id",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock_bucket",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "mock_sender",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "mock_app_id"
};

// const firebaseConfig = {
//     apiKey: "AIzaSyAjwVSDpbIOqvPFpQjdx7ecT4DUmDHi4Aw",
//     authDomain: "myfirstproject-fb695.firebaseapp.com",
//     databaseURL: "https://myfirstproject-fb695.firebaseio.com",
//     projectId: "myfirstproject-fb695",
//     storageBucket: "myfirstproject-fb695.firebasestorage.app",
//     messagingSenderId: "874304213022",
//     appId: "1:874304213022:web:4319b2f0494fc808eb1e0f"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
}
