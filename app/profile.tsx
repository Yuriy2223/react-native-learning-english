import { Spinner } from "@/components/Spinner";
import { ProfileFormData } from "@/types/user.types";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProfileActions } from "../components/ProfileActions";
import { ProfileForm } from "../components/ProfileForm";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileStats } from "../components/ProfileStats";
import { SIZES } from "../constants";
import { showToast } from "../hooks/showToast";
import { useTheme } from "../hooks/useTheme";
import { selectUser } from "../redux/auth/selectors";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { updateProfile } from "../redux/user/operations";
import { selectUserProgress } from "../redux/user/selectors";
import { cameraService } from "../services/camera";
import { navigate } from "../utils";
import { profileSchema } from "../validation";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const progress = useAppSelector(selectUserProgress);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema) as Resolver<ProfileFormData>,
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset({
      name: user?.name || "",
      email: user?.email || "",
    });
  };

  const handleSaveProfile = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      await dispatch(
        updateProfile({
          name: data.name,
          email: data.email,
        })
      ).unwrap();

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChangeAvatar = () => {
    cameraService.showImagePickerAlert(
      // Камера
      async () => {
        const result = await cameraService.takePhoto();
        if (result.success && result.uri) {
          try {
            await dispatch(
              updateProfile({
                avatar: result.uri,
              })
            ).unwrap();
          } catch (error) {
            console.error("Error updating avatar:", error);
          }
        } else {
          showToast.error({
            message: result.error || "Не вдалося зробити фото",
          });
        }
      },
      // Галерея
      async () => {
        const result = await cameraService.pickFromGallery();
        if (result.success && result.uri) {
          try {
            await dispatch(
              updateProfile({
                avatar: result.uri,
              })
            ).unwrap();
          } catch (error) {
            console.error("Error updating avatar:", error);
          }
        } else {
          showToast.error({
            message: result.error || "Не вдалося обрати зображення",
          });
        }
      }
    );
  };

  const handleChangePassword = () => {
    Alert.alert("Змінити пароль", "Ви хочете змінити свій пароль?", [
      {
        text: "Скасувати",
        style: "cancel",
      },
      {
        text: "Змінити",
        onPress: () => {
          showToast.info({
            message: "Функція зміни пароля буде доступна в наступних версіях",
          });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Видалити акаунт",
      "Ви впевнені, що хочете видалити свій акаунт? Ця дія незворотна.",
      [
        {
          text: "Скасувати",
          style: "cancel",
        },
        {
          text: "Видалити",
          style: "destructive",
          onPress: () => {
            showToast.error({
              message:
                "Функція видалення акаунту буде доступна в наступних версіях",
            });
          },
        },
      ]
    );
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Профіль
        </Text>

        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelEdit}
          >
            <Ionicons name="close" size={24} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          user={user}
          isEditing={isEditing}
          onChangeAvatar={handleChangeAvatar}
        />

        {isEditing ? (
          <ProfileForm
            control={control}
            errors={errors}
            isDirty={isDirty}
            isLoading={isLoading}
            onSubmit={handleSubmit(handleSaveProfile)}
          />
        ) : (
          <>
            {progress && <ProfileStats progress={progress} />}

            <ProfileActions
              onChangePassword={handleChangePassword}
              onNavigateSettings={() => navigate("/settings")}
              onDeleteAccount={handleDeleteAccount}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  editButton: {
    padding: SIZES.spacing.sm,
  },
  cancelButton: {
    padding: SIZES.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
});
