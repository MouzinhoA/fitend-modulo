import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../src/contexts/AuthContext';
import { api, getBaseUrl } from '../src/services/api';

const { width, height } = Dimensions.get('window');

export default function Settings({ navigation }) {
  const { usuario, carregarPerfil } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const baseUrl = getBaseUrl();

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
    }
  }, [usuario]);

  const handlePickPhoto = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos da permissão da galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFotoUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível acessar a galeria.');
    }
  };

  const handleSave = async () => {
    if (!nome) {
      Alert.alert('Aviso', 'O nome não pode ficar vazio');
      return;
    }

    setLoading(true);
    try {
      let fotoUrl = undefined;
      if (fotoUri) {
        const uploadResult = await api.upload(fotoUri);
        fotoUrl = uploadResult.url;
      }

      const updates = { nome, email };
      if (fotoUrl) updates.foto = fotoUrl;

      if (showPasswordFields && novaSenha) {
        if (!senhaAtual) {
          Alert.alert('Aviso', 'Informe a senha atual');
          setLoading(false);
          return;
        }
        updates.senha = novaSenha;
        updates.senha_atual = senhaAtual;
      }

      await api.usuarios.atualizar(updates);
      await carregarPerfil();
      Alert.alert('Sucesso', 'Perfil atualizado!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fotoSource = fotoUri
    ? { uri: fotoUri }
    : usuario?.foto
      ? { uri: `${baseUrl}${usuario.foto}` }
      : require('../assets/perfil.png');

  return (
    <LinearGradient
      colors={['#141414', '#070707']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back.png')}
            style={styles.backImg}
          />
        </TouchableOpacity>

        <Image
          source={fotoSource}
          style={styles.profileImage}
        />

        <TouchableOpacity onPress={handlePickPhoto}>
          <Text style={styles.changePhoto}>
            Alterar foto do perfil
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Nome"
          placeholderTextColor="#666"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#666"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setShowPasswordFields(!showPasswordFields)}
        >
          <Text style={styles.passwordToggleText}>
            {showPasswordFields ? 'Cancelar alteração de senha' : 'Alterar senha'}
          </Text>
        </TouchableOpacity>

        {showPasswordFields && (
          <>
            <TextInput
              placeholder="Senha atual"
              placeholderTextColor="#666"
              style={styles.input}
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              secureTextEntry
            />
            <TextInput
              placeholder="Nova senha (mín. 6 caracteres)"
              placeholderTextColor="#666"
              style={styles.input}
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry
            />
          </>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#8b4dff" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Salvar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  scrollContent: {
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: 60,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },

  backImg: {
    width: width * 0.08,
    height: width * 0.08,
    maxWidth: 38,
    maxHeight: 38,
  },

  profileImage: {
    width: width * 0.42,
    height: width * 0.42,
    borderRadius: 999,
    marginTop: 40,
  },

  changePhoto: {
    color: '#7B2CBF',
    fontSize: width * 0.045,
    marginTop: 15,
    marginBottom: 40,
    fontWeight: 'bold',
  },

  input: {
    width: '74%',
    height: height * 0.07,
    backgroundColor: '#000',
    color: '#fff',
    fontSize: width * 0.05,
    paddingHorizontal: 18,
    marginBottom: 20,
  },

  passwordToggle: {
    width: '74%',
    marginBottom: 5,
  },

  passwordToggleText: {
    color: '#7B2CBF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },

  saveButton: {
    width: '74%',
    height: height * 0.07,
    backgroundColor: '#5f2bc7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderRadius: 8,
  },

  saveText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});
