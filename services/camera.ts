import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

interface CameraResult {
  success: boolean;
  uri?: string;
  error?: string;
}

class CameraService {
  async requestPermissions(): Promise<boolean> {
    try {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

      const mediaLibraryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      return (
        cameraStatus.status === "granted" &&
        mediaLibraryStatus.status === "granted"
      );
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  }

  async takePhoto(): Promise<CameraResult> {
    try {
      const hasPermission = await this.requestPermissions();

      if (!hasPermission) {
        return {
          success: false,
          error: "Немає дозволу на використання камери",
        };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return {
          success: true,
          uri: result.assets[0].uri,
        };
      }

      return {
        success: false,
        error: "Фото не було зроблено",
      };
    } catch (error) {
      console.error("Camera error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Помилка камери",
      };
    }
  }

  async pickFromGallery(): Promise<CameraResult> {
    try {
      const hasPermission = await this.requestPermissions();

      if (!hasPermission) {
        return {
          success: false,
          error: "Немає дозволу на доступ до галереї",
        };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return {
          success: true,
          uri: result.assets[0].uri,
        };
      }

      return {
        success: false,
        error: "Зображення не було обрано",
      };
    } catch (error) {
      console.error("Gallery error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Помилка галереї",
      };
    }
  }

  showImagePickerAlert(
    onCamera: () => void,
    onGallery: () => void,
    onCancel?: () => void
  ): void {
    Alert.alert(
      "Змінити фото профілю",
      "Оберіть джерело зображення",
      [
        {
          text: "Скасувати",
          style: "cancel",
          onPress: onCancel,
        },
        {
          text: "Камера",
          onPress: onCamera,
        },
        {
          text: "Галерея",
          onPress: onGallery,
        },
      ],
      { cancelable: true }
    );
  }

  async getImageInfo(uri: string) {
    try {
      return { uri };
    } catch (error) {
      console.error("Get image info error:", error);
      return null;
    }
  }

  async isCameraAvailable(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      return status === "granted" || status === "undetermined";
    } catch (error) {
      console.error("Error checking camera availability:", error);
      return false;
    }
  }

  async isGalleryAvailable(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      return status === "granted" || status === "undetermined";
    } catch (error) {
      console.error("Error checking gallery availability:", error);
      return false;
    }
  }
}

export const cameraService = new CameraService();
