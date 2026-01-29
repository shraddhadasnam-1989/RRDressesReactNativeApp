import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function PartyOrderCard({ partyName, orderIds, onSelectOrder }) {
  return (
    <View style={styles.card}>
      {/* Party Name */}
      <Text style={styles.partyName}>{partyName}</Text>

      {/* Order No Links */}
      <View style={styles.orderList}>
        {orderIds.map((orderId) => (
          <TouchableOpacity
            onPress={() => router.push(`/hidden/view-order/${orderId}`)}
          >
            <Text style={{ color: "blue", textDecorationLine: "underline" }}>
              Order #{orderId}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  partyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderList: {
    gap: 8,
  },
  orderButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f2f7ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cfe0ff",
  },
  orderText: {
    color: "#3564ff",
    fontSize: 16,
    fontWeight: "500",
  },
});
