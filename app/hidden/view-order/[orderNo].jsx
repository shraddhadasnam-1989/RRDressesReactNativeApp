import { useLocalSearchParams } from "expo-router";
import ViewOrderScreen from "@components/ViewOrderScreen";

export default function ViewOrderRoute() {
  const { orderNo } = useLocalSearchParams();
  return <ViewOrderScreen orderNo={orderNo} />;
}
