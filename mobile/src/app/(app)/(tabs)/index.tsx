import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { apiFetch } from "../../../api";
import EventCard from "../../../components/EventCard";
import { useRegistrations } from "../../../context/RegistrationsContext";
import type { EventItem } from "../../../types";

export default function EventsScreen() {
  const router = useRouter();
  const { findByEvent } = useRegistrations();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError("");
    try {
      const data = await apiFetch<EventItem[]>("/api/events");
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar eventos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && events.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.button} onPress={() => load()}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshing={refreshing}
      onRefresh={() => load(true)}
      ListEmptyComponent={
        <Text style={styles.empty}>Nenhum evento disponível no momento.</Text>
      }
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => (
        <EventCard
          event={item}
          badge={findByEvent(item.id) ? "Inscrito" : undefined}
          onPress={() =>
            router.push({ pathname: "/event/[id]", params: { id: item.id } })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, gap: 12 },
  error: { color: "#b91c1c", textAlign: "center" },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 40 },
  button: { backgroundColor: "#15803d", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 },
  buttonText: { color: "#fff", fontWeight: "600" },
});