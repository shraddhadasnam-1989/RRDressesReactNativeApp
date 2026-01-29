import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import API_BASE_URL from "../config/api";
import * as ScreenOrientation from "expo-screen-orientation";
import DateTimePicker from "@react-native-community/datetimepicker";

const formatDDMMYYYY = (date) => {
  if (!date) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const formatYYYYMMDD = (date) => {
  if (!date) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function SearchByParticular() {
  const [particular, setParticular] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [toWebDate, setToWebDate] = useState("");
  const [fromWebDate, setFromWebDate] = useState("");

  /*useEffect(() => {
    // Lock to landscape when screen opens
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      // Unlock when leaving screen
      ScreenOrientation.unlockAsync();
    };
  }, []);*/

  useEffect(() => {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 30);

    // mobile
    setFromDate(from);
    setToDate(today);

    // web (YYYY-MM-DD)
    setFromWebDate(from.toISOString().split("T")[0]);
    setToWebDate(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (fromDate && toDate && fromDate > toDate) {
      setToDate(fromDate);
    }
  }, [fromDate]);

  useEffect(() => {
    if (fromDate && toDate && toDate < fromDate) {
      setFromDate(toDate);
    }
  }, [toDate]);

  useEffect(() => {
    if (Platform.OS === "web") {
      if (fromWebDate && toWebDate && fromWebDate > toWebDate) {
        setToWebDate(fromWebDate);
      }
    }
  }, [fromWebDate]);

  useEffect(() => {
    if (Platform.OS === "web") {
      if (fromWebDate && toWebDate && toWebDate < fromWebDate) {
        setFromWebDate(toWebDate);
      }
    }
  }, [toWebDate]);

  const toInputDate = (date) => (date ? date.toISOString().split("T")[0] : "");

  const fromInputDate = (value) => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatYMD = (d) => {
    if (!d) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const parseDate = (ymd) => {
    if (!ymd) return new Date();
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const todayYMD = () => new Date().toISOString().split("T")[0];

  const dateObjToYMD = (date) => date.toISOString().split("T")[0];

  const isSearchDisabled = () => {
    // 🔴 Particular validation
    if (!particular || particular.trim().length === 0) {
      return true;
    }

    let from;
    let to;

    if (Platform.OS === "web") {
      from = fromWebDate; // "" or "YYYY-MM-DD"
      to = toWebDate;
    } else {
      from = fromDate; // Date | null
      to = toDate;
    }

    // ✅ BOTH EMPTY → ALLOW SEARCH
    if (!from && !to) return true;

    // ❌ ONE EMPTY, ONE FILLED → DISABLE
    if (!from || !to) return true;

    const fromD = new Date(from);
    const toD = new Date(to);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // ❌ INVALID RANGE
    if (fromD > toD) return true;

    // ❌ FUTURE DATE
    if (toD > today) return true;

    return false;
  };

  const onSearch = async () => {
    try {
      setLoading(true);

      const q = new URLSearchParams();

      // Particular
      if (particular?.trim()) {
        q.append("particular", particular.trim());
      }

      let from;
      let to;

      if (Platform.OS === "web") {
        // WEB → strings YYYY-MM-DD
        from = fromWebDate;
        to = toWebDate;
      } else {
        // MOBILE → Date objects
        from = fromDate ? dateObjToYMD(fromDate) : null;
        to = toDate ? dateObjToYMD(toDate) : null;
      }

      // Default: from = today - 30 days
      if (!from) {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        from = dateObjToYMD(d);
      }

      // Default: to = today
      if (!to) {
        to = todayYMD();
      }

      // ❌ Validation
      if (new Date(from) > new Date(to)) {
        Alert.alert("Invalid Date Range", "From date cannot be after To date");
        setLoading(false);
        return;
      }

      // ❌ Future date check
      if (new Date(to) > new Date()) {
        Alert.alert("Invalid Date", "Future dates are not allowed");
        setLoading(false);
        return;
      }

      q.append("from", from);
      q.append("to", to);

      const url = `${API_BASE_URL}/orders/search?${q.toString()}`;

      const res = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      setResults(res.data || []);
    } catch (err) {
      console.error(err);

      Alert.alert(
        "Search Failed",
        err?.response?.data?.error ||
          "Unable to fetch search results. Try again."
      );

      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // unique size headers across all items
  const sizeHeaders = useMemo(
    () =>
      Array.from(
        new Set(
          results.flatMap((o) =>
            (o.items || []).flatMap((it) =>
              (it.sizes || []).map((s) => s.sizeLabel)
            )
          )
        )
      ),
    [results]
  );

  // flatten rows and compute per-row amount/qty map
  const rows = useMemo(() => {
    return results.flatMap((o) =>
      (o.items || []).map((it) => {
        const qtyMap = {};
        (it.sizes || []).forEach(
          (s) => (qtyMap[s.sizeLabel] = s.quantity || 0)
        );
        const totalQty = Object.values(qtyMap).reduce(
          (a, b) => a + (b || 0),
          0
        );
        const amount = (it.rate || 0) * totalQty;
        return {
          partyName: o.partyName,
          orderNo: o.orderNo,
          date: o.date,
          particular: it.particular,
          rate: it.rate || 0,
          qtyMap,
          totalQty,
          amount,
        };
      })
    );
  }, [results]);

  // compute totals per size and grand totals
  const { sizeTotals, grandTotalQty, grandTotalAmount } = useMemo(() => {
    const sizeTotals = {};
    let grandTotalQty = 0;
    let grandTotalAmount = 0;
    rows.forEach((r) => {
      sizeHeaders.forEach((h) => {
        sizeTotals[h] = (sizeTotals[h] || 0) + (r.qtyMap[h] || 0);
      });
      grandTotalQty += r.totalQty || 0;
      grandTotalAmount += r.amount || 0;
    });
    return { sizeTotals, grandTotalQty, grandTotalAmount };
  }, [rows, sizeHeaders]);

  // total of displayed Amount columns (sum of each row.amount)
  const ordersTotalAmount = useMemo(() => {
    return rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [rows]);

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
        Search by Particular
      </Text>

      <TextInput
        placeholder="Particular (e.g. Glassy)"
        value={particular}
        onChangeText={setParticular}
        style={styles.input}
      />

      {/* FROM DATE */}
      {Platform.OS === "web" ? (
        <input
          type="date"
          value={fromWebDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setFromWebDate(e.target.value)}
          style={{
            padding: 12,
            width: "99%",
            borderRadius: 8,
            border: "1px solid #aaa",
            fontSize: 16,
            marginBottom: 20,
          }}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setShowFromPicker(true);
            }}
          >
            <Text>{formatDDMMYYYY(fromDate)}</Text>
          </TouchableOpacity>

          {showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              maximumDate={new Date()}
              onChange={(e, d) => {
                setShowFromPicker(false);
                if (d) setFromDate(d);
              }}
            />
          )}
        </>
      )}

      {/* TO DATE */}
      {Platform.OS === "web" ? (
        <input
          type="date"
          value={toWebDate}
          min={fromWebDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setToWebDate(e.target.value)}
          style={{
            padding: 12,
            width: "99%",
            borderRadius: 8,
            border: "1px solid #aaa",
            fontSize: 16,
            marginBottom: 20,
          }}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setShowToPicker(true);
            }}
          >
            <Text>{formatDDMMYYYY(toDate)}</Text>
          </TouchableOpacity>

          {showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              minimumDate={fromDate}
              maximumDate={new Date()}
              onChange={(e, d) => {
                setShowToPicker(false);
                if (d) setToDate(d);
              }}
            />
          )}
        </>
      )}

      <TouchableOpacity
        style={[styles.btn, isSearchDisabled() && { opacity: 0.5 }]}
        disabled={isSearchDisabled()}
        onPress={onSearch}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Search</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <>
          {rows.length === 0 ? (
            <Text style={{ marginTop: 20 }}>No results</Text>
          ) : (
            <View style={{ marginTop: 16 }}>
              {/* Table header */}
              <View style={[styles.row, styles.header]}>
                <Text style={[styles.cell, { flex: 1.4 }]}>Party</Text>
                <Text style={styles.cell}>Order#</Text>
                <Text style={styles.cell}>Date</Text>
                <Text style={styles.cell}>Particular</Text>
                {sizeHeaders.map((s) => (
                  <Text key={s} style={styles.cell}>
                    {s}
                  </Text>
                ))}
                <Text style={styles.cell}>Rate</Text>
                <Text style={styles.cell}>Qty</Text>
                <Text style={styles.cell}>Amount</Text>
              </View>

              {/* Rows */}
              {rows.map((r, idx) => (
                <View key={idx} style={styles.row}>
                  <Text style={[styles.cell, { flex: 1.4 }]}>
                    {r.partyName}
                  </Text>
                  <Text style={styles.cell}>{r.orderNo}</Text>
                  <Text style={styles.cell}>
                    {r.date ? formatDDMMYYYY(new Date(r.date)) : ""}
                  </Text>
                  <Text style={styles.cell}>{r.particular}</Text>
                  {sizeHeaders.map((h) => (
                    <Text key={h} style={styles.cell}>
                      {r.qtyMap[h] ?? ""}
                    </Text>
                  ))}
                  <Text style={styles.cell}>{r.rate ?? ""}</Text>
                  <Text style={styles.cell}>{r.totalQty}</Text>
                  <Text style={styles.cell}>{r.amount}</Text>
                </View>
              ))}

              {/* Footer totals row */}
              <View style={[styles.row, styles.footer]}>
                <Text style={[styles.cell, { flex: 1.4 }]}>Totals</Text>
                <Text style={styles.cell} />
                <Text style={styles.cell} />
                <Text style={styles.cell} />
                {sizeHeaders.map((h) => (
                  <Text key={h} style={[styles.cell, { fontWeight: "700" }]}>
                    {sizeTotals[h] ?? 0}
                  </Text>
                ))}
                <Text style={styles.cell} />
                <Text style={[styles.cell, { fontWeight: "700" }]}>
                  {grandTotalQty}
                </Text>
                <Text style={[styles.cell, { fontWeight: "700" }]}>
                  {grandTotalAmount}
                </Text>
              </View>
            </View>
          )}
        </>
      )}
      {/* Grand total for all parties */}
      <View style={{ marginTop: 12, alignItems: "flex-end" }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>
          Total Amount: ₹{" "}
          {new Intl.NumberFormat("en-IN").format(ordersTotalAmount)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 8,
    borderRadius: 6,
  },
  btn: {
    marginTop: 12,
    backgroundColor: "#007AFF",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    minHeight: 44,
  },
  header: { backgroundColor: "#f3f3f3" },
  footer: { backgroundColor: "#fafafa" },
  cell: { flex: 1, padding: 6, textAlign: "center", fontSize: 13 },
});
