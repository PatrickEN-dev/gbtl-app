// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  // Onboarding is temporarily disabled while we resolve the storage issue.
  return <Redirect href="/(tabs)" />;
}
