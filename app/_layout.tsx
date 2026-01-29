import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="add-order"
        options={{
          title: "Add Order",
          drawerLabel: "Add Order",
        }}
      />
      <Drawer.Screen
        name="list-orders-by-order-id"
        options={{
          title: "List Orders By Order Id",
          drawerLabel: "List Orders By Order Id",
        }}
      />
      <Drawer.Screen
        name="list-orders-by-order-date"
        options={{
          title: "List Orders By Order Date",
          drawerLabel: "List Orders By Order Date",
        }}
      />

      <Drawer.Screen
        name="list-orders-by-particular-and-date"
        options={{
          title: "List Orders By Particular and Date",
          drawerLabel: "List Orders By Particular and Date",
        }}
      />

      {/* HIDDEN ROUTES (not shown in drawer) */}
      <Drawer.Screen
        name="hidden/party-order-list"
        options={{
          drawerItemStyle: { display: "none" }, // HIDE FROM DRAWER
        }}
      />

      <Drawer.Screen
        name="hidden/view-order/[orderNo]"
        options={{
          drawerItemStyle: { display: "none" }, // HIDE FROM DRAWER
        }}
      />
    </Drawer>
  );
}
