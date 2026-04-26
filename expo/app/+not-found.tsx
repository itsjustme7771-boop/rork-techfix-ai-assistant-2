import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

const SCREEN_TITLE = "Oops";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>The page you are looking for does not exist.</Text>
        <Link href="/" style={styles.link}><Text style={styles.linkText}>Back to FixIQ</Text></Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: Colors.background },
  title: { fontSize: 22, fontWeight: "700" as const, color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: "center" },
  link: { marginTop: 24, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: Colors.accent, borderRadius: 10 },
  linkText: { fontSize: 15, fontWeight: "600" as const, color: Colors.white },
});
