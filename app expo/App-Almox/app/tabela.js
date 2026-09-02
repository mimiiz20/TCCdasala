import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal} from 'react-native';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

export default function Tabela() {

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Montserrat_400Regular,
  });

  const [produtoAberto, setProdutoAberto] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [imagemAberta, setImagemAberta] = useState(false);

  const produtos = [
    {
      id: 1,
      nome: 'Chave Fenda',
      responsavel: 'Róger',
      categoria: 'Ferramentas',
      quantidade: 15,
      preco: 15.00,
      descricao: 'Chave de fenda comum',
    },
    {
      id: 2,
      nome: 'Alicate',
      responsavel: 'Viviane',
      categoria: 'Ferramentas',
      quantidade: 10,
      preco: 25.00,
      descricao: 'Alicate universal',
    },
  ];

  return (
    <View style={styles.background}>

      <Modal
        visible={imagemAberta}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImagemAberta(false)}
      >
        <View style={styles.fundoPopup}>
          <View style={styles.popup}>
            <TouchableOpacity
              style={styles.fecharPopup}
              onPress={() => setImagemAberta(false)}
            >
              <MaterialIcons
                name="close"
                size={25}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Image
              source={require('../assets/industria.png')}
              style={styles.imagemPopup}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuAberto(!menuAberto)}
        >
          <MaterialIcons
            name="menu"
            size={30}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/tabela')}>
          <Text style={styles.link}>ESTOQUE</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/editar')}>
          <Text style={styles.link}>EDITAR</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/contas')}>
          <Text style={styles.link}>CONTAS</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={styles.link}>CADASTRO</Text>
        </TouchableOpacity>
      </View>

      {/* SIDEBAR */}
      {menuAberto && (
        <View style={styles.sidebar}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setMenuAberto(false)}
          >
            <MaterialIcons
              name="close"
              size={25}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.sidebarTitulo}>USUÁRIO</Text>
          <Text style={styles.usuario}>Róger</Text>
          <Text style={styles.tipo}>Usuário</Text>

          <TouchableOpacity
            style={styles.logout}
            onPress={() => router.replace('/login')}
          >
            <MaterialIcons
              name="logout"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.logoutTexto}>DESLOGAR</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.titulo}>
        Bem-vindo(a) ao Almoxarifado!
      </Text>

      <View style={styles.tabela}>

        {/* CABEÇALHO */}
        <View style={styles.linha}>
          <View style={styles.id}>
            <Text style={styles.cabecalho}>ID</Text>
          </View>
          <View style={styles.nome}>
            <Text style={styles.cabecalho}>NOME</Text>
          </View>
          <View style={styles.responsavel}>
            <Text style={styles.cabecalho}>RESPONSÁVEL</Text>
          </View>
          <View style={styles.acao}>
            <Text style={styles.cabecalho}>AÇÃO</Text>
          </View>
        </View>

        {/* PRODUTOS */}
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <>
              <View style={styles.linha}>
                <View style={styles.id}>
                  <Text style={styles.texto}>{item.id}</Text>
                </View>

                <View style={styles.nome}>
                  <Text style={styles.texto}>{item.nome}</Text>
                </View>

                <View style={styles.responsavel}>
                  <Text style={styles.texto}>{item.responsavel}</Text>
                </View>

                <View style={styles.acao}>
                  <TouchableOpacity
                    style={styles.botao}
                    onPress={() =>
                      setProdutoAberto(
                        produtoAberto === item.id ? null : item.id
                      )
                    }
                  >
                    <MaterialIcons
                      name="visibility"
                      size={16}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* DETALHES A MAIS */}
              {produtoAberto === item.id && (
                <View style={styles.detalhes}>
                  <Text style={styles.detalhe}>
                    <Text style={styles.negrito}>CATEGORIA:</Text> {item.categoria}
                  </Text>

                  <Text style={styles.detalhe}>
                    <Text style={styles.negrito}>QUANTIDADE:</Text> {item.quantidade}
                  </Text>

                  <Text style={styles.detalhe}>
                    <Text style={styles.negrito}>PREÇO:</Text> {item.preco}
                  </Text>

                  <Text style={styles.detalhe}>
                    <Text style={styles.negrito}>DESCRIÇÃO:</Text> {item.descricao}
                  </Text>

                  <TouchableOpacity
                    style={styles.botaoImagem}
                    onPress={() => setImagemAberta(true)}
                  >
                    <MaterialIcons
                      name="image"
                      size={18}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        />

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F0F1F2',
  },
  titulo: {
    fontSize: 25,
    textAlign: 'center',
    color: '#F28705',
    marginBottom: 25,
    fontFamily: 'Poppins_700Bold',
  },
    navbar: {
    height: 60,
    backgroundColor: '#1D3273',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingLeft: 10,
    marginTop: 30,
    marginBottom: 30,
    zIndex: 10,
  },
  link: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 25,
    fontFamily: 'Poppins_700Bold',
  },
  tabela: {
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F28705',
    borderRadius: 8,
    overflow: 'hidden',
  },
    sidebar: {
    position: 'absolute',
    left: 0,
    top: 30,
    width: 250,
    height: '100%',
    backgroundColor: '#1D3273',
    zIndex: 100,
    paddingTop: 20,
    paddingHorizontal: 20,
   },
  sidebarTitulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 30,
  },
  usuario: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 5,
  },
  tipo: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 30,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  logoutTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 2,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linha: {
    flexDirection: 'row',
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#F28705',
  },
  id: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F28705',
  },
  nome: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F28705',
  },
  responsavel: {
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F28705',
  },
  acao: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cabecalho: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    color: '#333333',
    textAlign: 'center',
  },
  texto: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  botao: {
    width: 26,
    height: 26,
    backgroundColor: '#1D3273',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detalhes: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F28705',
  },
  detalhe: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 4,
  },
  negrito: {
    fontWeight: 'bold',
  },
  fundoPopup: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '80%',
    height: '60%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fecharPopup: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#1D3273',
    borderRadius: 15,
    padding: 5,
  },
  imagemPopup: {
    width: '100%',
    height: '80%',
  },
});