import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions,} from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Settings from './Settings';

export default function Profile({ setLogged }){

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('profile');

  const logout = () => {
    setLogged(false);
  };

  if (currentScreen === 'settings') {
  return <Settings setCurrentScreen={setCurrentScreen} />;
  }

  return (
    <LinearGradient
      colors={['#141414', '#070707']}
      style={styles.container}
    >
      <View style={styles.header}>

        <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <Image
            source={require('../assets/menu.png')}
            style={styles.headerIcon}
            />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentScreen('settings')}>
            <Image
            source={require('../assets/settings.png')}
            style={styles.headerIcon}
            />
        </TouchableOpacity>

    </View>

      <Image
        source={require('../assets/perfil.png')}
        style={styles.profileImage}
      />

      <Text style={styles.name}>
        Morgana Marinho
      </Text>

      <View style={styles.tabsContainer}>

        <TouchableOpacity style={styles.tab}>
          <Text style={styles.activeTabText}>
            Ativos
          </Text>

          <View style={styles.activeLine} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>
            Criar Desafio
          </Text>
        </TouchableOpacity>

      </View>

      {menuOpen && (
  <>
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setMenuOpen(false)}
        />

        <View style={styles.sideMenu}>

          <View style={styles.menuProfile}>
            <Image
              source={require('../assets/perfil.png')}
              style={styles.menuImage}
            />

            <Text style={styles.menuTitle}>Perfil</Text>
          </View>

          <Text style={styles.menuItem}>Criar Desafio</Text>
          <Text style={styles.menuItem}>Desafios Ativos</Text>
          <Text style={styles.menuItem}>Juntar-se ao desafio</Text>

          <View style={styles.bottomMenu}>
            <TouchableOpacity onPress={() => setCurrentScreen('settings')}>
              <Text style={styles.menuItem}>Configurações</Text>
            </TouchableOpacity>
            <Text style={styles.menuItem}>Ajuda & Feedback</Text>
            <TouchableOpacity onPress={logout}>
              <Text style={styles.menuItem}>Sair</Text>
            </TouchableOpacity>
          </View>

        </View>
      </>
    )}
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.06,
  },

  headerIcon: {
    width: width * 0.08,
    height: width * 0.08,
    maxWidth: 38,
    maxHeight: 38,
},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
  },

  icon: {
    color: '#5f2bc7',
    fontSize: 42,
  },

  profileImage: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: height * 0.03,
  },

  name: {
    color: '#fff',
    fontSize: width * 0.065,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
  },

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: height * 0.05,
  },

  tab: {
    alignItems: 'center',
    width: '50%',
  },

  activeTabText: {
    color: '#8b4dff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },

  tabText: {
    color: '#4a49c9',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },

  activeLine: {
    width: '100%',
    height: 4,
    backgroundColor: '#7b2cff',
    marginTop: 10,
  },

  overlay: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.4)',
},

sideMenu: {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '72%',
  height: '100%',
  backgroundColor: '#000',
  paddingTop: 70,
  paddingHorizontal: 22,
},

menuProfile: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 40,
},

menuImage: {
  width: 60,
  height: 60,
  borderRadius: 999,
  marginRight: 15,
},

menuTitle: {
  color: '#fff',
  fontSize: 22,
  fontWeight: 'bold',
},

menuItem: {
  color: '#fff',
  fontSize: 20,
  marginBottom: 12,
},

bottomMenu: {
  position: 'absolute',
  bottom: 60,
  left: 22,
},

});