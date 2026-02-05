import { View, Text, Pressable } from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";

export default function AppHeader() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#ddd",
      }}
    >
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        style={{ marginRight: 16 }}
      >
        {/* TEXT icon → zero font issues */}
        <Text style={{ fontSize: 24 }}>☰</Text>
      </Pressable>

      <Text style={{ fontSize: 18, fontWeight: "600" }}>RR Dresses</Text>
    </View>
  );
}
