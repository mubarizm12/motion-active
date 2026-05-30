import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { logSteps } from '../../services/api';

const STEP_OPTIONS = [1000, 5000, 7500, 10000];

export default function HomeScreen() {
  const { user, logout, updatePoints } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lastEarned, setLastEarned] = useState<number | null>(null);

  const handleLogSteps = async (steps: number) => {
    setLoading(true);
    try {
      const response = await logSteps(steps);
      const { pointsEarned, totalPoints } = response.data;
      setLastEarned(pointsEarned);
      updatePoints(totalPoints);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data || 'Failed to log steps');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hey, {user?.displayName} 👋</Text>
      <Text style={styles.label}>TOTAL POINTS</Text>
      <Text style={styles.points}>{user?.totalPoints ?? 0}</Text>
      <Text style={styles.pointsLabel}>Motion Points</Text>

      {lastEarned !== null && (
        <Text style={styles.earned}>+{lastEarned} points earned!</Text>
      )}

      <Text style={styles.sectionTitle}>Log Steps</Text>
      <View style={styles.grid}>
        {STEP_OPTIONS.map((steps) => (
          <TouchableOpacity
            key={steps}
            style={styles.stepButton}
            onPress={() => handleLogSteps(steps)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#00C896" />
            ) : (
              <>
                <Text style={styles.stepNumber}>{steps.toLocaleString()}</Text>
                <Text style={styles.stepLabel}>steps</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingTop: 60 },
  greeting: { fontSize: 20, color: '#888', marginBottom: 24 },
  label: { fontSize: 12, color: '#888', letterSpacing: 1 },
  points: { fontSize: 72, fontWeight: 'bold', color: '#00C896' },
  pointsLabel: { fontSize: 16, color: '#888', marginBottom: 8 },
  earned: { fontSize: 16, color: '#00C896', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 16, marginTop: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stepButton: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 20, alignItems: 'center', width: '47%', borderWidth: 1, borderColor: '#E0E0E0' },
  stepNumber: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  stepLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  logoutButton: { marginTop: 48, padding: 16, alignItems: 'center' },
  logoutText: { color: '#FF4444', fontSize: 16 },
});