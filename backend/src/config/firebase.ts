import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (we need service account credentials here in a real app)
// For demonstration and to allow the server to start, we mock it or expect env variables.

try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(), // This requires GOOGLE_APPLICATION_CREDENTIALS env var
        });
    }
} catch (error) {
    console.log('Firebase admin initialization skipped or failed:', error);
}

export default admin;
