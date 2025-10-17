import { Redirect } from "expo-router";
import { useAppSelector } from "../redux/store";

export default function Index() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
