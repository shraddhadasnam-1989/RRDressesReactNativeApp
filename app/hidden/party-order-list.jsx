import { View, Text } from "react-native";
import PartyOrderList from "@components/PartyOrderList";
import { useLocalSearchParams } from "expo-router";
export default function ListOrdersScreen() {
  const { date } = useLocalSearchParams();
  return <PartyOrderList selectedDate={date} />;
}
