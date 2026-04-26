import React, { useState, useRef, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Send, Wrench, AlertTriangle, Lightbulb } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { ChatMessage } from "@/types";

const quickPrompts = [
  { label: "Motor won't start", icon: AlertTriangle },
  { label: "Unusual vibration", icon: Wrench },
  { label: "Leak detection tips", icon: Lightbulb },
];

const mockResponses: Record<string, string> = {
  default: "I'm your FixIQ troubleshooting assistant. Tell me:\n\u2022 What equipment?\n\u2022 What symptoms?\n\u2022 Any fault codes?\n\nThe more detail, the faster we fix it.",
  motor: "Motor Won't Start:\n\n1. Check power supply \u2014 All 3 phases present?\n2. Check overloads \u2014 Tripped thermal overload? Reset.\n3. Listen for hum:\n   \u2022 Single phase (check fuses)\n   \u2022 Seized bearing (rotate by hand)\n   \u2022 Locked rotor (jam downstream)\n4. Check starter contacts \u2014 Pitted = no start\n5. Megger the motor \u2014 <1M\u03A9 = grounded windings\n\nWhat's your situation?",
  vibration: "Vibration Diagnosis:\n\n1. Type:\n   \u2022 Rhythmic = imbalance/misalignment\n   \u2022 Random = bearing failure\n   \u2022 Pulsing = electrical\n2. Bearing check: screwdriver on housing, ear to handle\n3. Misalignment: hot coupling guard\n4. Loose foundation: check anchor bolts\n5. Soft foot: loosen one bolt at a time\n\nWhat equipment?",
  leak: "Leak Detection:\n\n1. Air: ultrasonic detector or soapy water\n2. Hydraulic: NEVER bare hands! Use cardboard + UV dye\n3. Refrigerant: electronic detector at joints\n4. Water/steam: IR thermometer for hot spots\n\nWhat system?",
};

function getResponse(msg: string): string {
  const l = msg.toLowerCase();
  if (l.includes("motor") || l.includes("start")) return mockResponses.motor;
  if (l.includes("vibrat") || l.includes("shak") || l.includes("noise")) return mockResponses.vibration;
  if (l.includes("leak") || l.includes("drip")) return mockResponses.leak;
  return mockResponses.default;
}

export default function TroubleshootScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "Hey \u2014 I'm your FixIQ assistant. What's the issue? Describe it and I'll walk you through.", timestamp: Date.now() },
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    setMessages((p) => [...p, { id: `u-${Date.now()}`, role: "user", content: text.trim(), timestamp: Date.now() }]);
    setInput("");
    setIsTyping(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setMessages((p) => [...p, { id: `b-${Date.now()}`, role: "assistant", content: getResponse(text), timestamp: Date.now() }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  }, []);

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && <View style={styles.botTag}><Wrench size={12} color={Colors.accent} /><Text style={styles.botLabel}>FixIQ</Text></View>}
        <Text style={[styles.msgText, isUser ? styles.userText : styles.aiText]}>{item.content}</Text>
      </View>
    );
  }, []);

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {isTyping && (
              <View style={[styles.bubble, styles.aiBubble]}>
                <View style={styles.botTag}><Wrench size={12} color={Colors.accent} /><Text style={styles.botLabel}>FixIQ</Text></View>
                <View style={styles.typingRow}><ActivityIndicator size="small" color={Colors.accent} /><Text style={styles.typingText}>Diagnosing...</Text></View>
              </View>
            )}
            {messages.length <= 1 && (
              <View style={styles.quickWrap}>
                <Text style={styles.quickTitle}>Quick start:</Text>
                {quickPrompts.map((p) => (
                  <TouchableOpacity key={p.label} style={styles.quickBtn} onPress={() => sendMessage(p.label)} activeOpacity={0.7} testID={`qp-${p.label}`}>
                    <p.icon size={16} color={Colors.accent} />
                    <Text style={styles.quickText}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        }
      />
      <View style={styles.inputWrap}>
        <View style={styles.inputRow}>
          <TextInput style={styles.textInput} value={input} onChangeText={setInput} placeholder="Describe the issue..." placeholderTextColor={Colors.textMuted} multiline maxLength={500} testID="chat-input" />
          <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendDisabled]} onPress={() => sendMessage(input)} disabled={!input.trim() || isTyping} activeOpacity={0.7} testID="send-btn">
            <Send size={20} color={input.trim() ? Colors.white : Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  bubble: { maxWidth: "85%", marginBottom: 12, borderRadius: 16, padding: 14 },
  userBubble: { alignSelf: "flex-end", backgroundColor: Colors.accent, borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: "flex-start", backgroundColor: Colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.border },
  botTag: { flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 5 },
  botLabel: { fontSize: 11, fontWeight: "700" as const, color: Colors.accent, textTransform: "uppercase" as const, letterSpacing: 0.5 },
  msgText: { fontSize: 15, lineHeight: 22 },
  userText: { color: Colors.white },
  aiText: { color: Colors.text },
  typingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  typingText: { fontSize: 14, color: Colors.textSecondary, fontStyle: "italic" as const },
  quickWrap: { marginTop: 8, gap: 8 },
  quickTitle: { fontSize: 13, color: Colors.textMuted, fontWeight: "600" as const, marginBottom: 4 },
  quickBtn: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.accentDimBorder, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16 },
  quickText: { fontSize: 15, color: Colors.text, fontWeight: "500" as const },
  inputWrap: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  textInput: { flex: 1, backgroundColor: Colors.surfaceLight, borderRadius: 20, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 12, fontSize: 15, color: Colors.text, maxHeight: 100, borderWidth: 1, borderColor: Colors.border },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.accent, alignItems: "center", justifyContent: "center" },
  sendDisabled: { backgroundColor: Colors.surfaceLight },
});
