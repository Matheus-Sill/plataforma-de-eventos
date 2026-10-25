import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { EventItem } from "../types";
import { formatDate } from "../utils/format";

type Props = {
  event: EventItem;
  onPress: () => void;
  badge?: string;
};

export default function EventCard({ event, onPress, badge }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {event.image ? (
        <Image source={{ uri: event.image }} style={styles.image} />
      ) : null}
      <View style={styles.body}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.meta}>
          {formatDate(event.date)} às {event.time}
        </Text>
        <Text style={styles.meta}>{event.location}</Text>
        {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: { width: "100%", height: 150, backgroundColor: "#e5e7eb" },
  body: { padding: 14, gap: 4 },
  title: { fontSize: 17, fontWeight: "700", color: "#111827" },
  meta: { fontSize: 14, color: "#6b7280" },
  badge: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
});