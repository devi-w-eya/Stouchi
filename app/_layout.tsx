import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/store";
import { ThemeProvider } from "../src/context/ThemeContext";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </Provider>
  );
}