// app/profile.tsx
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/Button";
import { TextInput } from "../components/TextInput";
import { SIZES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import { updateUser } from "../redux/auth/slice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { cameraService } from "../services/camera";
import { ProfileFormData } from "../types";
import { formatDate, formatStudyTime, navigate } from "../utils";
import { profileSchema } from "../validation";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { showSuccess, showError } = useToast();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { progress } = useAppSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    try {
      // Симуляція API запиту
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Оновити користувача в Redux
      dispatch(
        updateUser({
          name: data.name,
          email: data.email,
        })
      );

      setIsEditing(false);
      showSuccess({
        message: "Профіль успішно оновлено",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      showError({
        message: "Помилка оновлення профілю",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAvatar = () => {
    cameraService.showImagePickerAlert(
      // Камера
      async () => {
        const result = await cameraService.takePhoto();
        if (result.success && result.uri) {
          // Тут можна зберегти нове зображення
          showSuccess({
            message: "Аватар оновлено!",
          });

          // Оновити Redux state
          dispatch(
            updateUser({
              avatar: result.uri,
            })
          );
        } else {
          showError({
            message: result.error || "Не вдалося зробити фото",
          });
        }
      },
      // Галерея
      async () => {
        const result = await cameraService.pickFromGallery();
        if (result.success && result.uri) {
          // Тут можна зберегти нове зображення
          showSuccess({
            message: "Аватар оновлено!",
          });

          // Оновити Redux state
          dispatch(
            updateUser({
              avatar: result.uri,
            })
          );
        } else {
          showError({
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
          showSuccess({
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
            showError({
              message:
                "Функція видалення акаунту буде доступна в наступних версіях",
            });
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          styles.loading,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Завантаження профілю...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
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
        {/* Profile Header */}
        <View
          style={[styles.profileHeader, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleChangeAvatar}
            disabled={!isEditing}
          >
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.avatarText}>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </Text>
              </View>
            )}

            {isEditing && (
              <View
                style={[
                  styles.avatarOverlay,
                  { backgroundColor: "rgba(0,0,0,0.5)" },
                ]}
              >
                <Ionicons name="camera" size={24} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          <Text style={[styles.userName, { color: colors.text }]}>
            {user.name}
          </Text>

          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user.email}
          </Text>

          <Text style={[styles.joinDate, { color: colors.textSecondary }]}>
            Член з {formatDate(user.createdAt)}
          </Text>
        </View>

        {/* Profile Form */}
        {isEditing ? (
          <View
            style={[styles.formContainer, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.formTitle, { color: colors.text }]}>
              Редагування профілю
            </Text>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Ім'я"
                  placeholder="Введіть ваше ім'я"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  leftIcon={
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={colors.textSecondary}
                    />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  placeholder="Введіть ваш email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.textSecondary}
                    />
                  }
                />
              )}
            />

            <Button
              title="Зберегти зміни"
              onPress={handleSubmit(handleSaveProfile)}
              loading={isLoading}
              disabled={!isDirty}
              style={styles.saveButton}
            />
          </View>
        ) : (
          /* Profile Stats */
          progress && (
            <View
              style={[
                styles.statsContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.statsTitle, { color: colors.text }]}>
                Статистика навчання
              </Text>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Ionicons name="time" size={24} color={colors.primary} />
                  <Text style={[styles.statNumber, { color: colors.text }]}>
                    {formatStudyTime(user.totalStudyHours * 60)}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Час навчання
                  </Text>
                </View>

                <View style={styles.statCard}>
                  <Ionicons name="library" size={24} color={colors.success} />
                  <Text style={[styles.statNumber, { color: colors.text }]}>
                    {progress.knownWords}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Слова
                  </Text>
                </View>

                <View style={styles.statCard}>
                  <Ionicons
                    name="chatbubbles"
                    size={24}
                    color={colors.secondary}
                  />
                  <Text style={[styles.statNumber, { color: colors.text }]}>
                    {progress.knownPhrases}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Фрази
                  </Text>
                </View>

                <View style={styles.statCard}>
                  <Ionicons name="trophy" size={24} color={colors.warning} />
                  <Text style={[styles.statNumber, { color: colors.text }]}>
                    {progress.totalPoints}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Бали
                  </Text>
                </View>

                <View style={styles.statCard}>
                  <Ionicons name="flame" size={24} color={colors.error} />
                  <Text style={[styles.statNumber, { color: colors.text }]}>
                    {progress.streak}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Серія днів
                  </Text>
                </View>

                <View style={styles.statCard}>
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.success}
                  />
                  <Text style={[styles.statNumber, { color: colors.text }]}>
                    {progress.completedTopics}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Теми
                  </Text>
                </View>
              </View>
            </View>
          )
        )}

        {/* Account Actions */}
        {!isEditing && (
          <View
            style={[
              styles.actionsContainer,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={[styles.actionsTitle, { color: colors.text }]}>
              Налаштування акаунту
            </Text>

            <TouchableOpacity
              style={[
                styles.actionItem,
                { backgroundColor: colors.background },
              ]}
              onPress={handleChangePassword}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons name="key" size={20} color={colors.primary} />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>
                  Змінити пароль
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Оновіть свій пароль для безпеки
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionItem,
                { backgroundColor: colors.background },
              ]}
              // onPress={() => router.push("/settings")}
              onPress={() => navigate("/settings")}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: colors.secondary + "20" },
                ]}
              >
                <Ionicons name="settings" size={20} color={colors.secondary} />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>
                  Налаштування
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Мова, тема, сповіщення
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionItem,
                { backgroundColor: colors.background },
              ]}
              onPress={handleDeleteAccount}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: colors.error + "20" },
                ]}
              >
                <Ionicons name="trash" size={20} color={colors.error} />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.error }]}>
                  Видалити акаунт
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Безповоротно видалити ваш акаунт
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: SIZES.fontSize.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.md,
  },
  backButton: {
    padding: SIZES.spacing.sm,
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
  profileHeader: {
    alignItems: "center",
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
    borderRadius: SIZES.borderRadius.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: SIZES.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  avatarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: "bold",
    marginBottom: SIZES.spacing.xs,
  },
  userEmail: {
    fontSize: SIZES.fontSize.md,
    marginBottom: SIZES.spacing.xs,
  },
  joinDate: {
    fontSize: SIZES.fontSize.sm,
  },
  formContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  formTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.lg,
    textAlign: "center",
  },
  saveButton: {
    marginTop: SIZES.spacing.md,
  },
  statsContainer: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  statsTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.lg,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: SIZES.spacing.md,
  },
  statCard: {
    alignItems: "center",
    width: "30%",
  },
  statNumber: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "bold",
    marginTop: SIZES.spacing.xs,
    marginBottom: SIZES.spacing.xs,
  },
  statLabel: {
    fontSize: SIZES.fontSize.xs,
    textAlign: "center",
  },
  actionsContainer: {
    marginHorizontal: SIZES.spacing.lg,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
  },
  actionsTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    marginBottom: SIZES.spacing.md,
    textAlign: "center",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.spacing.sm,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: "500",
    marginBottom: SIZES.spacing.xs,
  },
  actionDescription: {
    fontSize: SIZES.fontSize.sm,
  },
});
