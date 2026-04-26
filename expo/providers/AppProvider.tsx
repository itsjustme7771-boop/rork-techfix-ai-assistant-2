import React, { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { UserProfile, KnowledgeEntry, SubscriptionTier } from "@/types";
import { knowledgeEntries as mockEntries } from "@/mocks/knowledge";

const STORAGE_KEY_PROFILE = "fixiq_profile";
const STORAGE_KEY_ENTRIES = "fixiq_knowledge";
const STORAGE_KEY_BOOKMARKS = "fixiq_bookmarks";

const defaultProfile: UserProfile = {
  id: "user-1",
  name: "Alex Technician",
  role: "Maintenance Technician",
  tier: "technician",
  yearsExperience: 5,
  specialties: ["Electrical", "HVAC"],
  contributionCount: 0,
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [profile, setProfile] = React.useState<UserProfile>(defaultProfile);
  const [entries, setEntries] = React.useState<KnowledgeEntry[]>(mockEntries);
  const [bookmarks, setBookmarks] = React.useState<string[]>([]);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_PROFILE);
      return stored ? (JSON.parse(stored) as UserProfile) : defaultProfile;
    },
  });

  const entriesQuery = useQuery({
    queryKey: ["knowledge-entries"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_ENTRIES);
      return stored ? (JSON.parse(stored) as KnowledgeEntry[]) : mockEntries;
    },
  });

  const bookmarksQuery = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return stored ? (JSON.parse(stored) as string[]) : [];
    },
  });

  useEffect(() => {
    if (profileQuery.data) setProfile(profileQuery.data);
  }, [profileQuery.data]);

  useEffect(() => {
    if (entriesQuery.data) setEntries(entriesQuery.data);
  }, [entriesQuery.data]);

  useEffect(() => {
    if (bookmarksQuery.data) setBookmarks(bookmarksQuery.data);
  }, [bookmarksQuery.data]);

  const saveProfileMutation = useMutation({
    mutationFn: async (updated: UserProfile) => {
      await AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => setProfile(data),
  });

  const saveEntriesMutation = useMutation({
    mutationFn: async (updated: KnowledgeEntry[]) => {
      await AsyncStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => setEntries(data),
  });

  const saveBookmarksMutation = useMutation({
    mutationFn: async (updated: string[]) => {
      await AsyncStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => setBookmarks(data),
  });

  const addEntry = (entry: KnowledgeEntry) => {
    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntriesMutation.mutate(updated);
    const updatedProfile = { ...profile, contributionCount: profile.contributionCount + 1 };
    setProfile(updatedProfile);
    saveProfileMutation.mutate(updatedProfile);
  };

  const toggleBookmark = (entryId: string) => {
    const updated = bookmarks.includes(entryId)
      ? bookmarks.filter((id) => id !== entryId)
      : [...bookmarks, entryId];
    setBookmarks(updated);
    saveBookmarksMutation.mutate(updated);
  };

  const upvoteEntry = (entryId: string) => {
    const updated = entries.map((e) =>
      e.id === entryId ? { ...e, upvotes: e.upvotes + 1 } : e
    );
    setEntries(updated);
    saveEntriesMutation.mutate(updated);
  };

  const setTier = (tier: SubscriptionTier) => {
    const updated = { ...profile, tier };
    setProfile(updated);
    saveProfileMutation.mutate(updated);
  };

  return {
    profile,
    entries,
    bookmarks,
    addEntry,
    toggleBookmark,
    upvoteEntry,
    setTier,
    isLoading: profileQuery.isLoading || entriesQuery.isLoading,
  };
});
