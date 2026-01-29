import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useRouter } from "expo-router";
import API_BASE_URL from "../config/api";

export default function DateSearchScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [webDate, setWebDate] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter(); // <<< FIX: router instead of navigation

  const formatDate = () => {
    if (Platform.OS === "web") {
      return webDate; // Already in YYYY-MM-DD format
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onSearch = async () => {
    const formattedDate = formatDate();

    if (!formattedDate) {
      alert("Please select a date.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/by-date/${formattedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Navigate to results screen

      console.log("Navigating to party-order-list with date:", formattedDate);
      router.push({
        pathname: "/hidden/party-order-list",
        params: { date: formattedDate },
      });
    } catch (err) {
      console.error(err);
      let errorMessage = "Failed to fetch orders. Please try again.";
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = "No orders found for this date.";
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
        Enter Date
      </Text>

      {/* WEB DATE INPUT */}
      {Platform.OS === "web" ? (
        <input
          type="date"
          value={webDate}
          onChange={(e) => setWebDate(e.target.value)}
          style={{
            padding: 12,
            width: "100%",
            borderRadius: 8,
            border: "1px solid #aaa",
            fontSize: 16,
            marginBottom: 20,
          }}
        />
      ) : (
        <>
          {/* MOBILE DATE DISPLAY */}
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              padding: 15,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#888",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 16 }}>{formatDate()}</Text>
          </TouchableOpacity>

          {/* MOBILE DATETIME PICKER */}
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      <Button title="Search Orders" onPress={onSearch} />
    </View>
  );
}
