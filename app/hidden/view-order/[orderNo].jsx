import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AppHeader from "@components/AppHeader";
import ViewOrderScreen from "@components/ViewOrderScreen";

export default function ViewOrderRoute() {
  const { orderNo } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.content}>
        <ViewOrderScreen orderNo={orderNo} />
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
