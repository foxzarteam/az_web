const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCmtpVbQBuNyHvky2SGffS44QdsvEThSLQ",
  authDomain: "azapp-77130.firebaseapp.com",
  projectId: "azapp-77130",
  storageBucket: "azapp-77130.firebasestorage.app",
  messagingSenderId: "33994590102",
  appId: "1:33994590102:web:azweb",
};

function env(key: string, fallback: string): string {
  const v = process.env[key]?.trim();
  return v || fallback;
}

export const firebaseWebConfig = {
  apiKey: env("NEXT_PUBLIC_FIREBASE_API_KEY", DEFAULT_FIREBASE_CONFIG.apiKey),
  authDomain: env("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", DEFAULT_FIREBASE_CONFIG.authDomain),
  projectId: env("NEXT_PUBLIC_FIREBASE_PROJECT_ID", DEFAULT_FIREBASE_CONFIG.projectId),
  storageBucket: env(
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    DEFAULT_FIREBASE_CONFIG.storageBucket,
  ),
  messagingSenderId: env(
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  ),
  appId: env("NEXT_PUBLIC_FIREBASE_APP_ID", DEFAULT_FIREBASE_CONFIG.appId),
};
