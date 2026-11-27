import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const { colors, darkTheme } = useTheme();
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showError = (message: string) => {
    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert("Ошибка", message);
    }
  };

  const handleRegister = async () => {
    if (
      !surname.trim() ||
      !name.trim() ||
      !age.trim() ||
      !login.trim() ||
      !password ||
      !confirmPassword
    ) {
      showError("Заполни все поля");
      return;
    }

    if (password !== confirmPassword) {
      showError("Пароли не совпадают");
      return;
    }

    setLoading(true);

    try {
      await register({
        surname,
        name,
        age: Number(age),
        login,
        password,
      });

      // После регистрации AuthNavigator
      // автоматически откроет вкладки приложения.
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось зарегистрироваться",
      );
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
      locations={[0, 0.55, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              Регистрация
            </Text>

            <View style={styles.fields}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Фамилия"
                placeholderTextColor={colors.secondaryText}
                value={surname}
                onChangeText={setSurname}
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
                placeholder="Имя"
                placeholderTextColor={colors.secondaryText}
                value={name}
                onChangeText={setName}
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
                placeholder="Возраст"
                placeholderTextColor={colors.secondaryText}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
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
                placeholder="Логин"
                placeholderTextColor={colors.secondaryText}
                value={login}
                onChangeText={setLogin}
                autoCapitalize="none"
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

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Повторите пароль"
                placeholderTextColor={colors.secondaryText}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={[
                styles.registerButton,
                { backgroundColor: colors.accent },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Зарегистрироваться</Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.replace("/login")}
              style={styles.loginLink}
            >
              <Text style={[styles.linkText, { color: colors.secondaryText }]}>
                Уже есть аккаунт?{" "}
                <Text style={[styles.linkAccent, { color: colors.accent }]}>
                  Войти
                </Text>
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 30,
    paddingBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },

  fields: {
    gap: 10,
  },

  input: {
    height: 42,
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
    fontSize: 13,
  },

  footer: {
    paddingTop: 12,
    paddingBottom: 14,
  },

  registerButton: {
    height: 44,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },

  loginLink: {
    alignItems: "center",
    marginTop: 13,
  },

  linkText: {
    fontSize: 12,
  },

  linkAccent: {
    fontWeight: "700",
  },
});
