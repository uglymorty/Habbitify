import { Dropdown } from 'react-native-element-dropdown';

import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type Category = {
  label: string;
  value: string;
};

type AddHabitModalProps = {
  visible: boolean;
  habitName: string;
  selectedCategory: string;
  categories: Category[];
  onChangeName: (name: string) => void;
  onChangeCategory: (category: string) => void;
  onAdd: () => void;
  onCancel: () => void;
  isEditing: boolean;
};

export default function AddHabitModal({
  visible,
  habitName,
  selectedCategory,
  categories,
  onChangeName,
  onChangeCategory,
  onAdd,
  onCancel,
  isEditing,
}: AddHabitModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.backgroundModal}>
          <Text style={styles.addModalTitle}>
            {isEditing ? 'Редактировать привычку' : 'Новая привычка'}
          </Text>

          <TextInput
            placeholder="Введите привычку"
            placeholderTextColor="#999"
            value={habitName}
            onChangeText={onChangeName}
            style={styles.habitInput}
          />

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={categories}
            labelField="label"
            valueField="value"
            placeholder="Выберите категорию"
            value={selectedCategory}
            onChange={(item) => onChangeCategory(item.value)}
          />

          <View style={styles.addModalButtons}>
            <Pressable
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </Pressable>

            <Pressable
              style={styles.addButton}
              onPress={onAdd}
            >
              <Text style={styles.addButtonText}>
                {isEditing ? 'Сохранить' : 'Добавить'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(29,29,29,0.35)',
  },

  backgroundModal: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#fff7f6',
  },

  addModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 18,
  },

  habitInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#e0c5c5',
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1d1d1d',
    backgroundColor: '#ffffff',
  },

  dropdown: {
    height: 50,
    borderColor: '#e0c5c5',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginTop: 15,
    backgroundColor: '#ffffff',
  },

  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },

  selectedTextStyle: {
    fontSize: 16,
    color: '#1d1d1d',
  },

  addModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f0dddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    color: '#803f3b',
    fontSize: 15,
    fontWeight: '600',
  },

  addButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#d9655c',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});