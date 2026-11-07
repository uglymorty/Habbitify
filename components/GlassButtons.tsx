import { GlassView } from 'expo-glass-effect';
import { StyleSheet, View } from 'react-native';

export default function GlassButtons() {
  return (
    <View style={styles.wrapper}>
       <GlassView style={styles.glass}/>
       <GlassView style={styles.tintedGlass} glassEffectStyle="clear" isInteractive/>
    </View>
      
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  glass: {
    position: 'absolute',
    top: 100,
    left: 50,
    width: 200,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tintedGlass: {
    position: 'absolute',
    top: 250,
    left: -10,
    width: 200,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    
  },

  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});