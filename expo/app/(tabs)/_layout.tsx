import React from "react";
import { Tabs } from "expo-router";
import { MessageCircle, BookOpen, PenTool, User } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function TabLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: "700" as const },
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border, borderTopWidth: 1 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" as const },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Troubleshoot", tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} /> }} />
      <Tabs.Screen name="knowledge" options={{ title: "Knowledge", tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} /> }} />
      <Tabs.Screen name="capture" options={{ title: "Capture", tabBarIcon: ({ color, size }) => <PenTool size={size} color={color} /> }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }} />
    </Tabs>
  );
}
