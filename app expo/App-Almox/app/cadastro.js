import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { Card } from 'react-native-paper';
import { useFonts} from '@expo-google-fonts/inter';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

export default function Cadastro() {

  var [fontsLoaded] = useFonts({
    Poppins_700Bold: Poppins_700Bold,
    Montserrat_400Regular: Montserrat_400Regular,
    Montserrat_700Bold: Montserrat_700Bold,
  });

  var [menuAberto, setMenuAberto] = useState(false);

  return (
    <View style={styles.background}>

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
      <View>
        <Text style={styles.titulo}>
          {"Boas-vindas ao\nCadastro de Usuários!"} {/* \n serve pra quebrar a linha, "Cadastro de Usuários!" fica embaixo de "Boas-vindas ao"*/}
        </Text>

        {/* FORMULÁRIO DE CADASTRO DE USUÁRIOS */}
        <Card style={styles.card}>

          <Text style={styles.label}>Usuário:</Text>
          <TextInput
            placeholder="Digite o usuário:"
            style={styles.input_user}
          />

          <Text style={styles.label}>E-mail Profissional:</Text>
          <TextInput
            placeholder="Digite o email:"
            style={styles.input_email}
          />

          <Text style={styles.label}>Senha:</Text>
          <TextInput
            placeholder="Digite a senha:"
            style={styles.input_senha}
          />

          <TouchableOpacity style={styles.botao}
            onPress={() => router.replace('/tabela')}>
            <Text style={styles.btntexto}>CADASTRAR</Text>
          </TouchableOpacity>

        </Card>
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
    color: '#1D3273',
    marginBottom: 105,
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
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
    marginLeft: 40,
    marginRight: 40,
    borderWidth: 1,
    borderColor: '#F28705',
    borderRadius: 8,
    overflow: 'hidden'
  },
  label: {
    color: '#1D3273',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 10
  },
  input_user: {
    width: 240,
    height: 40,
    alignSelf: 'center',
    backgroundColor: 'white',
    placeholderTextColor: 0.5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1D3273',
    marginBottom: 20,
  },
  input_email: {
    width: 240,
    height: 40,
    alignSelf: 'center',
    backgroundColor: 'white',
    placeholderTextColor: 0.5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1D3273',
    marginBottom: 20,
  },
  input_senha: {
    width: 240,
    height: 40,
    alignSelf: 'center',
    backgroundColor: 'white',
    placeholderTextColor: 0.5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1D3273',
    marginBottom: 20,
  },
  botao: {
    marginBottom: 10,
    backgroundColor: '#1D3273',
    alignSelf: 'center',
    justifyContent: 'center',
    width: 240,
    height: 40,
    borderRadius: 5,
  },
  btntexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'center'
  }
});