
import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
    cancelAnimation,
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
    type SharedValue,
} from 'react-native-reanimated';
import type { Habit } from '../types/habit';
import HabitCard from './HabitCard';

type RightActionsProps = {
  progress: SharedValue<number>;

  editScale: SharedValue<number>;
  deleteScale: SharedValue<number>;

  editOpacity: SharedValue<number>;
  deleteOpacity: SharedValue<number>;

  editTranslateY: SharedValue<number>;
  deleteTranslateY: SharedValue<number>;

  habit: Habit;

  onDelete: (id: number) => void;
  onEdit: (habit: Habit) => void;
};

function RightActions({
  progress,
  editScale,
  deleteScale,
  editOpacity,
  deleteOpacity,
  editTranslateY,
  deleteTranslateY,
  habit,
  onDelete,
  onEdit,
}: RightActionsProps) {

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.2, 1],
      [0, 1, 1],
      Extrapolation.CLAMP
    );

    const translateX = interpolate(
      progress.value,
      [0, 1],
      [35, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  const editAnimatedStyle = useAnimatedStyle(() => ({
    opacity: editOpacity.value,
    transform: [
      { scale: editScale.value },
      { translateY: editTranslateY.value },
    ],
  }));

  const deleteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: deleteOpacity.value,
    transform: [
      { scale: deleteScale.value },
      { translateY: deleteTranslateY.value },
    ],
  }));
  const confirmDelete = () => {
  Alert.alert(
    'Удалить привычку?',
    `Вы действительно хотите удалить привычку "${habit.name}"?`,
    [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: () => onDelete(habit.id),
      },
    ]
  );
};

  return (
    <Animated.View
      style={[
        styles.actions,
        containerAnimatedStyle,
      ]}
    >

      
      <Animated.View style={editAnimatedStyle}>
        <Pressable
          style={styles.editButton}
          onPress={() => onEdit(habit)}
        >
          <Ionicons
            name="create-outline"
            size={24}
            color="#FFFFFF"
          />
        </Pressable>
      </Animated.View>

      <Animated.View style={deleteAnimatedStyle}>
        <Pressable
          style={styles.deleteButton}
          onPress={confirmDelete}
        >
          <Ionicons
            name="trash-outline"
            size={24}
            color="#FFFFFF"
          />
        </Pressable>
      </Animated.View>

    </Animated.View>
  );
}


type SwipeableHabitCardProps = {
  habit: Habit;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (habit: Habit) => void;
};

export default function SwipeableHabitCard({
  habit,
  onToggle,
  onDelete,
  onEdit,
}: SwipeableHabitCardProps) {

  const editScale = useSharedValue(0.7);
  const deleteScale = useSharedValue(0.7);

  
  const editOpacity = useSharedValue(0);
  const deleteOpacity = useSharedValue(0);

 
  const editTranslateY = useSharedValue(15);
  const deleteTranslateY = useSharedValue(15);

  const startButtonsAnimation = () => {

    cancelAnimation(editScale);
    cancelAnimation(deleteScale);

    cancelAnimation(editOpacity);
    cancelAnimation(deleteOpacity);

    cancelAnimation(editTranslateY);
    cancelAnimation(deleteTranslateY);

    editScale.value = 0.7;
    deleteScale.value = 0.7;

    editOpacity.value = 0;
    deleteOpacity.value = 0;

    editTranslateY.value = 15;
    deleteTranslateY.value = 15;

    editScale.value = withSpring(1, {
      damping: 12,
      stiffness: 180,
      mass: 0.8,
    });

    editOpacity.value = withTiming(1, {
      duration: 180,
    });

    editTranslateY.value = withSpring(0, {
      damping: 12,
      stiffness: 180,
      mass: 0.8,
    });

    deleteScale.value = withDelay(
      150,
      withSpring(1, {
        damping: 12,
        stiffness: 180,
        mass: 0.8,
      })
    );

    deleteOpacity.value = withDelay(
      150,
      withTiming(1, {
        duration: 180,
      })
    );

    deleteTranslateY.value = withDelay(
      150,
      withSpring(0, {
        damping: 12,
        stiffness: 180,
        mass: 0.8,
      })
    );
  };

  const resetButtonsAnimation = () => {
    cancelAnimation(editScale);
    cancelAnimation(deleteScale);

    cancelAnimation(editOpacity);
    cancelAnimation(deleteOpacity);

    cancelAnimation(editTranslateY);
    cancelAnimation(deleteTranslateY);

    editScale.value = 0.7;
    deleteScale.value = 0.7;

    editOpacity.value = 0;
    deleteOpacity.value = 0;

    editTranslateY.value = 15;
    deleteTranslateY.value = 15;
  };
  
  return (
    <ReanimatedSwipeable
      renderRightActions={(progress) => (
        <RightActions
          progress={progress}
          editScale={editScale}
          deleteScale={deleteScale}
          editOpacity={editOpacity}
          deleteOpacity={deleteOpacity}
          editTranslateY={editTranslateY}
          deleteTranslateY={deleteTranslateY}
          habit={habit}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}

      onSwipeableWillOpen={startButtonsAnimation}
      onSwipeableWillClose={resetButtonsAnimation}

      overshootRight={false}
      rightThreshold={40}
    >
      <HabitCard
        habit={habit}
        onToggle={onToggle}
      />
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingLeft: 8,
    marginBottom: 12,
  },

  editButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
