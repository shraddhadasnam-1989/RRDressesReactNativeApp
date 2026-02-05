import { View, StyleSheet } from "react-native";
import SearchByParticular from "../components/SearchByParticular";
import AppHeader from "../components/AppHeader";

export default function ListOrdersByParticular() {
  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.content}>
        <SearchByParticular />
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
