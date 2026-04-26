import React, { useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Save, Plus, X, CheckCircle, AlertCircle } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/providers/AppProvider";
import { KnowledgeEntry } from "@/types";
import { categories } from "@/mocks/knowledge";
const RESET_DELAY = 2500;

type Diff = "easy" | "moderate" | "advanced";

export default function CaptureScreen() {
  const { addEntry, profile } = useApp();
  const [title, setTitle] = useState(""); const [equip, setEquip] = useState(""); const [desc, setDesc] = useState(""); const [sol, setSol] = useState("");
  const [cat, setCat] = useState(""); const [diff, setDiff] = useState<Diff>("moderate"); const [symIn, setSymIn] = useState(""); const [syms, setSyms] = useState<string[]>([]); const [done, setDone] = useState(false);
  const addSym = useCallback(() => { if (symIn.trim()) { setSyms((p) => [...p, symIn.trim()]); setSymIn(""); } }, [symIn]);
  const rmSym = useCallback((i: number) => { setSyms((p) => p.filter((_, x) => x !== i)); }, []);
  const ok = title.trim() && equip.trim() && desc.trim() && sol.trim() && cat && syms.length > 0;
  const submit = useCallback(() => {
    if (!ok) { Alert.alert("Missing Info", "Fill all fields + add symptom."); return; }
    const e: KnowledgeEntry = { id: `e-${Date.now()}`, title: title.trim(), equipment: equip.trim(), description: desc.trim(), solution: sol.trim(), category: cat, difficulty: diff, symptoms: syms, authorName: profile.name, authorRole: profile.role, yearsExperience: profile.yearsExperience, createdAt: Date.now(), upvotes: 0 };
    addEntry(e); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setDone(true);
    setTimeout(() => { setTitle(""); setEquip(""); setDesc(""); setSol(""); setCat(""); setDiff("moderate"); setSyms([]); setDone(false); }, 2500);
  }, [ok, title, equip, desc, sol, cat, diff, syms, profile, addEntry]);
  if (done) return (<View style={styles.successWrap}><CheckCircle size={56} color={Colors.success} /><Text style={styles.successTitle}>Knowledge Captured!</Text><Text style={styles.successSub}>Saved and will help the next tech.</Text></View>);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.banner}><AlertCircle size={18} color={Colors.accent} /><Text style={styles.bannerText}>Share what you know {"\u2014"} your experience helps the next tech.</Text></View>
      <View style={styles.sec}><Text style={styles.lbl}>Title *</Text><TextInput style={styles.inp} value={title} onChangeText={setTitle} placeholder="e.g., VFD Fault Code F0001" placeholderTextColor={Colors.textMuted} testID="cap-title" /></View>
      <View style={styles.sec}><Text style={styles.lbl}>Equipment *</Text><TextInput style={styles.inp} value={equip} onChangeText={setEquip} placeholder="e.g., Allen-Bradley PowerFlex 525" placeholderTextColor={Colors.textMuted} /></View>
      <View style={styles.sec}><Text style={styles.lbl}>Category *</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>{categories.map((c) => (<TouchableOpacity key={c.id} style={[styles.chip, cat === c.id && styles.chipOn]} onPress={() => setCat(c.id)}><Text style={[styles.chipText, cat === c.id && styles.chipTextOn]}>{c.name}</Text></TouchableOpacity>))}</ScrollView></View>
      <View style={styles.sec}><Text style={styles.lbl}>Difficulty *</Text><View style={styles.diffRow}>{(["easy", "moderate", "advanced"] as Diff[]).map((d) => (<TouchableOpacity key={d} style={[styles.diffChip, diff === d && styles.diffOn, diff === d && { borderColor: d === "easy" ? Colors.success : d === "moderate" ? Colors.warning : Colors.danger }]} onPress={() => setDiff(d)}><Text style={[styles.diffChipText, diff === d && { color: d === "easy" ? Colors.success : d === "moderate" ? Colors.warning : Colors.danger }]}>{d}</Text></TouchableOpacity>))}</View></View>
      <View style={styles.sec}><Text style={styles.lbl}>Description *</Text><TextInput style={[styles.inp, styles.multi]} value={desc} onChangeText={setDesc} placeholder="When does this occur..." placeholderTextColor={Colors.textMuted} multiline textAlignVertical="top" /></View>
      <View style={styles.sec}><Text style={styles.lbl}>Symptoms * ({syms.length})</Text><View style={styles.symRow}><TextInput style={[styles.inp, styles.symIn]} value={symIn} onChangeText={setSymIn} placeholder="Add symptom..." placeholderTextColor={Colors.textMuted} onSubmitEditing={addSym} returnKeyType="done" /><TouchableOpacity style={[styles.addBtn, !symIn.trim() && styles.addOff]} onPress={addSym} disabled={!symIn.trim()}><Plus size={20} color={symIn.trim() ? Colors.white : Colors.textMuted} /></TouchableOpacity></View>{syms.length > 0 && <View style={styles.tags}>{syms.map((s, i) => (<View key={`${s}-${i}`} style={styles.tag}><Text style={styles.tagText}>{s}</Text><TouchableOpacity onPress={() => rmSym(i)}><X size={14} color={Colors.textSecondary} /></TouchableOpacity></View>))}</View>}</View>
      <View style={styles.sec}><Text style={styles.lbl}>Solution *</Text><TextInput style={[styles.inp, styles.solIn]} value={sol} onChangeText={setSol} placeholder="Step-by-step fix..." placeholderTextColor={Colors.textMuted} multiline textAlignVertical="top" /></View>
      <TouchableOpacity style={[styles.submitBtn, !ok && styles.submitOff]} onPress={submit} disabled={!ok} activeOpacity={0.7}><Save size={20} color={ok ? Colors.white : Colors.textMuted} /><Text style={[styles.submitText, !ok && styles.submitTextOff]}>Save Knowledge</Text></TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background }, content: { paddingHorizontal: 16, paddingTop: 12 },
  banner: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: Colors.accentDim, borderWidth: 1, borderColor: Colors.accentDimBorder, borderRadius: 12, padding: 14, marginBottom: 20 },
  bannerText: { flex: 1, fontSize: 14, color: Colors.accentLight, fontWeight: "500" as const, lineHeight: 20 },
  sec: { marginBottom: 20 }, lbl: { fontSize: 13, fontWeight: "700" as const, color: Colors.textSecondary, textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 8 },
  inp: { backgroundColor: Colors.surface, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  multi: { minHeight: 80, paddingTop: 14 }, solIn: { minHeight: 140, paddingTop: 14 }, chipRow: { gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  chipOn: { backgroundColor: Colors.accentDim, borderColor: Colors.accentDimBorder },
  chipText: { fontSize: 13, fontWeight: "600" as const, color: Colors.textSecondary }, chipTextOn: { color: Colors.accent },
  diffRow: { flexDirection: "row", gap: 10 }, diffChip: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: "center" },
  diffOn: { backgroundColor: Colors.surfaceLight }, diffChipText: { fontSize: 13, fontWeight: "700" as const, color: Colors.textMuted, textTransform: "capitalize" as const },
  symRow: { flexDirection: "row", gap: 10 }, symIn: { flex: 1 },
  addBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.accent, alignItems: "center", justifyContent: "center" }, addOff: { backgroundColor: Colors.surfaceLight },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  tag: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.surfaceLight, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 }, tagText: { fontSize: 13, color: Colors.text },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: Colors.accent, borderRadius: 14, paddingVertical: 16, marginTop: 8 },
  submitOff: { backgroundColor: Colors.surfaceLight }, submitText: { fontSize: 16, fontWeight: "700" as const, color: Colors.white }, submitTextOff: { color: Colors.textMuted },
  successWrap: { flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 16 },
  successTitle: { fontSize: 22, fontWeight: "700" as const, color: Colors.text }, successSub: { fontSize: 15, color: Colors.textSecondary, textAlign: "center", lineHeight: 22 },
});
