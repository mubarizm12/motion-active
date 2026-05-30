import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { register as registerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !displayName) { Alert.alert('Error', 'Please fill in all fields'); return; }
    setLoading(true);
    try {
      const response = await registerApi(email, password, displayName);
      await login(response.data);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.logo}>Motion Active</Text>
      <Text style={styles.subtitle}>Join the movement.</Text>

      <TextInput style={styles.input} placeholder="Display Name" placeholderTextColor="#999"
        value={displayName} onChangeText={setDisplayName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999"
        value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999"
        value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 24 },
  logo: { fontSize: 36, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 48 },
  input: { backgroundColor: '#F5F5F5', color: '#000', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  button: { backgroundColor: '#000', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#888', textAlign: 'center', marginTop: 24 },
});