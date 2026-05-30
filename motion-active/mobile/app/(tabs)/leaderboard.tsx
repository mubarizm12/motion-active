import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getLeaderboard } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  totalPoints: number;
}

export default function LeaderboardScreen() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getLeaderboard()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator color="#00C896" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={({ item }) => (
          <View style={[styles.row, item.displayName === user?.displayName && styles.highlighted]}>
            <Text style={styles.rank}>{getRankEmoji(item.rank)}</Text>
            <Text style={styles.name}>{item.displayName}</Text>
            <Text style={styles.points}>{item.totalPoints} pts</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', padding: 24, paddingBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, marginHorizontal: 16, marginBottom: 8, backgroundColor: '#F5F5F5', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  highlighted: { borderColor: '#00C896', backgroundColor: '#F0FDF9' },
  rank: { fontSize: 20, width: 48 },
  name: { flex: 1, color: '#000', fontSize: 16 },
  points: { color: '#00C896', fontWeight: 'bold' },
});