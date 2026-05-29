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
  const metricaSigla = route?.params?.metricaSigla || '';
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);
  const [fotoUri, setFotoUri] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePickPhoto = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos da permissão da câmera para tirar foto.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFotoUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível acessar a câmera.');
    }
  };

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
      let foto_url = null;
      if (fotoUri) {
        setUploadingPhoto(true);
        const uploadResult = await api.upload(fotoUri);
        foto_url = uploadResult.url;
      }

      await api.checkins.criarPorUsuario(desafioId, {
        valor_registrado: parseFloat(valor),
        foto_url,
      });
      Alert.alert('Sucesso', 'Check-in registrado!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
      setUploadingPhoto(false);
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
        placeholder={`Valor registrado${metricaSigla ? ` (${metricaSigla})` : ''}`}
        placeholderTextColor="#777"
        value={valor}
        onChangeText={setValor}
        keyboardType="decimal-pad"
      />

      <View style={styles.photoArea}>
        {fotoUri ? (
          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: fotoUri }} style={styles.photoPreview} />
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={() => setFotoUri(null)}
            >
              <Text style={styles.removePhotoText}>Remover foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.photoButton} onPress={handlePickPhoto}>
            <Text style={styles.photoButtonText}>Tirar Foto</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8b4dff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {uploadingPhoto ? 'Enviando foto...' : 'Publicar'}
          </Text>
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

  input: {
    width: '100%',
    height: height * 0.075,
    backgroundColor: '#000',
    color: '#fff',
    paddingHorizontal: 18,
    marginBottom: 20,
    fontSize: width * 0.045,
  },

  photoArea: {
    marginBottom: 25,
  },

  photoButton: {
    width: '100%',
    height: height * 0.07,
    backgroundColor: '#2E2EA8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 25,
  },

  photoButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },

  photoPreviewContainer: {
    alignItems: 'center',
  },

  photoPreview: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 12,
    marginBottom: 10,
  },

  removePhotoButton: {
    paddingVertical: 8,
  },

  removePhotoText: {
    color: '#ff4444',
    fontSize: width * 0.04,
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
