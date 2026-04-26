import React, { useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { Check, Crown } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/providers/AppProvider";
import { subscriptionPlans } from "@/mocks/knowledge";
import type { SubscriptionTier } from "@/types";

export default function SubscriptionScreen() {
  const { profile, setTier } = useApp();
  const handleSelectPlan = useCallback((planId: SubscriptionTier) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (planId === profile.tier) { Alert.alert("Current Plan", "You are already on this plan."); return; }
    Alert.alert("Switch Plan", `Switch to ${planId.charAt(0).toUpperCase() + planId.slice(1)}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: () => { setTier(planId); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); Alert.alert("Updated", "Subscription updated.", [{ text: "OK", onPress: () => router.back() }]); } },
    ]);
  }, [profile.tier, setTier]);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Choose your plan</Text><Text style={styles.subheading}>Unlock more features for your team</Text>
      {subscriptionPlans.map((plan) => {
        const isCurrent = profile.tier === plan.id; const tierColor = Colors.tier[plan.id] ?? Colors.accent;
        return (
          <View key={plan.id} style={[styles.planCard, plan.highlighted && styles.planHighlighted, isCurrent && { borderColor: tierColor }]}>
            {plan.highlighted && (<View style={[styles.popularBadge, { backgroundColor: tierColor }]}><Crown size={12} color={Colors.white} /><Text style={styles.popularText}>Most Popular</Text></View>)}
            <View style={styles.planHeader}><Text style={styles.planName}>{plan.name}</Text><View style={styles.priceRow}><Text style={[styles.planPrice, { color: tierColor }]}>{plan.price}</Text><Text style={styles.planPeriod}>{plan.period}</Text></View></View>
            <View style={styles.featuresList}>{plan.features.map((feature, i) => (<View key={i} style={styles.featureRow}><Check size={16} color={tierColor} /><Text style={styles.featureText}>{feature}</Text></View>))}</View>
            <TouchableOpacity style={[styles.selectBtn, isCurrent ? { backgroundColor: Colors.surfaceLight } : { backgroundColor: tierColor }]} onPress={() => handleSelectPlan(plan.id)} activeOpacity={0.7} testID={`plan-${plan.id}`}><Text style={[styles.selectText, isCurrent && { color: Colors.textMuted }]}>{isCurrent ? "Current Plan" : "Select Plan"}</Text></TouchableOpacity>
          </View>);
      })}
      <View style={{ height: 40 }} />
    </ScrollView>);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface }, content: { paddingHorizontal: 16, paddingTop: 20 },
  heading: { fontSize: 24, fontWeight: "700" as const, color: Colors.text, marginBottom: 6 },
  subheading: { fontSize: 15, color: Colors.textSecondary, marginBottom: 24 },
  planCard: { backgroundColor: Colors.background, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: Colors.border, overflow: "hidden" },
  planHighlighted: { borderColor: Colors.accent },
  popularBadge: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, marginBottom: 12 },
  popularText: { fontSize: 11, fontWeight: "700" as const, color: Colors.white, textTransform: "uppercase" as const, letterSpacing: 0.5 },
  planHeader: { marginBottom: 16 }, planName: { fontSize: 20, fontWeight: "700" as const, color: Colors.text, marginBottom: 4 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  planPrice: { fontSize: 28, fontWeight: "800" as const }, planPeriod: { fontSize: 14, color: Colors.textMuted },
  featuresList: { gap: 10, marginBottom: 20 }, featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureText: { fontSize: 14, color: Colors.text, flex: 1, lineHeight: 20 },
  selectBtn: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  selectText: { fontSize: 16, fontWeight: "700" as const, color: Colors.white },
});
