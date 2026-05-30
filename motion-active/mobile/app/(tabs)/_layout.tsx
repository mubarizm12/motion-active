import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#E0E0E0' },
      tabBarActiveTintColor: '#00C896',
      tabBarInactiveTintColor: '#888',
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Leaderboard' }} />
      <Tabs.Screen name="rewards" options={{ title: 'Rewards' }} />
    </Tabs>
  );
}