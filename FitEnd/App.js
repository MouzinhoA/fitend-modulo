import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Dimensions, Text, View, TextInput, TouchableOpacity, Image, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import Profile from './screens/Profile';
import Settings from './screens/Settings';

export default function App() {
  
  const [logged, setLogged] = useState(false);
  const [screen, setScreen] = useState('profile');

 if (logged) {
  return <Profile setLogged={setLogged} />;
}

return (
    <LinearGradient
      colors={['#340065', '#01065a']}
      style={styles.container}
    >
     <StatusBar style="light" /> 

     <Image
        source={require('./assets/login.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        placeholder="Usuário"
        placeholderTextColor="#9e9eae"
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#9e9eae"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} 
      onPress={() => {setLogged(true);}}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.forgotPassword}>
        Esqueceu a senha?
      </Text>

      <View style={styles.bottomContainer}>
        <Text style={styles.createAccount}>
          Criar nova conta
        </Text>
      </View>
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get('window');
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
