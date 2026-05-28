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

export default function Checkin({ navigation, route }) {
  const desafioId = route?.params?.desafioId;
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!valor) {
      Alert.alert('Aviso', 'Informe o valor registrado');
      return;
    }
    if (!desafioId) {
      Alert.alert('Erro', 'Desafio não identificado');
      return;
    }
    setLoading(true);
    try {
      const participacoes = await api.participacoes.listar();
      const participacao = participacoes.find(p => p.desafio?.id_desafio === desafioId);
      if (!participacao) {
        Alert.alert('Erro', 'Você não é participante deste desafio');
        return;
      }
      await api.checkins.criar(participacao.id_participante, {
        valor_registrado: parseFloat(valor),
      });
      Alert.alert('Sucesso', 'Check-in registrado!');
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

      <Text style={styles.title}>Checkin:</Text>

      <TextInput
        style={styles.input}
        placeholder="Valor registrado"
        placeholderTextColor="#777"
        value={valor}
        onChangeText={setValor}
        keyboardType="decimal-pad"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#8b4dff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Publicar</Text>
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
