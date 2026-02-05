import { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import AppHeader from "../components/AppHeader";
import ViewOrderScreen from "../components/ViewOrderScreen";

export default function ListOrdersByOrderId() {
  const [id, setId] = useState("");
  const [selectedId, setSelectedId] = useState("");

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.content}>
        <TextInput
          placeholder="Enter Order Number"
          value={id}
          onChangeText={setId}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            padding: 8,
            marginBottom: 10,
            color: "#000",
            borderColor: "#999",
          }}
        />

        <Button title="Search" onPress={() => setSelectedId(id)} />

        {selectedId ? <ViewOrderScreen orderNo={selectedId} /> : null}
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
    padding: "20px",
  },
});
