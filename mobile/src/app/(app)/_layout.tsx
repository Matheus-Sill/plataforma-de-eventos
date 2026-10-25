import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { RegistrationsProvider } from "../../context/RegistrationsContext";

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;

  return (
    <RegistrationsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ title: "Detalhes do evento" }} />
      </Stack>
    </RegistrationsProvider>
  );
}