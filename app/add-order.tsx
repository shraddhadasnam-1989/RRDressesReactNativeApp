import { View, StyleSheet } from "react-native";
import AppHeader from "../components/AppHeader";
import OrderFormInlineEditable from "../components/AddOrderDetail";

export default function AddOrderScreen() {
  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.content}>
        <OrderFormInlineEditable />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
