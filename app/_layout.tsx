import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer>
      <Drawer initialRouteName="add-order" />

      <Drawer
        screenOptions={{
          headerShown: true, // 👈 REQUIRED for web
          headerTitle: "RR Dresses", // 👈 forces header height
          headerLeft: () => <DrawerToggleButton />,
          headerStyle: {
            height: 56, // 👈 forces visible header
          },
        }}
      />
      {/* HIDE ROOT INDEX ROUTE */}
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: "none" },
          title: "",
        }}
      />

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
