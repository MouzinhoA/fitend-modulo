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
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { api, getBaseUrl } from "../src/services/api";
import { useAuth } from "../src/contexts/AuthContext";

const { width, height } = Dimensions.get('window');

export default function Challenge({ navigation, route }) {
  const { usuario } = useAuth();
  const desafioId = route?.params?.desafioId;
  const [desafio, setDesafio] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [activeTab, setActiveTab] = useState('checkin');
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState(false);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editStartDate, setEditStartDate] = useState(new Date());
  const [editEndDate, setEditEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const baseUrl = getBaseUrl();
  const isCreator = usuario && desafio && desafio.criador?.id_usuario === usuario.id_usuario;
  const isPendente = desafio?.status === 'Pendente';
  const isAtivo = desafio?.status === 'Ativo';

  useEffect(() => {
    if (desafioId) carregarDados();
    const unsubscribe = navigation.addListener('focus', () => {
      if (desafioId) carregarDados();
    });
    return unsubscribe;
  }, [desafioId, navigation]);

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

  const openEditModal = () => {
    setEditTitulo(desafio.titulo);
    setEditDescricao(desafio.descricao);
    setEditStartDate(new Date(desafio.data_inicio));
    setEditEndDate(new Date(desafio.data_fim));
    setEditModal(true);
  };

  const handleEdit = async () => {
    if (!editTitulo || !editDescricao) {
      Alert.alert('Aviso', 'Preencha título e descrição');
      return;
    }
    setEditLoading(true);
    try {
      await api.desafios.atualizar(desafioId, {
        titulo: editTitulo,
        descricao: editDescricao,
        data_inicio: editStartDate.toISOString(),
        data_fim: editEndDate.toISOString(),
      });
      Alert.alert('Sucesso', 'Desafio atualizado!');
      setEditModal(false);
      carregarDados();
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Desafio',
      'Tem certeza que deseja excluir este desafio? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.desafios.deletar(desafioId);
              Alert.alert('Sucesso', 'Desafio excluído!');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Erro', err.message);
            }
          },
        },
      ],
    );
  };

  const handleLeave = () => {
    Alert.alert(
      'Sair do Desafio',
      'Tem certeza que deseja sair deste desafio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              const participacoes = await api.participacoes.listar();
              const participacao = participacoes.find(p => p.desafio?.id_desafio === desafioId);
              if (!participacao) {
                Alert.alert('Erro', 'Participação não encontrada');
                return;
              }
              await api.participacoes.sair(participacao.id_participante);
              Alert.alert('Sucesso', 'Você saiu do desafio!');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Erro', err.message);
            }
          },
        },
      ],
    );
  };

  const renderCheckin = ({ item }) => (
    <View style={styles.card}>
      <View style={{ marginLeft: 10, flex: 1 }}>
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
      {item.foto_url && (
        <Image
          source={{ uri: `${baseUrl}${item.foto_url}` }}
          style={styles.checkinPhoto}
        />
      )}
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

        <View style={styles.headerActions}>
          {isCreator && (isPendente || isAtivo) && (
            <>
              <TouchableOpacity onPress={openEditModal} style={styles.headerActionButton}>
                <Text style={styles.headerActionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.headerActionButton}>
                <Text style={[styles.headerActionText, { color: '#ff4444' }]}>Excluir</Text>
              </TouchableOpacity>
            </>
          )}
          {!isCreator && (isPendente || isAtivo) && (
            <TouchableOpacity onPress={handleLeave} style={styles.headerActionButton}>
              <Text style={[styles.headerActionText, { color: '#ff4444' }]}>Sair</Text>
            </TouchableOpacity>
          )}
        </View>
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
            <Text style={styles.descriptionText}>{desafio.descricao}</Text>
            <Text style={{ color: '#aaa', fontSize: 14, marginTop: 5 }}>
              {desafio.metrica?.nome || ''} · {desafio.status}
            </Text>
            {isCreator && desafio.cod_convite && (
              <TouchableOpacity onPress={handleShare} style={{ marginTop: 8 }}>
                <Text style={{ color: '#7B2CBF', fontSize: 14 }}>
                  Código: {desafio.cod_convite} (toque para compartilhar)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {isCreator && (
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Image
                source={require("../assets/share.png")}
                style={styles.shareIcon}
              />
            </TouchableOpacity>
          )}

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
            onPress={() => {
              if (desafio.status !== 'Ativo') {
                Alert.alert('Desafio inativo', 'O desafio precisa estar Ativo para registrar check-in.');
                return;
              }
              navigation.navigate('Checkin', { desafioId, metricaSigla: desafio?.metrica?.sigla });
            }}
          >
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Desafio</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Título"
              placeholderTextColor="#777"
              value={editTitulo}
              onChangeText={setEditTitulo}
            />
            <TextInput
              style={styles.modalInputMultiline}
              placeholder="Descrição"
              placeholderTextColor="#777"
              multiline
              value={editDescricao}
              onChangeText={setEditDescricao}
            />

            <View style={styles.dateContainer}>
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>Início</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.dateText}>
                    {editStartDate.toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={editStartDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowStartPicker(false);
                      if (selectedDate) setEditStartDate(selectedDate);
                    }}
                  />
                )}
              </View>
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>Fim</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={styles.dateText}>
                    {editEndDate.toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={editEndDate}
                    mode="date"
                    display="default"
                    minimumDate={editStartDate}
                    onChange={(event, selectedDate) => {
                      setShowEndPicker(false);
                      if (selectedDate) setEditEndDate(selectedDate);
                    }}
                  />
                )}
              </View>
            </View>

            <View style={styles.modalButtons}>
              {editLoading ? (
                <ActivityIndicator size="large" color="#8b4dff" />
              ) : (
                <>
                  <TouchableOpacity style={styles.modalSaveButton} onPress={handleEdit}>
                    <Text style={styles.modalButtonText}>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalCancelButton} onPress={() => setEditModal(false)}>
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
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
    alignItems: 'center',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },

  headerActionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  headerActionText: {
    color: '#8B3DFF',
    fontSize: 16,
    fontWeight: '700',
  },

  topContent: {
    alignItems: "center",
    marginTop: 15,
  },

  sloth: {
    width: 140,
    height: 140,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },

  descriptionText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 30,
  },

  shareButton: {
    position: "absolute",
    right: 25,
    top: 270,
  },

  shareIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },

  tabsContainer: {
    flexDirection: "row",
    marginTop: 30,
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

  checkinPhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 10,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
  },

  modalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  modalInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    color: '#fff',
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderRadius: 8,
  },

  modalInputMultiline: {
    width: '100%',
    height: 100,
    backgroundColor: '#000',
    color: '#fff',
    paddingHorizontal: 15,
    paddingTop: 12,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
    borderRadius: 8,
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
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },

  dateInput: {
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  dateText: {
    color: '#fff',
    fontSize: 15,
  },

  modalButtons: {
    gap: 12,
    marginTop: 10,
  },

  modalSaveButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#5f2bc7',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  modalCancelButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
