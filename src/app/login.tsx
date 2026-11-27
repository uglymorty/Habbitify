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
import { useTheme } from "../context/ThemeContext";

export default function LoginScreen() {
  const { loginUser } = useAuth();
  const { colors, darkTheme } = useTheme();

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={
        darkTheme
          ? ["#211C22", "#342B34", "#211C22"]
          : ["#f8eeee", "#e2bfc0", "#f5d6d7"]
      }
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            С возвращением!
          </Text>

          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Войдите в свой аккаунт Habitify
          </Text>

          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Логин"
              placeholderTextColor={colors.secondaryText}
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Пароль"
              placeholderTextColor={colors.secondaryText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error ? (
              <Text style={[styles.error, { color: colors.accent }]}>
                {error}
              </Text>
            ) : null}

            <Pressable
              style={[
                styles.button,
                { backgroundColor: colors.accent },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Выполняется вход..." : "Войти"}
              </Text>
            </Pressable>

            <View style={styles.registerRow}>
              <Text
                style={[styles.registerText, { color: colors.secondaryText }]}
              >
                Нет аккаунта?
              </Text>

              <Pressable onPress={() => router.push("/register")}>
                <Text style={[styles.registerLink, { color: colors.accent }]}>
                  Зарегистрироваться
                </Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 35,
  },
  form: {
    gap: 17,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 18,
    fontSize: 16,
  },
  error: {
    fontSize: 14,
  },
  button: {
    height: 56,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
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
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});
