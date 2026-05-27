import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Settings from './Settings';
import Invitation from './Invitation';
import Challenge from './Challenge';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';



export default function Profile({ navigation }){

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ativos');
  const [selectedType, setSelectedType] = useState('Tipo');
  const [showOptions, setShowOptions] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);


  const logout = () => {
    navigation.replace('Login');
  };

  const desafios = [
  {
    id: '1',
    titulo: 'Família Fit #30dias',
  },

  ];

  return (
    <LinearGradient
  colors={['#141414', '#070707']}
  style={styles.container}
>

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >

      <View style={styles.header}>

        <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <Image
            source={require('../assets/menu.png')}
            style={styles.headerIcon}
            />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
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
    <TouchableOpacity
      style={styles.tab}
      onPress={() => setActiveTab('ativos')}
    >
      <Text
        style={
          activeTab === 'ativos'
            ? styles.activeTabText
            : styles.tabText
        }
      >
        Ativos
      </Text>

      {activeTab === 'ativos' && (
        <View style={styles.activeLine} />
      )}
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.tab}
      onPress={() => setActiveTab('criar')}
    >
      <Text
        style={
          activeTab === 'criar'
            ? styles.activeTabText
            : styles.tabText
        }
      >
        Criar Desafio
      </Text>

      {activeTab === 'criar' && (
        <View style={styles.activeLine} />
      )}
    </TouchableOpacity>
  </View>
  
  {activeTab === 'ativos' && (

  <View style={styles.challengesContainer}>

    {desafios.map((desafio) => (

      <TouchableOpacity
        key={desafio.id}
        style={styles.challengeCard}
        onPress={() => navigation.navigate('Challenge')}
      >

        <Text style={styles.challengeTitle}>
          {desafio.titulo}
        </Text>

      </TouchableOpacity>

    ))}

  </View>

  )}
  
  {activeTab === 'criar' && (

  <View style={styles.formContainer}>

    <TextInput
      placeholder="Título"
      placeholderTextColor="#777"
      style={styles.input}
    />

    <TextInput
      placeholder="Descrição"
      placeholderTextColor="#777"
      style={styles.descriptionInput}
      multiline
    />

    <View style={styles.dateContainer}>

      <View style={styles.dateBox}>
        <Text style={styles.dateLabel}>
          Início
        </Text>

        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.dateText}>
            {startDate.toLocaleDateString('pt-BR')}
          </Text>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);

              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}
      </View>

      <View style={styles.dateBox}>
        <Text style={styles.dateLabel}>
          Fim
        </Text>

        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.dateText}>
            {endDate.toLocaleDateString('pt-BR')}
          </Text>
        </TouchableOpacity>

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);

              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}
      </View>

    </View>

    <TouchableOpacity
      style={styles.selectInput}
      onPress={() => setShowOptions(!showOptions)}
    >
      <Text style={styles.selectText}>
        {selectedType}
      </Text>

      <Ionicons
        name={showOptions ? "chevron-up" : "chevron-down"}
        size={22}
        color="white"
      />
    </TouchableOpacity>

    {showOptions && (
      <View style={styles.optionsContainer}>

        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            setSelectedType('Dias ativos');
            setShowOptions(false);
          }}
        >
          <Text style={styles.optionText}>
            Dias ativos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            setSelectedType('ml (água)');
            setShowOptions(false);
          }}
        >
          <Text style={styles.optionText}>
            ml (água)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            setSelectedType('km');
            setShowOptions(false);
          }}
        >
          <Text style={styles.optionText}>
            km
          </Text>
        </TouchableOpacity>

      </View>
    )}

    <TouchableOpacity style={styles.createButton}>
      <Text style={styles.createButtonText}>
        Criar
      </Text>
    </TouchableOpacity>

  </View>
  )}
  </ScrollView>

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
          <TouchableOpacity onPress={() => {
          setActiveTab('ativos');
          setMenuOpen(false);
        }}>
            <Text style={styles.menuTitle}>Perfil</Text>
          </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => {
          setActiveTab('criar');
          setMenuOpen(false);
        }}
      >
        <Text style={styles.menuItem}>
          Criar Desafio
        </Text>
      </TouchableOpacity>

      
        <TouchableOpacity onPress={() => {
            setActiveTab('ativos');
            setMenuOpen(false);
          }}>
          <Text style={styles.menuItem}>Desafios Ativos</Text>
        </TouchableOpacity>
      

      <TouchableOpacity onPress={() => {
          navigation.navigate('Invitation');
          setMenuOpen(false);
        }}
      >
        <Text style={styles.menuItem}>
          Juntar-se ao desafio
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomMenu}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
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

formContainer: {
  paddingHorizontal: width * 0.06,
  paddingTop: 25,
  paddingBottom: 120,
},

input: {
  width: '100%',
  height: height * 0.075,
  backgroundColor: '#000',
  color: '#fff',
  fontSize: width * 0.05,
  paddingHorizontal: 18,
  marginBottom: 15,
},

descriptionInput: {
  width: '100%',
  height: height * 0.14,
  backgroundColor: '#000',
  color: '#fff',
  fontSize: width * 0.05,
  paddingHorizontal: 18,
  paddingTop: 15,
  marginBottom: 20,
  textAlignVertical: 'top',
},

dateContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 20,
},

dateBox: {
  width: '47%',
},

dateLabel: {
  color: '#888',
  fontSize: width * 0.045,
  marginBottom: 8,
  textAlign: 'center',
},

dateInput: {
  height: height * 0.075,
  backgroundColor: '#000',
  justifyContent: 'center',
  paddingHorizontal: 15,
},

dateText: {
  color: '#fff',
  fontSize: width * 0.045,
},

selectInput: {
  width: '100%',
  height: height * 0.075,
  backgroundColor: '#000',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 18,
  marginBottom: 35,
},

selectText: {
  color: '#777',
  fontSize: width * 0.05,
},

optionsContainer: {
  backgroundColor: '#000',
  marginTop: -30,
  marginBottom: 30,
},

option: {
  paddingVertical: 18,
  paddingHorizontal: 18,
  borderTopWidth: 1,
  borderTopColor: '#222',
},

optionText: {
  color: '#fff',
  fontSize: width * 0.045,
},

createButton: {
  width: '100%',
  height: height * 0.08,
  backgroundColor: '#5f2bc7',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
},

createButtonText: {
  color: '#fff',
  fontSize: width * 0.05,
  fontWeight: 'bold',
},

dateText: {
  color: '#fff',
  fontSize: width * 0.045,
},

challengesContainer: {
  paddingHorizontal: width * 0.035,
  paddingTop: 22,
},

challengeCard: {
  width: '100%',
  height: 70,
  backgroundColor: '#000',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 14,
},

challengeAccent: {
  width: 75,
  height: '100%',
},

challengeTitle: {
  color: '#fff',
  fontSize: width * 0.06,
  fontWeight: 'bold',
  marginLeft: 16,
},

});