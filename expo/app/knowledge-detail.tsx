import React, { useMemo, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThumbsUp, BookmarkCheck, Bookmark, ArrowLeft, User, Clock, Wrench } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/providers/AppProvider";
import type { KnowledgeEntry } from "@/types";

const diffColors: Record<string, string> = { easy: Colors.success, moderate: Colors.warning, advanced: Colors.danger };

export default function KnowledgeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, bookmarks, toggleBookmark, upvoteEntry } = useApp();
  const entry = useMemo(() => entries.find((e) => e.id === id), [entries, id]);
  const isBookmarked = useMemo(() => (id ? bookmarks.includes(id) : false), [bookmarks, id]);
  const handleBookmark = useCallback(() => { if (!id) return; Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleBookmark(id); }, [id, toggleBookmark]);
  const handleUpvote = useCallback(() => { if (!id) return; Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); upvoteEntry(id); }, [id, upvoteEntry]);
  if (!entry) return (<View style={styles.notFound}><Text style={styles.notFoundText}>Entry not found</Text><TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ArrowLeft size={18} color={Colors.white} /><Text style={styles.backText}>Go back</Text></TouchableOpacity></View>);
  const dc = diffColors[entry.difficulty] ?? Colors.textMuted;
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View style={[styles.diffBadge, { backgroundColor: dc + "1A" }]}><Text style={[styles.diffText, { color: dc }]}>{entry.difficulty}</Text></View><TouchableOpacity onPress={handleBookmark} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>{isBookmarked ? <BookmarkCheck size={22} color={Colors.accent} /> : <Bookmark size={22} color={Colors.textMuted} />}</TouchableOpacity></View>
      <Text style={styles.title}>{entry.title}</Text><Text style={styles.desc}>{entry.description}</Text>
      <View style={styles.metaRow}><Wrench size={14} color={Colors.textMuted} /><Text style={styles.metaText}>{entry.equipment}</Text></View>
      <View style={styles.authorCard}><View style={styles.authorAvatar}><User size={18} color={Colors.textSecondary} /></View><View style={styles.authorInfo}><Text style={styles.authorName}>{entry.authorName}</Text><Text style={styles.authorRole}>{entry.authorRole}</Text></View><View style={styles.expBadge}><Clock size={12} color={Colors.textMuted} /><Text style={styles.expText}>{entry.yearsExperience}yr exp</Text></View></View>
      <View style={styles.section}><Text style={styles.sectionTitle}>Symptoms</Text>{entry.symptoms.map((s, i) => (<View key={i} style={styles.symptomRow}><View style={styles.symptomDot} /><Text style={styles.symptomText}>{s}</Text></View>))}</View>
      <View style={styles.section}><Text style={styles.sectionTitle}>Solution</Text><View style={styles.solutionCard}><Text style={styles.solutionText}>{entry.solution}</Text></View></View>
      <TouchableOpacity style={styles.upvoteBtn} onPress={handleUpvote} activeOpacity={0.7}><ThumbsUp size={18} color={Colors.accent} /><Text style={styles.upvoteText}>Helpful ({entry.upvotes})</Text></TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background }, content: { paddingHorizontal: 16, paddingTop: 16 },
  notFound: { flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center", gap: 16 },
  notFoundText: { fontSize: 17, color: Colors.textSecondary },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: Colors.accent, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  backText: { fontSize: 15, fontWeight: "600" as const, color: Colors.white },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  diffBadge: { borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10 },
  diffText: { fontSize: 12, fontWeight: "700" as const, textTransform: "uppercase" as const, letterSpacing: 0.5 },
  title: { fontSize: 22, fontWeight: "700" as const, color: Colors.text, lineHeight: 30, marginBottom: 10 },
  desc: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 16 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  metaText: { fontSize: 14, color: Colors.textSecondary, fontWeight: "500" as const },
  authorCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 24, gap: 12 },
  authorAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceLight, alignItems: "center", justifyContent: "center" },
  authorInfo: { flex: 1 }, authorName: { fontSize: 15, fontWeight: "600" as const, color: Colors.text },
  authorRole: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  expBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: Colors.surfaceLight, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  expText: { fontSize: 11, color: Colors.textMuted, fontWeight: "600" as const },
  section: { marginBottom: 24 }, sectionTitle: { fontSize: 13, fontWeight: "700" as const, color: Colors.textMuted, textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 12 },
  symptomRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  symptomDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent, marginTop: 7 },
  symptomText: { flex: 1, fontSize: 15, color: Colors.text, lineHeight: 22 },
  solutionCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 3, borderLeftColor: Colors.accent },
  solutionText: { fontSize: 15, color: Colors.text, lineHeight: 24 },
  upvoteBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: Colors.accentDim, borderWidth: 1, borderColor: Colors.accentDimBorder, borderRadius: 14, paddingVertical: 14 },
  upvoteText: { fontSize: 15, fontWeight: "600" as const, color: Colors.accent },
});
