import * as React from "react";
import { createContext, useCallback, useContext } from "react";
import { ExtensionStorage } from "@bacons/apple-targets";
import { Platform } from "react-native";

// Initialize storage with your group ID
const appGroupId = process.env.EXPO_PUBLIC_APP_GROUP_ID;
const storage =
  Platform.OS === "ios" && appGroupId ? new ExtensionStorage(appGroupId) : null;

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  // Update widget state whenever what we want to show changes
  React.useEffect(() => {
    // set widget_state to null if we want to reset the widget
    // storage.set("widget_state", null);

    // Refresh widget
    if (Platform.OS === "ios") {
      ExtensionStorage.reloadWidget();
    }
  }, []);

  const refreshWidget = useCallback(() => {
    if (Platform.OS === "ios") {
      ExtensionStorage.reloadWidget();
    }
  }, []);

  return (
    <WidgetContext.Provider value={{ refreshWidget }}>
      {children}
    </WidgetContext.Provider>
  );
}

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
