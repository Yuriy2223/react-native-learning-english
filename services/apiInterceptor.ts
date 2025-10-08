// services/apiInterceptor.ts
import { router } from "expo-router";
import { authUtils } from "../utils";
import { apiService } from "./api";

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export class ApiInterceptor {
  static async handleError(error: any): Promise<never> {
    // Якщо це помилка мережі
    if (!error.response) {
      throw new Error("Помилка з'єднання. Перевірте інтернет-з'єднання.");
    }

    const statusCode = error.response?.status || 500;
    const errorData: ApiError = error.response?.data || {
      message: "Невідома помилка",
      statusCode,
    };

    // Обробка різних статус кодів
    switch (statusCode) {
      case 401:
        // Неавторизований доступ - очищуємо токен і перенаправляємо на логін
        await this.handleUnauthorized();
        throw new Error(
          errorData.message || "Сесія закінчилася. Увійдіть знову."
        );

      case 403:
        throw new Error(errorData.message || "Доступ заборонено");

      case 404:
        throw new Error(errorData.message || "Ресурс не знайдено");

      case 422:
        // Помилка валідації
        throw new Error(this.formatValidationErrors(errorData));

      case 429:
        throw new Error("Занадто багато запитів. Спробуйте пізніше.");

      case 500:
      case 502:
      case 503:
      case 504:
        throw new Error("Помилка сервера. Спробуйте пізніше.");

      default:
        throw new Error(
          errorData.message || "Виникла помилка. Спробуйте ще раз."
        );
    }
  }

  private static async handleUnauthorized() {
    // Очищаємо дані авторизації
    await authUtils.removeAuthToken();
    await authUtils.removeUserData();
    apiService.clearAuthToken();

    // Перенаправляємо на сторінку логіну
    // Використовуємо setTimeout щоб уникнути проблем з навігацією під час обробки помилки
    setTimeout(() => {
      router.replace("/(auth)/login");
    }, 100);
  }

  private static formatValidationErrors(errorData: ApiError): string {
    // Якщо бекенд повертає масив помилок валідації
    if (Array.isArray((errorData as any).errors)) {
      return (errorData as any).errors
        .map((err: any) => err.message)
        .join(". ");
    }

    return errorData.message || "Помилка валідації даних";
  }

  static isNetworkError(error: any): boolean {
    return (
      error.message === "Network request failed" ||
      error.message === "Network Error" ||
      !error.response
    );
  }

  static getErrorMessage(error: any): string {
    if (this.isNetworkError(error)) {
      return "Помилка з'єднання. Перевірте інтернет-з'єднання.";
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    return error.message || "Виникла невідома помилка";
  }
}

// Допоміжна функція для безпечного виконання API запитів
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  errorMessage?: string
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.error("API Error:", error);

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    throw new Error(ApiInterceptor.getErrorMessage(error));
  }
}
