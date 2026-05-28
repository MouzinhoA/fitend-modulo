import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '../src/services/api';

const { width, height } = Dimensions.get('window');

export default function Invitation({ navigation }) {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!codigo) {
      Alert.alert('Aviso', 'Insira o código de convite');
      return;
    }
    setLoading(true);
    try {
      await api.participacoes.participar(codigo);
      Alert.alert('Sucesso', 'Você entrou no desafio!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#141414', '#070707']}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require('../assets/back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Junte-se ao desafio:</Text>

      <Text style={styles.description}>
        Insira o código de convite para participar do desafio:
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Código de convite"
        placeholderTextColor="#777"
        value={codigo}
        onChangeText={setCodigo}
        autoCapitalize="characters"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#8b4dff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleJoin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.18,
    paddingHorizontal: width * 0.08,
  },

  title: {
    color: '#fff',
    fontSize: width * 0.09,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  description: {
    color: '#fff',
    fontSize: width * 0.05,
    lineHeight: 34,
    marginBottom: 28,
  },

  input: {
    width: '100%',
    height: height * 0.075,
    backgroundColor: '#000',
    color: '#fff',
    paddingHorizontal: 18,
    marginBottom: 35,
    fontSize: width * 0.045,
  },

  button: {
    width: '100%',
    height: height * 0.08,
    backgroundColor: '#4a1d73',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: width * 0.055,
    fontWeight: 'bold',
  },

  backIcon: {
    width: width * 0.08,
    height: width * 0.08,
    maxWidth: 34,
    maxHeight: 34,
  },

  backButton: {
    position: 'absolute',
    top: height * 0.08,
    left: width * 0.06,
  },
});
