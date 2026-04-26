import React, { useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import type { ListRenderItemInfo } from "react-native";
import { Search, ChevronRight, ThumbsUp, BookmarkCheck, Bookmark, Wind, Zap, Droplets, Gauge, Fan, Cog, ArrowRightLeft, CircleGauge } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/providers/AppProvider";
import { categories } from "@/mocks/knowledge";
import { KnowledgeEntry } from "@/types";

const iconMap: Record<string, React.ComponentType<{ size: number; color: string }>> = { Wind, Zap, Droplets, Gauge, Fan, Cog, ArrowRightLeft, CircleGauge };
const diffColors: Record<string, string> = { easy: Colors.success, moderate: Colors.warning, advanced: Colors.danger };

export default function KnowledgeScreen() {
  const { entries, bookmarks, toggleBookmark } = useApp();
  const [search, setSearch] = useState<string>("");
  const [selCat, setSelCat] = useState<string | null>(null);
  const filtered = useMemo(() => {
    let r = entries;
    if (selCat) r = r.filter((e) => e.category === selCat);
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter((e) => e.title.toLowerCase().includes(q) || e.equipment.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.symptoms.some((s) => s.toLowerCase().includes(q))); }
    return r.sort((a, b) => b.upvotes - a.upvotes);
  }, [entries, selCat, search]);
  const onBookmark = useCallback((id: string) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleBookmark(id); }, [toggleBookmark]);
  const onEntry = useCallback((e: KnowledgeEntry) => { router.push({ pathname: "/knowledge-detail", params: { id: e.id } }); }, []);
  const renderChip = useCallback(({ item }: { item: (typeof categories)[0] }) => {
    const sel = selCat === item.id; const IC = iconMap[item.icon];
    return (<TouchableOpacity style={[styles.chip, sel && styles.chipOn]} onPress={() => setSelCat(sel ? null : item.id)} activeOpacity={0.7}>{IC && <IC size={14} color={sel ? Colors.accent : Colors.textSecondary} />}<Text style={[styles.chipText, sel && styles.chipTextOn]}>{item.name}</Text><Text style={[styles.chipCount, sel && styles.chipCountOn]}>{item.count}</Text></TouchableOpacity>);
  }, [selCat]);
  const renderEntry = useCallback(({ item }: { item: KnowledgeEntry }) => {
    const bm = bookmarks.includes(item.id); const dc = diffColors[item.difficulty] ?? Colors.textMuted;
    return (<TouchableOpacity style={styles.card} onPress={() => onEntry(item)} activeOpacity={0.7} testID={`entry-${item.id}`}><View style={styles.cardHead}><View style={[styles.diffBadge, { backgroundColor: dc + "1A" }]}><Text style={[styles.diffText, { color: dc }]}>{item.difficulty}</Text></View><TouchableOpacity onPress={() => onBookmark(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>{bm ? <BookmarkCheck size={18} color={Colors.accent} /> : <Bookmark size={18} color={Colors.textMuted} />}</TouchableOpacity></View><Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text><Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text><View style={styles.cardFoot}><View style={styles.authorRow}><Text style={styles.authorName}>{item.authorName}</Text><Text style={styles.authorExp}>{item.yearsExperience}yr exp</Text></View><View style={styles.statsRow}><ThumbsUp size={13} color={Colors.textMuted} /><Text style={styles.votes}>{item.upvotes}</Text><ChevronRight size={16} color={Colors.textMuted} /></View></View></TouchableOpacity>);
  }, [bookmarks, onBookmark, onEntry]);
  return (
    <View style={styles.root}>
      <View style={styles.searchBox}><Search size={18} color={Colors.textMuted} /><TextInput style={styles.searchIn} value={search} onChangeText={setSearch} placeholder="Search equipment, symptoms..." placeholderTextColor={Colors.textMuted} testID="kb-search" /></View>
      <View style={styles.catWrap}><FlatList data={categories} renderItem={renderChip} keyExtractor={(i) => i.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList} /></View>
      <FlatList data={filtered} renderItem={renderEntry} keyExtractor={(i) => i.id} contentContainerStyle={styles.entryList} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.empty}><Search size={40} color={Colors.textMuted} /><Text style={styles.emptyTitle}>No results</Text><Text style={styles.emptySub}>Try different search or category</Text></View>} />
    </View>);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, borderRadius: 12, marginHorizontal: 16, marginTop: 12, paddingHorizontal: 14, gap: 10, borderWidth: 1, borderColor: Colors.border },
  searchIn: { flex: 1, fontSize: 15, color: Colors.text, paddingVertical: 14 },
  catWrap: { marginTop: 12 }, catList: { paddingHorizontal: 16, gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.surface, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: Colors.border },
  chipOn: { backgroundColor: Colors.accentDim, borderColor: Colors.accentDimBorder },
  chipText: { fontSize: 13, fontWeight: "600" as const, color: Colors.textSecondary }, chipTextOn: { color: Colors.accent },
  chipCount: { fontSize: 11, color: Colors.textMuted, fontWeight: "500" as const }, chipCountOn: { color: Colors.accentLight },
  entryList: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 12 },
  card: { backgroundColor: Colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  diffBadge: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  diffText: { fontSize: 11, fontWeight: "700" as const, textTransform: "uppercase" as const, letterSpacing: 0.5 },
  cardTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text, marginBottom: 6, lineHeight: 22 },
  cardDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  cardFoot: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10 },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  authorName: { fontSize: 13, fontWeight: "600" as const, color: Colors.textSecondary },
  authorExp: { fontSize: 11, color: Colors.textMuted, backgroundColor: Colors.surfaceLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: "hidden" },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  votes: { fontSize: 13, color: Colors.textMuted, fontWeight: "600" as const },
  empty: { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: "600" as const, color: Colors.text, marginTop: 8 },
  emptySub: { fontSize: 14, color: Colors.textSecondary },
});
