// // /components/ConfigModal.tsx
// import React from 'react';
// import { Text, TextInput, TouchableOpacity, View } from 'react-native';
// import RNModal from 'react-native-modal';
// import styles, { COLORS } from '../app/styles';
// import { Table } from '../types';

// interface Props {
//   visible: boolean;
//   current: Table | null;
//   configName: string;
//   configNumber: string;
//   onChangeName: (name: string) => void;
//   onChangeNumber: (num: string) => void;
//   onSave: () => void;
//   onCancel: () => void;
// }

// export default function ConfigModal({
//   visible,
//   current,
//   configName,
//   configNumber,
//   onChangeName,
//   onChangeNumber,
//   onSave,
//   onCancel,
// }: Props) {
//   return (
//     <RNModal isVisible={visible} backdropColor={COLORS.secondary} backdropOpacity={0.8}>
//       <View style={styles.modalBox}>
//         <Text style={styles.modalTitle}>Configurar Mesa {current?.id}</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Nome da Mesa"
//           placeholderTextColor={COLORS.disabled}
//           value={configName}
//           onChangeText={onChangeName}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Número da Mesa*"
//           placeholderTextColor={COLORS.disabled}
//           value={configNumber}
//           onChangeText={onChangeNumber}
//           keyboardType="number-pad"
//         />
//         <TouchableOpacity style={styles.btn} onPress={onSave}>
//           <Text style={styles.btnText}>SALVAR</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
//           <Text style={styles.cancelBtnText}>CANCELAR</Text>
//         </TouchableOpacity>
//       </View>
//     </RNModal>
//   );
// }
// /components/ConfigModal.tsx
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import styles, { COLORS } from '../app/styles';
import { Table } from '../types';

interface Props {
  visible: boolean;
  current: Table | null;
  configName: string;
  configNumber: string;
  onChangeName: (name: string) => void;
  onChangeNumber: (num: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ConfigModal({
  visible,
  current,
  configName,
  configNumber,
  onChangeName,
  onChangeNumber,
  onSave,
  onCancel,
}: Props) {
  // Function to handle number input and filter out non-numeric characters
  const handleNumberChange = (text: string) => {
    // Remove any non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    onChangeNumber(numericText);
  };

  return (
    <RNModal isVisible={visible} backdropColor={COLORS.secondary} backdropOpacity={0.8}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>Configurar Mesa {current?.id}</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da Mesa"
          placeholderTextColor={COLORS.disabled}
          value={configName}
          onChangeText={onChangeName}
        />
        <TextInput
          style={styles.input}
          placeholder="Número da Mesa*"
          placeholderTextColor={COLORS.disabled}
          value={configNumber}
          onChangeText={handleNumberChange}
          keyboardType="number-pad"
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.btn} onPress={onSave}>
          <Text style={styles.btnText}>SALVAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    </RNModal>
  );
}