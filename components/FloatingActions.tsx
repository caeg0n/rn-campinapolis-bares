// // /components/FloatingActions.tsx
// import React from "react";
// import { TouchableOpacity, View } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import styles, { COLORS } from "../app/styles";

// interface Props {
//   onAddPerson: () => void;
//   onAddProduct: () => void;
//   onBilling: () => void;
//   onEditTable: () => void; // 🔴 ESSA LINHA DEVE EXISTIR
// }


// export default function FloatingActions({
//   onAddPerson,
//   onAddProduct,
//   onBilling,
//   onEditTable
// }: Props) {
  
//   return (
//     <View style={styles.fabRow}>
//       <TouchableOpacity style={styles.fab} onPress={onAddPerson}>
//         <Icon name="person-add" size={24} color={COLORS.secondary} />
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.fab} onPress={onAddProduct}>
//         <Icon name="local-bar" size={24} color={COLORS.secondary} />
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.fab} onPress={onBilling}>
//         <Icon name="receipt" size={24} color={COLORS.secondary} />
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.fab} onPress={onEditTable}>
//         <Icon name="settings" size={24} color={COLORS.secondary} />
//       </TouchableOpacity>
//     </View>
//   );
// }
// /components/FloatingActions.tsx
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles, { COLORS } from "../app/styles";

interface Props {
  onAddPerson: () => void;
  onAddProduct: () => void;
  onBilling: () => void;
  onEditTable: () => void;
}


export default function FloatingActions({
  onAddPerson,
  onAddProduct,
  onBilling,
  onEditTable
}: Props) {
  
  return (
    <View style={styles.fabRow}>
      <TouchableOpacity style={styles.fab} onPress={onAddPerson}>
        <Icon name="person-add" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.fab} onPress={onAddProduct}>
        <Icon name="local-bar" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.fab} onPress={onBilling}>
        <Icon name="receipt" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.fab} onPress={onEditTable}>
        <Icon name="settings" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
    </View>
  );
}