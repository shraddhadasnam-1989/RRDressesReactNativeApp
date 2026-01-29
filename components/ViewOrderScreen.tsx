import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import API_BASE_URL from "../config/api";

export default function ViewOrderScreen({ orderNo }) {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch order by ID
  useEffect(() => {
    if (!orderNo) return;

    setLoading(true);

    fetch(`${API_BASE_URL}/orders/${orderNo}`)
      .then((res) => res.json())
      .then((data) => {
        setOrderData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error:", err);
        Alert.alert(
          "Error Loading Order",
          err.message ||
            "Failed to load order. Please check the order number and try again.",
          [{ text: "OK" }]
        );
        setLoading(false);
      });
  }, [orderNo]);

  // Extract all unique size labels
  const getSizeHeaders = (items) => {
    const set = new Set();
    items?.forEach((item) => {
      item.sizes?.forEach((s) => set.add(s.sizeLabel));
    });
    return Array.from(set);
  };

  if (!orderNo) return <Text style={styles.message}>No Order Selected</Text>;

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  if (!orderData) return <Text style={styles.message}>Order Not Found</Text>;

  const sizeHeaders = getSizeHeaders(orderData.items);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Order Details</Text>

      <Text style={styles.info}>Order No: {orderData.orderNo}</Text>
      <Text style={styles.info}>Party Name: {orderData.partyName}</Text>
      <Text style={styles.info}>Date: {orderData.date}</Text>

      {/* TABLE */}
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.th, { flex: 2 }]}>Particular</Text>

          {sizeHeaders.map((size) => (
            <Text key={size} style={styles.th}>
              {size}
            </Text>
          ))}

          <Text style={styles.th}>Rate</Text>
          <Text style={styles.th}>Amount</Text>
          <Text style={styles.th}>Instructions</Text>
        </View>

        {/* Data Rows */}
        {orderData.items.map((item, index) => {
          const qtyMap = {};
          item.sizes?.forEach((s) => {
            qtyMap[s.sizeLabel] = s.quantity;
          });

          const totalQty = item.sizes?.reduce((sum, s) => sum + s.quantity, 0);

          //const amount = totalQty * item.rate;

          return (
            <View key={index} style={styles.row}>
              <Text style={[styles.td, { flex: 2 }]}>{item.particular}</Text>

              {sizeHeaders.map((h) => (
                <Text key={h} style={styles.td}>
                  {qtyMap[h] ?? ""}
                </Text>
              ))}

              <Text style={styles.td}>{item.rate}</Text>
              <Text style={styles.td}>{item.amount}</Text>
              <Text style={styles.td}>{item.instructions}</Text>
            </View>
          );
        })}
      </View>

      {/* Total */}
      <Text style={styles.totalText}>
        Total Amount: ₹ {orderData.totalAmount}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 4 },
  message: { marginTop: 30, textAlign: "center", fontSize: 16 },

  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 20,
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerRow: { backgroundColor: "#e0e0e0" },

  th: {
    flex: 1,
    padding: 6,
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
  },
  td: {
    flex: 1,
    padding: 6,
    fontSize: 13,
    textAlign: "center",
  },

  totalText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});
