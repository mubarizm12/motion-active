import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { getRewards, redeemReward } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  stockQuantity: number;
  isActive: boolean;
}

export default function RewardsScreen() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const { user, updatePoints } = useAuth();

  useEffect(() => { fetchRewards(); }, []);

  const fetchRewards = async () => {
    try {
      const res = await getRewards();
      setRewards(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (!user || user.totalPoints < reward.pointsCost) {
      Alert.alert('Not enough points', `You need ${reward.pointsCost} points.`);
      return;
    }
    Alert.alert(
      'Confirm Redemption',
      `Redeem ${reward.name} for ${reward.pointsCost} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: async () => {
            setRedeeming(reward.id);
            try {
              await redeemReward(reward.id);
              updatePoints(user.totalPoints - reward.pointsCost);
              Alert.alert('Success', `You redeemed ${reward.name}!`);
              fetchRewards();
            } catch (e: any) {
              Alert.alert('Error', e.response?.data || 'Redemption failed');
            } finally {
              setRedeeming(null);
            }
          }
        }
      ]
    );
  };

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator color="#00C896" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rewards Shop</Text>
      <Text style={styles.balance}>Your balance: {user?.totalPoints ?? 0} pts</Text>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const canAfford = (user?.totalPoints ?? 0) >= item.pointsCost;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.rewardName}>{item.name}</Text>
                <Text style={[styles.cost, !canAfford && styles.costCantAfford]}>
                  {item.pointsCost} pts
                </Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.stock}>{item.stockQuantity} left</Text>
                <TouchableOpacity
                  style={[styles.redeemButton, !canAfford && styles.redeemDisabled]}
                  onPress={() => handleRedeem(item)}
                  disabled={!canAfford || redeeming === item.id}
                >
                  {redeeming === item.id
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.redeemText}>{canAfford ? 'Redeem' : 'Need more pts'}</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', paddingHorizontal: 24, marginBottom: 4 },
  balance: { fontSize: 14, color: '#00C896', paddingHorizontal: 24, marginBottom: 16 },
  list: { padding: 16 },
  card: { backgroundColor: '#F5F5F5', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  rewardName: { fontSize: 16, fontWeight: 'bold', color: '#000', flex: 1 },
  cost: { fontSize: 16, fontWeight: 'bold', color: '#00C896' },
  costCantAfford: { color: '#888' },
  description: { fontSize: 14, color: '#888', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stock: { fontSize: 12, color: '#888' },
  redeemButton: { backgroundColor: '#000', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  redeemDisabled: { backgroundColor: '#E0E0E0' },
  redeemText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});