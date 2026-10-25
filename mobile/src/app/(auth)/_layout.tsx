import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Já está logado: não precisa ver login/cadastro
  if (user) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}