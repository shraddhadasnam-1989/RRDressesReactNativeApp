// OrderFormInlineEditable.jsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import API_BASE_URL from "../config/api";
const SIZE_KEYS = [
  "34-S",
  "36-M",
  "38-L",
  "40-XL",
  "42-2XL",
  "44-3XL",
  "46-4XL",
  "48-5XL",
  "50-6XL",
];

const initialForm = {
  partyName: "",
  address: "",
  phones: ["", "", ""], // phone1, phone2, phone3
  gstNo: "",
  panNo: "",
  agentName: "",
  transporter: "",
  discount: "",
};
export default function OrderFormInlineEditable() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState({});
  // editing = { rowId: '1', field: 'particular' | 'rate' | 'S' }
  const [form, setForm] = useState(initialForm);
  const [toastMsg, setToastMsg] = useState(""); // keep toast separate
  const [fieldErrors, setFieldErrors] = useState({}); // for inline error messages

  const updateForm = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    validateField(key, value);
  };

  const updatePhone = (index, value) => {
    const hasNonDigits = /[^0-9]/.test(value);
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    setForm((f) => {
      const phones = [...(f.phones || [])];
      phones[index] = sanitizedValue;
      return { ...f, phones };
    });
    if (hasNonDigits) {
      setFieldErrors((prev) => ({
        ...prev,
        [`phone${index}`]: "Numbers only",
      }));
    } else {
      validateField(`phone${index}`, sanitizedValue);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setFieldErrors({});
  };

  const validateField = (field, value) => {
    let error = "";
    if (field.startsWith("phone")) {
      const index = parseInt(field.replace("phone", ""));
      if (value && value.trim() !== "" && !/^\d{10}$/.test(value.trim())) {
        error = "Must be exactly 10 digits (numbers only)";
      }
    } else if (field === "discount") {
      const num = parseFloat(value);
      if (value && (isNaN(num) || num < 5 || num > 15)) {
        error = "Discount must be between 5 and 15";
      }
    }
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  };

  function updateCell(rowId, field, value) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        if (field === "particular") {
          return { ...r, particular: value };
        } else if (field === "rate") {
          return { ...r, rate: Number(value) || 0 };
        } else if (field === "instructions") {
          return { ...r, instructions: value };
        } else {
          return { ...r, sizes: { ...r.sizes, [field]: Number(value) || "" } };
        }
      })
    );
  }

  function deleteRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        particular: "",
        rate: 0,
        sizes: {},
        instructions: "",
      },
    ]);
  }

  function renderHeader() {
    return (
      <View style={styles.tableHeader}>
        <View style={[styles.cell, styles.colIndex]}>
          <Text style={styles.headerText}>#</Text>
        </View>
        <View style={[styles.cell, styles.colParticulars]}>
          <Text style={styles.headerText}>Particulars</Text>
        </View>
        {SIZE_KEYS.map((key) => (
          <View key={key} style={[styles.cell, styles.colSize]}>
            <Text style={styles.headerText}>{key}</Text>
          </View>
        ))}
        <View style={[styles.cell, styles.colRate]}>
          <Text style={styles.headerText}>Rate</Text>
        </View>
        <View style={[styles.cell, styles.colAmount]}>
          <Text style={styles.headerText}>Amount</Text>
        </View>
        <View style={[styles.cell, styles.colInstructions]}>
          <Text style={styles.headerText}>Instructions</Text>
        </View>
        <View style={[styles.cell, styles.colActions]}>
          <Text style={styles.headerText}>Actions</Text>
        </View>
      </View>
    );
  }

  function renderCell(row, field, widthStyle, editable = true) {
    // Make "amount" non-editable and compute it from rate * sum(sizes)
    if (field === "amount") {
      const sizesObj = row.sizes || {};
      const totalQty = Object.values(sizesObj).reduce(
        (a, b) => a + (Number(b) || 0),
        0
      );
      const amountVal = (row.rate || 0) * totalQty;
      return (
        <View style={[styles.cell, widthStyle]}>
          <Text style={styles.centerText}>
            {totalQty ? `${amountVal}` : ""}
          </Text>
        </View>
      );
    }

    const isEditing = editing.rowId === row.id && editing.field === field;
    if (isEditing) {
      return (
        <TextInput
          style={[styles.cell, widthStyle, styles.inputCell]}
          value={String(
            field === "particular"
              ? row.particular
              : field === "rate"
              ? row.rate
              : field === "instructions"
              ? row.instructions || ""
              : row.sizes[field] || ""
          )}
          onChangeText={(v) => updateCell(row.id, field, v)}
          keyboardType={
            field === "particular" || field === "instructions"
              ? "default"
              : "numeric"
          }
          onBlur={() => setEditing({})}
          autoFocus
        />
      );
    }

    // Non-editing view: instructions should show text, sizes show numbers
    return (
      <TouchableOpacity
        style={[styles.cell, widthStyle]}
        onPress={() => {
          // only allow entering edit mode when editable === true (amount is non-editable)
          if (editable) setEditing({ rowId: row.id, field });
        }}
      >
        <Text style={styles.centerText}>
          {field === "particular"
            ? row.particular || "—"
            : field === "rate"
            ? row.rate
              ? `${row.rate}`
              : "—"
            : field === "instructions"
            ? row.instructions || ""
            : row.sizes[field]
            ? row.sizes[field]
            : ""}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderRow({ item, index }) {
    return (
      <View style={styles.tableRow} key={item.id}>
        <View style={[styles.cell, styles.colIndex]}>
          <Text>{index + 1}</Text>
        </View>
        {renderCell(item, "particular", styles.colParticulars)}
        {SIZE_KEYS.map((key) => renderCell(item, key, styles.colSize))}
        {renderCell(item, "rate", styles.colRate)}
        {renderCell(item, "amount", styles.colAmount)}
        {renderCell(item, "instructions", styles.colInstructions)}
        <View style={[styles.cell, styles.colActions]}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteRow(item.id)}
          >
            <Text style={{ color: "#900" }}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function handleSave() {
    // Validation for required fields
    const requiredFields = [
      { key: "partyName", label: "Party Name" },
      { key: "address", label: "Address" },
      { key: "agentName", label: "Agent Name" },
    ];

    let missing = [];
    for (let field of requiredFields) {
      if (!form[field.key] || form[field.key].trim() === "") {
        missing.push(field.label);
      }
    }

    if (!form.phones.some((p) => p && p.trim() !== "")) {
      missing.push("Phone No.");
    }

    if (missing.length > 0) {
      Alert.alert(
        "Required Fields Missing",
        `Please fill the following fields: ${missing.join(", ")}`
      );
      return;
    }

    // Validate phone numbers
    for (let i = 0; i < form.phones.length; i++) {
      const phone = form.phones[i];
      if (phone && phone.trim() !== "" && !/^\d{10}$/.test(phone.trim())) {
        Alert.alert(
          "Invalid Phone Number",
          `Phone ${i + 1} must be exactly 10 digits (numbers only).`
        );
        return;
      }
    }

    // Check for at least one valid item
    if (rows.length === 0) {
      Alert.alert(
        "No Items",
        "Please add at least one item with particular, rate, and sizes."
      );
      return;
    }
    const hasValidItem = rows.some((row) => {
      if (!row.particular || row.particular.trim() === "") return false;
      if (!row.rate || row.rate <= 0) return false;
      const hasSize = Object.values(row.sizes || {}).some(
        (qty) => Number(qty) > 0
      );
      return hasSize;
    });
    if (!hasValidItem) {
      Alert.alert(
        "Invalid Items",
        "At least one item must have particular, rate, and at least one size quantity."
      );
      return;
    }

    // Validate discount
    if (form.discount) {
      const num = parseFloat(form.discount);
      if (isNaN(num) || num < 5 || num > 15) {
        Alert.alert("Invalid Discount", "Discount must be between 5 and 15.");
        return;
      }
    }

    // Build items with sizes array, instructions and per-item amount
    const items = rows.map((row) => {
      const sizesArr = Object.entries(row.sizes || {})
        .filter(([sizeLabel, quantity]) => Number(quantity)) // include only sizes with non-zero quantity
        .map(([sizeLabel, quantity]) => ({
          sizeLabel,
          quantity: Number(quantity) || 0,
        }));

      const totalQty = sizesArr.reduce((s, it) => s + (it.quantity || 0), 0);
      const itemAmount = (row.rate || 0) * totalQty;

      return {
        particular: row.particular,
        rate: row.rate,
        sizes: sizesArr,
        instructions: row.instructions || "",
        amount: itemAmount,
      };
    });

    const today = new Date();
    const orderData = {
      partyName: form.partyName,
      // ✅ AUTO DATE (YYYY-MM-DD)
      date: today.toISOString().split("T")[0],
      address: form.address,
      phone1: form.phones[0] || "",
      phone2: form.phones[1] || "",
      phone3: form.phones[2] || "",
      gstNo: form.gstNo,
      panNo: form.panNo,
      agentName: form.agentName,
      transporter: form.transporter,
      discount: form.discount,
      items,
      // totalAmount is the sum of all item.amount values
      totalAmount: items.reduce((sum, it) => sum + (it.amount || 0), 0),
      createdAt: new Date().toISOString(),
    };

    console.log("Order details", orderData);

    axios
      .post(`${API_BASE_URL}/orders`, orderData)
      .then((res) => {
        console.log("Saved!", "Order saved to DB.");

        // Clear the form so "Add Order" starts fresh next time
        setRows([]);
        setEditing({});
        resetForm();
        Alert.alert(
          "Success",
          `${orderData.partyName} ${res.data.orderNo} has been saved successfully!`,
          [{ text: "OK" }]
        );
        const msg = `${orderData.partyName} ${res.data.orderNo} is Saved`;
        setToastMsg(msg);
        setTimeout(() => setToastMsg(""), 3000);
      })
      .catch((err) => {
        console.log("Error", err.message);
        // Handle different types of errors
        let errorMessage = "Failed to save order. Please try again.";

        if (err.response) {
          // Server responded with error status
          if (err.response.status === 400) {
            errorMessage = "Invalid order data. Please check all fields.";
          } else if (err.response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (err.response.data && err.response.data.error) {
            errorMessage = err.response.data.error;
          }
        } else if (err.request) {
          // Network error
          errorMessage =
            "Network error. Please check your internet connection.";
        }

        Alert.alert("Error Saving Order", errorMessage, [{ text: "OK" }]);
        const errMsg = "Failed to save order. Try again.";
        setToastMsg(errMsg);
        setTimeout(() => setToastMsg(""), 3000);
      });
  }

  const isFormValid = () => {
    if (!form.partyName || form.partyName.trim() === "") return false;
    if (!form.address || form.address.trim() === "") return false;
    if (!form.agentName || form.agentName.trim() === "") return false;
    if (!form.phones.some((p) => p && p.trim() !== "")) return false;
    // Validate phone numbers: each filled phone must be 10 digits
    for (let phone of form.phones) {
      if (phone && phone.trim() !== "" && !/^\d{10}$/.test(phone.trim())) {
        return false;
      }
    }
    // Check if there is at least one item with particular, rate, and at least one size
    if (rows.length === 0) return false;
    const hasValidItem = rows.some((row) => {
      if (!row.particular || row.particular.trim() === "") return false;
      if (!row.rate || row.rate <= 0) return false;
      const hasSize = Object.values(row.sizes || {}).some(
        (qty) => Number(qty) > 0
      );
      return hasSize;
    });
    if (!hasValidItem) return false;
    return true;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        {/* 🔹 Top Header Fields */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Order Form</Text>
        </View>

        {/* Order info */}
        <View style={styles.headerSection}>
          {/* Row: Order No (left) and Date (right) */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></View>

          {/* Party Name */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Party Name:</Text>
            <TextInput
              style={[styles.infoInput, { width: 120 }]}
              value={form.partyName}
              onChangeText={(v) => updateForm("partyName", v)}
            />
          </View>

          {/* Address */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Address:</Text>
            <TextInput
              style={[
                styles.infoInput,
                { height: 80, textAlignVertical: "top" },
              ]}
              value={form.address}
              onChangeText={(v) => updateForm("address", v)}
              multiline
            />
          </View>

          {/* Phones */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={styles.label}>Phone 1:</Text>
              <TextInput
                style={styles.infoInput}
                value={form.phones[0]}
                onChangeText={(v) => updatePhone(0, v)}
                keyboardType="phone-pad"
              />
              {fieldErrors.phone0 && (
                <Text style={styles.errorText}>{fieldErrors.phone0}</Text>
              )}
            </View>
            <View style={{ flex: 1, marginHorizontal: 6 }}>
              <Text style={styles.label}>Phone 2:</Text>
              <TextInput
                style={styles.infoInput}
                value={form.phones[1]}
                onChangeText={(v) => updatePhone(1, v)}
                keyboardType="phone-pad"
              />
              {fieldErrors.phone1 && (
                <Text style={styles.errorText}>{fieldErrors.phone1}</Text>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.label}>Phone 3:</Text>
              <TextInput
                style={styles.infoInput}
                value={form.phones[2]}
                onChangeText={(v) => updatePhone(2, v)}
                keyboardType="phone-pad"
              />
              {fieldErrors.phone2 && (
                <Text style={styles.errorText}>{fieldErrors.phone2}</Text>
              )}
            </View>
          </View>

          {/* GST / PAN */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>GST No.:</Text>
              <TextInput
                style={styles.infoInput}
                value={form.gstNo}
                onChangeText={(v) => updateForm("gstNo", v)}
                placeholder="GST No."
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>PAN No.:</Text>
              <TextInput
                style={styles.infoInput}
                value={form.panNo}
                onChangeText={(v) => updateForm("panNo", v)}
                placeholder="PAN No."
              />
            </View>
          </View>

          {/* Agent / Transporter */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Agent Name:</Text>
              <TextInput
                style={styles.infoInput}
                value={form.agentName}
                onChangeText={(v) => updateForm("agentName", v)}
                placeholder="Agent Name"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Transporter:</Text>
              <TextInput
                style={styles.infoInput}
                value={form.transporter}
                onChangeText={(v) => updateForm("transporter", v)}
                placeholder="Transporter"
              />
            </View>
          </View>

          {/* Discount */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Discount:</Text>
            <TextInput
              style={[styles.infoInput, { width: 140 }]}
              value={form.discount}
              onChangeText={(v) => updateForm("discount", v)}
              keyboardType="numeric"
              placeholder="Discount"
            />
            {fieldErrors.discount && (
              <Text style={styles.errorText}>{fieldErrors.discount}</Text>
            )}
          </View>
        </View>

        {/* 🔹 Table Section */}
        <ScrollView horizontal style={styles.tableWrapper}>
          <View>
            {renderHeader()}
            <FlatList
              data={rows}
              keyExtractor={(r) => r.id}
              renderItem={renderRow}
              ListFooterComponent={() => (
                <View style={styles.footerRow}>
                  <TouchableOpacity style={styles.addRowBtn} onPress={addRow}>
                    <Text style={styles.addRowText}>+ Add Row</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={[styles.saveBtn, !isFormValid() && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!isFormValid()}
        >
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Toast popup (top, width adapts to message up to maxWidth) */}
      {toastMsg ? (
        <View style={styles.toastWrapper}>
          <View style={styles.toastBox}>
            <Text style={styles.toastText}>{toastMsg}</Text>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  headerSection: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
  },
  label: {
    marginRight: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    width: 100, // Adjust width as needed
    borderRadius: 5,
  },
  infoInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
  },

  tableWrapper: {
    flex: 1,
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f6f6f6",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    minHeight: 50,
  },
  cell: {
    paddingHorizontal: 6,
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#eee",
    minHeight: 50,
  },
  inputCell: { backgroundColor: "#eef", padding: 0, textAlign: "center" },

  colIndex: { width: 40, alignItems: "center" },
  colParticulars: { width: 180 },
  colSize: { width: 60, alignItems: "center" },
  colRate: { width: 90, alignItems: "center" },
  colAmount: { width: 90, alignItems: "center" },
  colInstructions: { width: 90, alignItems: "center" },
  colActions: { width: 80, alignItems: "center", justifyContent: "center" },

  headerText: { fontWeight: "700" },
  centerText: { textAlign: "center" },

  footerRow: { padding: 12, alignItems: "center" },
  addRowBtn: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  addRowText: { fontWeight: "700" },

  deleteBtn: {
    borderWidth: 1,
    borderColor: "#f4c9c9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  saveBtn: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    marginTop: 10,
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  saveBtnDisabled: {
    backgroundColor: "#ccc",
  },

  toastWrapper: {
    position: "absolute",
    top: 24,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center", // center the toast horizontally
    paddingHorizontal: 12,
  },
  toastBox: {
    backgroundColor: "rgba(223, 37, 37, 0.85)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    maxWidth: "85%", // cap width; longer messages will wrap
    minWidth: 80, // keep a minimum width
  },
  toastText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "left",
    lineHeight: 18,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 12,
    marginTop: 2,
  },
});
