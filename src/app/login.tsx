import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { loginUser } = useAuth();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!login.trim() || !password) {
      setError("Заполните все поля");
      return;
    }

    try {
      setLoading(true);

      await loginUser(login.trim(), password);

      // После успешного входа AuthNavigator
      // автоматически откроет главный экран.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#f8eeee", "#e2bfc0", "#f5d6d7"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>С возвращением!</Text>
          <Text style={styles.subtitle}>Войдите в свой аккаунт Habitify</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Логин"
              placeholderTextColor="#999"
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Выполняется вход..." : "Войти"}
              </Text>
            </Pressable>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Нет аккаунта?</Text>

              <Pressable onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>Зарегистрироваться</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#292020",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#725e5e",
    marginBottom: 35,
  },
  form: {
    gap: 17,
  },
  input: {
    height: 56,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ded3d3",
    borderRadius: 15,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#292020",
  },
  error: {
    color: "#b42318",
    fontSize: 14,
  },
  button: {
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#d9655c",
    fontSize: 17,
    fontWeight: "700",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 12,
  },
  registerText: {
    color: "#725e5e",
    fontSize: 14,
  },
  registerLink: {
    color: "#c65353",
    fontSize: 14,
    fontWeight: "700",
  },
});
