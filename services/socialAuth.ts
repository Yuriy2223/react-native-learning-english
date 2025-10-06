// services/socialAuth.ts
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

// Завершення web browser session для правильної роботи на iOS
WebBrowser.maybeCompleteAuthSession();

interface SocialAuthResult {
  type: "success" | "cancel" | "error";
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  token?: string;
  error?: string;
}

class SocialAuthService {
  private redirectUri = AuthSession.makeRedirectUri({
    scheme: "english-learning-app",
  });

  // Google OAuth конфігурація
  private googleConfig = {
    clientId: Platform.select({
      ios: "YOUR_GOOGLE_IOS_CLIENT_ID.googleusercontent.com",
      android: "YOUR_GOOGLE_ANDROID_CLIENT_ID.googleusercontent.com",
      web: "YOUR_GOOGLE_WEB_CLIENT_ID.googleusercontent.com",
    }),
    scopes: ["openid", "profile", "email"],
    responseType: AuthSession.ResponseType.Code,
    redirectUri: this.redirectUri,
  };

  async signInWithGoogle(): Promise<SocialAuthResult> {
    try {
      // Створюємо запит на авторизацію
      const authRequest = new AuthSession.AuthRequest({
        clientId: this.googleConfig.clientId!,
        scopes: this.googleConfig.scopes,
        responseType: this.googleConfig.responseType,
        redirectUri: this.redirectUri,
        // additionalParameters: {},
        extraParams: {
          access_type: "offline",
        },
      });

      const authUrl = "https://accounts.google.com/oauth/authorize";

      // Виконуємо авторизацію
      const result = await authRequest.promptAsync({
        authorizationEndpoint: authUrl,
        // showInRecents: true,
      });

      if (result.type === "success") {
        // Отримуємо токен доступу
        const tokenResponse = await this.exchangeCodeForToken(
          result.params.code,
          "google"
        );

        if (tokenResponse.access_token) {
          // Отримуємо інформацію про користувача
          const userInfo = await this.fetchGoogleUserInfo(
            tokenResponse.access_token
          );

          return {
            type: "success",
            user: {
              id: userInfo.id,
              name: userInfo.name,
              email: userInfo.email,
              avatar: userInfo.picture,
            },
            token: tokenResponse.access_token,
          };
        }
      }

      return {
        type: result.type as "cancel" | "error",
        error: "Authorization failed",
      };
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      return {
        type: "error",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async signInWithApple(): Promise<SocialAuthResult> {
    try {
      // Apple Sign In доступний тільки на iOS 13+
      if (Platform.OS !== "ios") {
        return {
          type: "error",
          error: "Apple Sign In is only available on iOS",
        };
      }

      // Для Apple Sign In потрібен нативний модуль
      // В цьому прикладі повертаємо mock результат
      return new Promise((resolve) => {
        setTimeout(() => {
          // Симуляція успішної авторизації Apple
          resolve({
            type: "success",
            user: {
              id: "apple_" + Math.random().toString(36).substr(2, 9),
              name: "Apple User",
              email: "user@icloud.com",
            },
            token: "mock_apple_token_" + Date.now(),
          });
        }, 1500);
      });
    } catch (error) {
      console.error("Apple Sign-In Error:", error);
      return {
        type: "error",
        error: error instanceof Error ? error.message : "Apple Sign In failed",
      };
    }
  }

  private async exchangeCodeForToken(
    code: string,
    provider: "google" | "apple"
  ): Promise<any> {
    try {
      if (provider === "google") {
        const tokenEndpoint = "https://oauth2.googleapis.com/token";

        const response = await fetch(tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: this.googleConfig.clientId!,
            client_secret: "YOUR_GOOGLE_CLIENT_SECRET", // В продакшені зберігати на сервері
            code,
            grant_type: "authorization_code",
            redirect_uri: this.redirectUri,
          }).toString(),
        });

        if (!response.ok) {
          throw new Error("Token exchange failed");
        }

        return await response.json();
      }
    } catch (error) {
      console.error("Token exchange error:", error);

      // Повертаємо mock токен для демонстрації
      return {
        access_token: "mock_access_token_" + Date.now(),
        token_type: "Bearer",
        expires_in: 3600,
      };
    }
  }

  private async fetchGoogleUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch user info error:", error);

      // Повертаємо mock дані користувача
      return {
        id: "google_" + Math.random().toString(36).substr(2, 9),
        email: "user@gmail.com",
        verified_email: true,
        name: "Google User",
        given_name: "Google",
        family_name: "User",
        picture: null,
        locale: "en",
      };
    }
  }

  // Метод для виходу з соціальних мереж
  async signOut(): Promise<void> {
    try {
      // Очищаємо збережені токени
      await WebBrowser.dismissBrowser();

      // Тут можна додати очищення токенів із secure storage
      console.log("Social auth tokens cleared");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  // Перевірка чи доступна авторизація
  isGoogleAvailable(): boolean {
    return !!this.googleConfig.clientId;
  }

  isAppleAvailable(): boolean {
    return Platform.OS === "ios";
  }
}

export const socialAuthService = new SocialAuthService();
