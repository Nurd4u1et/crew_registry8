import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "../firebase";

function requireAuth() {
  if (!isFirebaseConfigured || !auth) {
    const error = new Error("Add your Firebase web app values to .env.local, then restart the app.");
    error.code = "auth/configuration-not-found";
    throw error;
  }
  return auth;
}

export const subscribeToAuth = (onUser, onError) => {
  if (!auth) {
    onUser(null);
    return () => {};
  }
  return onAuthStateChanged(auth, onUser, onError);
};
export const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(requireAuth(), email, password);
export const signInWithEmail = (email, password) => signInWithEmailAndPassword(requireAuth(), email, password);
export const signInWithGoogle = () => signInWithPopup(requireAuth(), googleProvider);
export const signOutUser = () => signOut(requireAuth());

const MESSAGES = {
  "auth/configuration-not-found": "Firebase is not configured. Add the Firebase values to .env.local and restart the app.",
  "auth/invalid-credential": "Неверный email или пароль.",
  "auth/user-not-found": "Пользователь не найден.",
  "auth/wrong-password": "Неверный пароль.",
  "auth/email-already-in-use": "Этот email уже зарегистрирован.",
  "auth/weak-password": "Пароль слишком простой (минимум 6 символов).",
  "auth/invalid-email": "Некорректный email.",
  "auth/popup-closed-by-user": "Окно входа через Google было закрыто.",
  "auth/popup-blocked": "Браузер заблокировал всплывающее окно.",
  "auth/too-many-requests": "Слишком много попыток. Попробуйте позже.",
  "auth/network-request-failed": "Нет соединения с сетью.",
};

export function getAuthErrorMessage(error) {
  return MESSAGES[error?.code] ?? "Что-то пошло не так. Попробуйте ещё раз.";
}

