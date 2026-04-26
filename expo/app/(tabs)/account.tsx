import React, { useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ChevronRight, Crown, BookOpen, Clock, Award, Settings, HelpCircle, LogOut, Shield } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/providers/AppProvider";
import type { SubscriptionTier } from "@/types";

const tierNames: Record<string, string> = { technician: "Technician", lead: "Lead", management: "Management" };

export default function AccountScreen() {
  const { profile } = useApp();
  const goPlans = useCallback(() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/subscription"); }, []);
  const tc = Colors.tier[profile.tier] ?? Colors.accent;
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profCard}>
        <View style={[styles.avatar, { borderColor: tc }]}><Text style={styles.avatarText}>{profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}</Text></View>
        <Text style={styles.profName}>{profile.name}</Text><Text style={styles.profRole}>{profile.role}</Text>
        <View style={[styles.tierBadge, { backgroundColor: tc + "1A" }]}><Crown size={14} color={tc} /><Text style={[styles.tierText, { color: tc }]}>{tierNames[profile.tier]} Plan</Text></View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}><Clock size={18} color={Colors.info} /><Text style={styles.statVal}>{profile.yearsExperience}</Text><Text style={styles.statLbl}>Years Exp.</Text></View>
        <View style={styles.stat}><BookOpen size={18} color={Colors.success} /><Text style={styles.statVal}>{profile.contributionCount}</Text><Text style={styles.statLbl}>Entries</Text></View>
        <View style={styles.stat}><Award size={18} color={Colors.accent} /><Text style={styles.statVal}>{profile.specialties.length}</Text><Text style={styles.statLbl}>Specialties</Text></View>
      </View>
      <View style={styles.specSec}><Text style={styles.secTitle}>Specialties</Text><View style={styles.specRow}>{profile.specialties.map((s) => (<View key={s} style={styles.specChip}><Text style={styles.specText}>{s}</Text></View>))}</View></View>
      <TouchableOpacity style={styles.planCard} onPress={goPlans} activeOpacity={0.7} testID="upgrade-btn">
        <View style={styles.planLeft}><Shield size={22} color={Colors.accent} /><View style={styles.planTextW}><Text style={styles.planTitle}>Subscription Plans</Text><Text style={styles.planSub}>View plans & manage subscription</Text></View></View>
        <ChevronRight size={20} color={Colors.textMuted} />
      </TouchableOpacity>
      <View style={styles.menuSec}><Text style={styles.secTitle}>Settings</Text><View style={styles.menuGrp}>
        <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}><Settings size={20} color={Colors.textSecondary} /><Text style={styles.menuText}>App Settings</Text><ChevronRight size={18} color={Colors.textMuted} /></TouchableOpacity>
        <View style={styles.menuDiv} /><TouchableOpacity style={styles.menuRow} activeOpacity={0.7}><HelpCircle size={20} color={Colors.textSecondary} /><Text style={styles.menuText}>Help & Support</Text><ChevronRight size={18} color={Colors.textMuted} /></TouchableOpacity>
        <View style={styles.menuDiv} /><TouchableOpacity style={styles.menuRow} activeOpacity={0.7}><LogOut size={20} color={Colors.danger} /><Text style={[styles.menuText, { color: Colors.danger }]}>Sign Out</Text><ChevronRight size={18} color={Colors.textMuted} /></TouchableOpacity>
      </View></View>
      <Text style={styles.ver}>FixIQ v1.0.0</Text><View style={{ height: 40 }} />
    </ScrollView>);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background }, content: { paddingHorizontal: 16, paddingTop: 20 },
  profCard: { alignItems: "center", backgroundColor: Colors.surface, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.surfaceLight, alignItems: "center", justifyContent: "center", borderWidth: 3, marginBottom: 12 },
  avatarText: { fontSize: 24, fontWeight: "700" as const, color: Colors.text },
  profName: { fontSize: 20, fontWeight: "700" as const, color: Colors.text, marginBottom: 4 }, profRole: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  tierBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  tierText: { fontSize: 13, fontWeight: "700" as const, textTransform: "uppercase" as const, letterSpacing: 0.5 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  stat: { flex: 1, alignItems: "center", backgroundColor: Colors.surface, borderRadius: 14, padding: 16, gap: 6, borderWidth: 1, borderColor: Colors.border },
  statVal: { fontSize: 22, fontWeight: "700" as const, color: Colors.text }, statLbl: { fontSize: 11, fontWeight: "600" as const, color: Colors.textMuted, textTransform: "uppercase" as const, letterSpacing: 0.3 },
  specSec: { marginBottom: 16 }, secTitle: { fontSize: 13, fontWeight: "700" as const, color: Colors.textMuted, textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 10 },
  specRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, specChip: { backgroundColor: Colors.surfaceLight, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  specText: { fontSize: 13, fontWeight: "600" as const, color: Colors.text },
  planCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: Colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.accentDimBorder, marginBottom: 20 },
  planLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 }, planTextW: { flex: 1 },
  planTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text }, planSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  menuSec: { marginBottom: 20 }, menuGrp: { backgroundColor: Colors.surface, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 16, paddingHorizontal: 16 },
  menuDiv: { height: 1, backgroundColor: Colors.border, marginLeft: 50 }, menuText: { flex: 1, fontSize: 15, fontWeight: "500" as const, color: Colors.text },
  ver: { textAlign: "center", fontSize: 12, color: Colors.textMuted, marginBottom: 8 },
});
