import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Invitation({ navigation }) {

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

      <Text style={styles.title}>
        Junte-se ao desafio:
      </Text>

      <Text style={styles.description}>
        Insira o link de convite para participar do desafio:
      </Text>

      <TextInput
        style={styles.input}
        placeholder=""
        placeholderTextColor="#777"
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Entrar
        </Text>
      </TouchableOpacity>

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