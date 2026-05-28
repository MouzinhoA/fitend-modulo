import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../src/services/api";

const { width, height } = Dimensions.get('window');

export default function Challenge({ navigation, route }) {
  const desafioId = route?.params?.desafioId;
  const [desafio, setDesafio] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [activeTab, setActiveTab] = useState('checkin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (desafioId) carregarDados();
  }, [desafioId]);

  async function carregarDados() {
    setLoading(true);
    try {
      const [desafioData, checkinsData, rankingData] = await Promise.all([
        api.desafios.buscar(desafioId),
        api.checkins.listarDoDesafio(desafioId),
        api.desafios.ranking(desafioId),
      ]);
      setDesafio(desafioData);
      setCheckins(checkinsData);
      setRanking(rankingData);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleShare = async () => {
    if (!desafio?.cod_convite) return;
    try {
      await Share.share({
        message: `Participe do meu desafio FitEnd! Código: ${desafio.cod_convite}`,
      });
    } catch {}
  };

  const renderCheckin = ({ item }) => (
    <View style={styles.card}>
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.cardTitle}>
          {item.usuario?.nome || 'Anônimo'}
        </Text>
        <Text style={styles.cardSubtitle}>
          Valor: {item.valor_registrado} {desafio?.metrica?.sigla || ''}
        </Text>
        <Text style={styles.cardDate}>
          {new Date(item.data_hora).toLocaleString('pt-BR')}
        </Text>
      </View>
    </View>
  );

  const renderRanking = ({ item, index }) => (
    <View style={styles.card}>
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.cardTitle}>
          #{item.posicao} - {item.nome}
        </Text>
        <Text style={styles.cardSubtitle}>
          Progresso: {item.progresso_total} {desafio?.metrica?.sigla || ''} ({item.total_checkins} check-ins)
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare}>
          <Image
            source={require("../assets/settings.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8b4dff" style={{ marginTop: 60 }} />
      ) : !desafio ? (
        <Text style={{ color: '#777', textAlign: 'center', marginTop: 60, fontSize: 18 }}>
          Desafio não encontrado
        </Text>
      ) : (
        <>
          <View style={styles.topContent}>
            <Image
              source={require("../assets/preguicaDesafio.png")}
              style={styles.sloth}
              resizeMode="contain"
            />
            <Text style={styles.title}>{desafio.titulo}</Text>
            <Text style={{ color: '#aaa', fontSize: 14, marginTop: 5 }}>
              {desafio.metrica?.nome || ''} · {desafio.status}
            </Text>
            {desafio.cod_convite && (
              <TouchableOpacity onPress={handleShare} style={{ marginTop: 8 }}>
                <Text style={{ color: '#7B2CBF', fontSize: 14 }}>
                  Código: {desafio.cod_convite} (toque para compartilhar)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Image
              source={require("../assets/share.png")}
              style={styles.shareIcon}
            />
          </TouchableOpacity>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={activeTab === 'checkin' ? styles.activeTab : styles.tab}
              onPress={() => setActiveTab('checkin')}
            >
              <Text style={activeTab === 'checkin' ? styles.activeTabText : styles.tabText}>
                Check-in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={activeTab === 'ranking' ? styles.activeTab : styles.tab}
              onPress={() => setActiveTab('ranking')}
            >
              <Text style={activeTab === 'ranking' ? styles.activeTabText : styles.tabText}>
                Ranking
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'checkin' && (
            <FlatList
              data={checkins}
              keyExtractor={(item) => item.id_checkin}
              renderItem={renderCheckin}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={{ color: '#777', textAlign: 'center', marginTop: 30 }}>
                  Nenhum check-in ainda
                </Text>
              }
            />
          )}

          {activeTab === 'ranking' && (
            <FlatList
              data={ranking}
              keyExtractor={(item) => String(item.posicao)}
              renderItem={renderRanking}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={{ color: '#777', textAlign: 'center', marginTop: 30 }}>
                  Nenhum participante ainda
                </Text>
              }
            />
          )}

          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('Checkin', { desafioId })}
          >
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  headerIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },

  topContent: {
    alignItems: "center",
    marginTop: 25,
  },

  sloth: {
    width: 190,
    height: 190,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },

  shareButton: {
    position: "absolute",
    right: 25,
    top: 310,
  },

  shareIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },

  tabsContainer: {
    flexDirection: "row",
    marginTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },

  activeTab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 4,
    borderBottomColor: "#7B2CBF",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
  },

  activeTabText: {
    color: "#8B3DFF",
    fontSize: 18,
    fontWeight: "700",
  },

  tabText: {
    color: "#4650FF",
    fontSize: 18,
    fontWeight: "700",
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },

  card: {
    backgroundColor: "#000000",
    borderRadius: 6,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  cardSubtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 2,
  },

  cardDate: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },

  fab: {
    position: "absolute",
    right: 25,
    bottom: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2E2EA8",
    justifyContent: "center",
    alignItems: "center",
  },

  plus: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "300",
    marginTop: -4,
  },

  backIcon: {
    width: width * 0.08,
    height: width * 0.08,
    maxWidth: 34,
    maxHeight: 34,
  },
});
