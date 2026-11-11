import { StyleSheet, Text, View } from 'react-native'

const settings = () => {
  return (
    <View style={styles.container}>
      <Text>settings</Text>
    </View>
  )
}

export default settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});