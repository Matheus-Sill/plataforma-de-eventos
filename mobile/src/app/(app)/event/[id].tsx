import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { apiFetch } from "../../../api";
import { useRegistrations } from "../../../context/RegistrationsContext";
import type { EventItem } from "../../../types";
import { formatDate } from "../../../utils/format";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findByEvent, register, cancel } = useRegistrations();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch<EventItem>(`/api/events/${id}`)
      .then(setEvent)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erro ao carregar evento")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const registration = event ? findByEvent(event.id) : undefined;

  async function handleRegister() {
    if (!event) return;
    setBusy(true);
    try {
      await register(event.id);
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível inscrever");
    } finally {
      setBusy(false);
    }
  }

  function handleCancel() {
    if (!registration) return;
    Alert.alert("Cancelar inscrição", "Deseja cancelar sua inscrição?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim, cancelar",
        style: "destructive",
        onPress: async () => {
          setBusy(true);
          try {
            await cancel(registration.id);
          } catch (err) {
            Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível cancelar");
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || "Evento não encontrado"}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {event.image ? (
        <Image source={{ uri: event.image }} style={styles.image} />
      ) : null}

      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.meta}>
        {formatDate(event.date)} às {event.time}
      </Text>
      <Text style={styles.meta}>{event.location}</Text>
      <Text style={styles.description}>{event.description}</Text>

      <Pressable
        style={[
          styles.button,
          registration ? styles.buttonCancel : styles.buttonRegister,
          busy && styles.disabled,
        ]}
        onPress={registration ? handleCancel : handleRegister}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {registration ? "Cancelar inscrição" : "Inscrever-se"}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  error: { color: "#b91c1c", textAlign: "center" },
  image: { width: "100%", height: 200, borderRadius: 12, backgroundColor: "#e5e7eb" },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginTop: 8 },
  meta: { fontSize: 15, color: "#6b7280" },
  description: { fontSize: 16, color: "#374151", marginTop: 12, lineHeight: 22 },
  button: { borderRadius: 8, padding: 14, alignItems: "center", marginTop: 20 },
  buttonRegister: { backgroundColor: "#15803d" },
  buttonCancel: { backgroundColor: "#b91c1c" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  disabled: { opacity: 0.6 },
});