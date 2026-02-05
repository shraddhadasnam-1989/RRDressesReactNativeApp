import { View, Text, StyleSheet  } from "react-native";
import AppHeader from "../components/AppHeader";
import DateSearchScreen from "../components/DateSearchScreen";

export default function UpdateOrderScreen() {
   return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.content}>
        <DateSearchScreen />
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
