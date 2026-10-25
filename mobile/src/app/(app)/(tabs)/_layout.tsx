import { Pressable, Text } from "react-native";
import { Tabs } from "expo-router";
import { useAuth } from "../../../context/AuthContext";

export default function TabsLayout() {
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <Pressable onPress={signOut} style={{ marginRight: 16 }}>
            <Text style={{ color: "#b91c1c", fontWeight: "600" }}>Sair</Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Eventos" }} />
      <Tabs.Screen name="registrations" options={{ title: "Minhas inscrições" }} />
    </Tabs>
  );
}