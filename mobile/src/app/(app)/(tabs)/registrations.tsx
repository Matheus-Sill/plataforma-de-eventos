import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import EventCard from "../../../components/EventCard";
import { useRegistrations } from "../../../context/RegistrationsContext";

export default function RegistrationsScreen() {
  const router = useRouter();
  const { registrations, loading, error, reload, cancel } = useRegistrations();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  function confirmCancel(registrationId: string) {
    Alert.alert("Cancelar inscrição", "Deseja cancelar esta inscrição?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim, cancelar",
        style: "destructive",
        onPress: async () => {
          setCancellingId(registrationId);
          try {
            await cancel(registrationId);
          } catch (err) {
            Alert.alert(
              "Erro",
              err instanceof Error ? err.message : "Não foi possível cancelar"
            );
          } finally {
            setCancellingId(null);
          }
        },
      },
    ]);
  }

  if (loading && registrations.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && registrations.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.button} onPress={reload}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={registrations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshing={loading}
      onRefresh={reload}
      ListEmptyComponent={
        <Text style={styles.empty}>Você ainda não se inscreveu em nenhum evento.</Text>
      }
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <EventCard
            event={item.event}
            onPress={() =>
              router.push({ pathname: "/event/[id]", params: { id: item.eventId } })
            }
          />
          <Pressable
            style={[styles.cancel, cancellingId === item.id && styles.disabled]}
            onPress={() => confirmCancel(item.id)}
            disabled={cancellingId === item.id}
          >
            {cancellingId === item.id ? (
              <ActivityIndicator color="#b91c1c" />
            ) : (
              <Text style={styles.cancelText}>Cancelar inscrição</Text>
            )}
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  item: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, gap: 12 },
  error: { color: "#b91c1c", textAlign: "center" },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 40 },
  button: { backgroundColor: "#15803d", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 },
  buttonText: { color: "#fff", fontWeight: "600" },
  cancel: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    padding: 12,
    alignItems: "center",
  },
  cancelText: { color: "#b91c1c", fontWeight: "600" },
  disabled: { opacity: 0.6 },
});