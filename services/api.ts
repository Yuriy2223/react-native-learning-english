import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

const createApiService = () => {
  const baseUrl = Constants.expoConfig?.extra?.baseUrl;

  if (!baseUrl) {
    throw new Error("Base URL is not configured in app.config.js");
  }

  let authToken: string | undefined;
  let refreshToken: string | undefined;
  let isRefreshing = false;
  let refreshPromise: Promise<string> | undefined;
  let tokenLoadPromise: Promise<void> | undefined;
  let authErrorTriggered = false;
  let onAuthError: (() => void) | undefined;

  const getStoredTokens = async (): Promise<Partial<TokenPair>> => {
    const [accessToken, refreshToken] = await AsyncStorage.multiGet([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
    return {
      accessToken: accessToken[1] ?? undefined,
      refreshToken: refreshToken[1] ?? undefined,
    };
  };

  const ensureTokensLoaded = async (): Promise<void> => {
    if (authToken && refreshToken) return;

    if (tokenLoadPromise) {
      await tokenLoadPromise;
      return;
    }

    tokenLoadPromise = (async () => {
      try {
        const tokens = await getStoredTokens();
        if (tokens.accessToken) authToken = tokens.accessToken;
        if (tokens.refreshToken) refreshToken = tokens.refreshToken;
      } catch (e) {
        console.error("Error loading tokens:", e);
      } finally {
        tokenLoadPromise = undefined;
      }
    })();

    await tokenLoadPromise;
  };

  const clearAuthData = async (): Promise<void> => {
    authToken = undefined;
    refreshToken = undefined;
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);
    } catch (e) {
      console.error("Failed to clear storage:", e);
    }
  };

  const triggerAuthErrorOnce = (): void => {
    if (authErrorTriggered) return;
    authErrorTriggered = true;
    onAuthError?.();
  };

  const refreshAccessToken = async (): Promise<string> => {
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;

    refreshPromise = (async () => {
      try {
        const token = refreshToken;
        if (!token) {
          throw new Error("No refresh token available");
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);

        try {
          const response = await fetch(`${baseUrl}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-platform": "mobile",
            },
            body: JSON.stringify({ refreshToken: token }),
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(
              `Token refresh failed with status ${response.status}`
            );
          }

          const data = await response.json();
          const newAccessToken: string | undefined = data?.accessToken;

          if (!newAccessToken) {
            throw new Error("No access token in refresh response");
          }

          const newRefreshToken: string = data?.refreshToken || token;

          authToken = newAccessToken;
          refreshToken = newRefreshToken;

          await AsyncStorage.multiSet([
            [STORAGE_KEYS.ACCESS_TOKEN, newAccessToken],
            [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken],
          ]);

          return newAccessToken;
        } finally {
          clearTimeout(timeout);
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        await clearAuthData();
        triggerAuthErrorOnce();
        throw err;
      } finally {
        isRefreshing = false;
        refreshPromise = undefined;
      }
    })();

    return refreshPromise;
  };

  const request = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    await ensureTokensLoaded();

    const currentToken = authToken;
    const url = `${baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-platform": "mobile",
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
      ...options.headers,
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401 && endpoint !== "/auth/refresh") {
      if (!refreshToken) {
        await clearAuthData();
        triggerAuthErrorOnce();
        throw new Error("Authentication required");
      }

      try {
        const newAccessToken = await refreshAccessToken();
        const retryHeaders: HeadersInit = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        response = await fetch(url, { ...options, headers: retryHeaders });

        if (response.status === 401) {
          if (authToken) {
            await clearAuthData();
            triggerAuthErrorOnce();
          }
          throw new Error("Authentication failed after token refresh");
        }
      } catch (refreshError) {
        throw refreshError;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.message || "Request failed",
        status: response.status,
      };
      throw error;
    }

    return (await response.json()) as T;
  };

  return {
    request,
    setAuthToken: (token: string) => {
      authToken = token;
    },
    setRefreshToken: (token: string) => {
      refreshToken = token;
    },
    setAuthErrorHandler: (handler: () => void) => {
      onAuthError = handler;
      authErrorTriggered = false;
    },
    logout: clearAuthData,
  };
};

export const apiService = createApiService();
