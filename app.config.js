export default {
  expo: {
    name: "English",
    slug: "react-native-learning-english",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/english.png",
    scheme: "learningenglish",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yuriy2223.learningenglish",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/english.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.yuriy2223.learningenglish",
    },
    web: {
      output: "static",
      favicon: "./public/favicon.ico",
    },
    plugins: [
      "expo-router",
      "@react-native-google-signin/google-signin",
      [
        "expo-splash-screen",
        {
          image: "./assets/english.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: { backgroundColor: "#000000" },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
      googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      baseUrl: process.env.BACKEND_URL,
    },
  },
};
