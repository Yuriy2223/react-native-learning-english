import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup
    .string()
    .required("Поле обов'язкове")
    .min(2, "Ім'я має бути не менше 2 символів"),
  email: yup
    .string()
    .required("Поле обов'язкове")
    .email("Неправильний формат email"),
  password: yup
    .string()
    .required("Поле обов'язкове")
    .min(6, "Пароль має бути не менше 6 символів"),
  confirmPassword: yup
    .string()
    .required("Поле обов'язкове")
    .oneOf([yup.ref("password")], "Паролі не співпадають"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Поле обов'язкове")
    .email("Неправильний формат email"),
  password: yup
    .string()
    .required("Поле обов'язкове")
    .min(6, "Пароль має бути не менше 6 символів"),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required("Поле обов'язкове")
    .email("Неправильний формат email"),
});

export const profileSchema = yup.object({
  name: yup
    .string()
    .required("Поле обов'язкове")
    .min(2, "Ім'я має бути не менше 2 символів"),
  email: yup
    .string()
    .required("Поле обов'язкове")
    .email("Неправильний формат email"),
});

export const resetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Введіть коректний email")
    .required("Email обов'язковий"),
  newPassword: yup
    .string()
    .min(6, "Пароль повинен містити мінімум 6 символів")
    .required("Пароль обов'язковий"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Паролі не співпадають")
    .required("Підтвердження пароля обов'язкове"),
});
