import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Preencha todos os campos");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não conferem");
      return;
    }

    setLoading(true);
    try {
      await signUp(name.trim(), email.trim().toLowerCase(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Criar conta</Text>

          {error !== "" && <Text style={styles.error}>{error}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha (mínimo 6 caracteres)"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </Pressable>

          <Link href="/login" style={styles.link}>
            Já tem conta? Entrar
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  button: {
    backgroundColor: "#15803d",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { color: "#1d4ed8", textAlign: "center", marginTop: 4 },
});