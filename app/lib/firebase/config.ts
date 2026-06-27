const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDxPzbaTyjK_B3ixH1wUUXPgMQj6UOCJso",
  authDomain: "apnizaroorat-c5d91.firebaseapp.com",
  projectId: "apnizaroorat-c5d91",
  storageBucket: "apnizaroorat-c5d91.firebasestorage.app",
  messagingSenderId: "853219549386",
  appId: "1:853219549386:web:a4b53ce885d6303d059433",
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

export function isFirebaseWebConfigured(): boolean {
  return Boolean(firebaseWebConfig.appId.trim());
}
