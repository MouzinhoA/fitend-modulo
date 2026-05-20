import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import Profile from './screens/Profile';

export default function App() {
  
  const [logged, setLogged] = useState(false);

  if (logged) {
    return <Profile />;
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

      <TouchableOpacity style={styles.button} onPress={() => setLogged(true)}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#340065',
    alignItems: 'center',
    paddingTop: 160,
  },

  logo: {
    width: 220,
    height: 140,
    marginBottom: 40,
  },

   input: {
    width: '82%',
    height: 65,
    backgroundColor: '#e9e9e9',
    borderRadius: 12,
    paddingHorizontal: 24,
    fontSize: 18,
    marginBottom: 26,
    color: '#000',
  },

  button: {
    width: '82%',
    height: 65,
    backgroundColor: '#02003d',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '400',
  },

  forgotPassword: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },

  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },

  createAccount: {
    color: '#fff',
    fontSize: 18,
  },
});
