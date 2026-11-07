import { StyleSheet, Text, View } from "react-native";

export default function StatisticsScreen() {
  return (
    <View style={styles.container}>
      <Text>Экран статистики</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});