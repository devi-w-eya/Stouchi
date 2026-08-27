import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/store";
import { ThemeProvider } from "../src/context/ThemeContext";
import { PersistenceGate } from "../src/components/PersistenceGate";  // ← NEW import

export default function RootLayout() {
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