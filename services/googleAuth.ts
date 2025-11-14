import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { Platform } from "react-native";

class GoogleAuthService {
  constructor() {
    this.initialize();
  }

  private initialize() {
    const webClientId = Constants.expoConfig?.extra?.googleWebClientId;

    if (!webClientId) {
      console.warn("Google Web Client ID not found in app config");
      return;
    }

    GoogleSignin.configure({
      webClientId,
      offlineAccess: true,
      //// якщо надумаю вибирати
      forceCodeForRefreshToken: true,
    });
  }

  async signIn(): Promise<string> {
    try {
      await GoogleSignin.hasPlayServices();

      //// якщо надумаю вибирати
      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error("Не вдалося отримати ID token від Google");
      }

      return idToken;
    } catch (error: any) {
      if (error.code === "SIGN_IN_CANCELLED") {
        throw new Error("Авторизацію скасовано");
      } else if (error.code === "IN_PROGRESS") {
        throw new Error("Авторизація вже виконується");
      } else if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
        throw new Error("Google Play Services недоступні");
      }

      throw new Error(error.message || "Помилка авторизації через Google");
    }
  }

  async signOut() {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      throw error;
    }
  }

  isAvailable(): boolean {
    const isPlatformSupported =
      Platform.OS === "android" || Platform.OS === "ios";

    const hasWebClientId = !!Constants.expoConfig?.extra?.googleWebClientId;

    return isPlatformSupported && hasWebClientId;
  }

  async getCurrentUser() {
    try {
      return await GoogleSignin.getCurrentUser();
    } catch {
      return null;
    }
  }

  async checkSignedIn(): Promise<boolean> {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      return currentUser !== null;
    } catch {
      return false;
    }
  }

  async revokeAccess() {
    try {
      await GoogleSignin.revokeAccess();
    } catch (error) {
      throw error;
    }
  }
}

export const googleAuthService = new GoogleAuthService();
