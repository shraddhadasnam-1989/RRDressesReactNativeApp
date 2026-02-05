import { View, Text, StyleSheet } from "react-native";
import AppHeader from "@components/AppHeader";
import PartyOrderList from "@components/PartyOrderList";
import { useLocalSearchParams } from "expo-router";
export default function ListOrdersScreen() {
  const { date } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.content}>
        <PartyOrderList selectedDate={date} />
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
