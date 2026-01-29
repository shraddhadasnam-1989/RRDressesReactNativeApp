import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import PartyOrderCard from "./PartyOrderCard";
import { router } from "expo-router";
import API_BASE_URL from "../config/api";

export default function PartyOrderList({ selectedDate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("Selected Date in PartyOrderList:", selectedDate);
  useEffect(() => {
    if (!selectedDate) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ac = new AbortController();
    const url = `${API_BASE_URL}/orders/by-date/${selectedDate}`;

    (async () => {
      try {
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) {
          console.error("Fetch failed:", res.status, res.statusText);
          setData([]);
          setLoading(false);
          return;
        }
        const json = await res.json();
        setData(json);
        console.log("Fetched orders for date:", selectedDate, json);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Fetch error:", err);
          let errorMessage = "Failed to load orders. Please try again.";
          if (err.message.includes("404")) {
            errorMessage = "No orders found for this date.";
          } else if (err.message.includes("500")) {
            errorMessage = "Server error. Please try again later.";
          } else if (
            err.message.includes("Network") ||
            err.message.includes("fetch")
          ) {
            errorMessage =
              "Network error. Please check your internet connection.";
          }

          Alert.alert("Error Loading Orders", errorMessage, [{ text: "OK" }]);
          setData([]);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [selectedDate]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!data?.length) {
    console.log("No orders found for date:", selectedDate);
    return (
      <View style={{ padding: 20 }}>
        <Text>No orders found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 15 }}>
      {data.map((party, idx) => (
        <PartyOrderCard
          key={idx}
          partyName={party.partyName}
          orderIds={party.orderIds}
          onSelectOrder={(orderNo) =>
            router.push({
              pathname: "/order-details",
              params: { orderNo },
            })
          }
        />
      ))}
    </ScrollView>
  );
}
