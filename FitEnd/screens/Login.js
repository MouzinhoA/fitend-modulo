import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Dimensions, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useAuth } from '../src/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { login, cadastrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [nome, setNome] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Aviso', 'Preencha email e senha');
      return;
    }
    setLoading(true);
    try {
      await login(email, senha);
      navigation.replace('Profile');
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Aviso', 'Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      await cadastrar(nome, email, senha);
      Alert.alert('Sucesso', 'Conta criada! Faça login.');
      setIsRegister(false);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#340065', '#01065a']}
      style={styles.container}
    >
      <StatusBar style="light" />

      <Image
        source={require('../assets/login.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {isRegister && (
        <TextInput
          placeholder="Nome"
          placeholderTextColor="#9e9eae"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
      )}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#9e9eae"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#9e9eae"
        secureTextEntry
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={isRegister ? handleRegister : handleLogin}
        >
          <Text style={styles.buttonText}>
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={styles.forgotPassword}>
          {isRegister ? 'Já tem conta? Entrar' : 'Criar nova conta'}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <Text style={styles.createAccount}>
          FitEnd
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#340065',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
  },

  logo: {
    width: width * 0.55,
    height: height * 0.18,
    marginBottom: height * 0.05,
  },

  input: {
    width: '100%',
    maxWidth: 350,
    height: height * 0.075,
    backgroundColor: '#e9e9e9',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: width * 0.045,
    marginBottom: 20,
    color: '#000',
  },

  button: {
    width: '100%',
    maxWidth: 350,
    height: height * 0.075,
    backgroundColor: '#02003d',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: '400',
  },

  forgotPassword: {
    color: '#fff',
    fontSize: width * 0.04,
    marginTop: 18,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: height * 0.05,
  },

  createAccount: {
    color: '#fff',
    fontSize: width * 0.045,
  },
});
