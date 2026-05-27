import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

const checkins = [
  {
    id: "1",
    treino: "Quads",
    usuario: "Morgana Marinho",
  },

  // novos check-ins 
];


export default function Challenge({ navigation }) {


  const renderCheckin = ({ item }) => (
    <View style={styles.card}>

        <View style={{ marginLeft: 10 }}>
        <Text style={styles.cardTitle}>{item.treino}</Text>
        <Text style={styles.cardSubtitle}>{item.usuario}</Text>
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

      <TouchableOpacity onPress={() => {}}>
        <Image
          source={require("../assets/settings.png")}
          style={styles.headerIcon}
        />
      </TouchableOpacity>
    </View>

    <View style={styles.topContent}>
      <Image
        source={require("../assets/preguicaDesafio.png")}
        style={styles.sloth}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Família Fit #30dias
      </Text>
    </View>

    <TouchableOpacity style={styles.shareButton}>
      <Image
        source={require("../assets/share.png")}
        style={styles.shareIcon}
      />
    </TouchableOpacity>

    <View style={styles.tabsContainer}>
      <TouchableOpacity style={styles.activeTab}>
        <Text style={styles.activeTabText}>
          Check-in
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab}>
        <Text style={styles.tabText}>
          Ranking
        </Text>
      </TouchableOpacity>
    </View>

    <FlatList
      data={checkins}
      keyExtractor={(item) => item.id}
      renderItem={renderCheckin}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />

    <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('Checkin')}
    >
      <Text style={styles.plus}>+</Text>
    </TouchableOpacity>


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