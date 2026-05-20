import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {
  return (
    <LinearGradient
      colors={['#141414', '#070707']}
      style={styles.container}
    >
      <View style={styles.header}>

        <TouchableOpacity>
            <Image
            source={require('../assets/menu.png')}
            style={styles.headerIcon}
            />
        </TouchableOpacity>

        <TouchableOpacity>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
  },

  headerIcon: {
    width: 38,
    height: 38,
},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  icon: {
    color: '#5f2bc7',
    fontSize: 42,
  },

  profileImage: {
    width: 210,
    height: 210,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: 25,
  },

  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 55,
  },

  tab: {
    alignItems: 'center',
    width: '50%',
  },

  activeTabText: {
    color: '#8b4dff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  tabText: {
    color: '#4a49c9',
    fontSize: 20,
    fontWeight: 'bold',
  },

  activeLine: {
    width: '100%',
    height: 5,
    backgroundColor: '#7b2cff',
    marginTop: 12,
  },
});