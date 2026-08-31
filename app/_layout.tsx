import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/store";
import { ThemeProvider } from "../src/context/ThemeContext";
import { PersistenceGate } from "../src/components/PersistenceGate";  
import { useEffect } from "react";
import { requestNotificationPermissions } from "../src/services/notifications";

export default function RootLayout() {
  useEffect(() => {
    requestNotificationPermissions();
  }, []);
  return (
    <Provider store={store}>
      <ThemeProvider>
        <PersistenceGate>
        <Stack screenOptions={{ headerShown: false }} />
        </PersistenceGate>
      </ThemeProvider>
    </Provider>
  );
}