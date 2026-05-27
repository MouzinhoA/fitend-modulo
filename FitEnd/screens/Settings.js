import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Settings({ navigation }) {

  return (
    <LinearGradient
      colors={['#141414', '#070707']}
      style={styles.container}
    >

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image
            source={require('../assets/back.png')}
            style={styles.backImg}
            />
      </TouchableOpacity>

      <Image
        source={require('../assets/perfil.png')}
        style={styles.profileImage}
      />

      <Text style={styles.changePhoto}>
        Alterar foto do perfil
      </Text>

      <TextInput
        placeholder="Nome"
        placeholderTextColor="#666"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#666"
        style={styles.input}
      />

      <TouchableOpacity style={styles.passwordButton}>
        <Text style={styles.passwordText}>
          Alterar senha
        </Text>
      </TouchableOpacity>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.08,
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
  },

  changePhoto: {
    color: '#777',
    fontSize: width * 0.045,
    marginTop: 15,
    marginBottom: 60,
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

  passwordButton: {
    width: '74%',
    height: height * 0.07,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  passwordText: {
    color: '#777',
    fontSize: width * 0.05,
  },

});