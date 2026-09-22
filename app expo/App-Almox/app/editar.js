import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

const API_URL = "http://10.154.20.17";

export default function Editar() {
  const { id } = useLocalSearchParams();

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [qtde, setQtde] = useState("");
  const [estoqueMin, setEstoqueMin] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");

  const carregarProduto = async () => {
    try {
      const resposta = await fetch(`${API_URL}/estoque/${id}`);

      if (!resposta.ok) {
        throw new Error("Produto não encontrado");
      }

      const produto = await resposta.json();

      setNome(produto.nome || "");
      setCategoria(produto.categoria || "");
      setQtde(String(produto.qtde ?? ""));
      setEstoqueMin(String(produto.estoque_min ?? ""));
      setPreco(String(produto.preco ?? ""));
      setDescricao(produto.descricao || "");
    } catch (erro) {
      console.log("ERRO:", erro);

      Alert.alert(
        "Erro",
        "Não foi possível carregar os dados do produto."
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (id) {
      carregarProduto();
    }
  }, [id]);

  const salvarAlteracoes = async () => {
    if (!nome || !categoria || !qtde) {
      Alert.alert(
        "Atenção",
        "Preencha os campos obrigatórios."
      );
      return;
    }

    try {
      setSalvando(true);

      const resposta = await fetch(`${API_URL}/estoque/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          categoria,
          qtde: Number(qtde),
          estoque_min: Number(estoqueMin),
          preco: Number(preco),
          descricao,
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao atualizar produto");
      }

      Alert.alert(
        "Sucesso",
        "Produto atualizado com sucesso!",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (erro) {
      console.log("ERRO:", erro);

      Alert.alert(
        "Erro",
        "Não foi possível salvar as alterações."
      );
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Carregando produto...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <Text style={styles.titulo}>Editar produto</Text>

      <Text style={styles.label}>Nome</Text>

      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome do produto"
      />

      <Text style={styles.label}>Categoria</Text>

      <TextInput
        style={styles.input}
        value={categoria}
        onChangeText={setCategoria}
        placeholder="Categoria"
      />

      <Text style={styles.label}>Quantidade</Text>

      <TextInput
        style={styles.input}
        value={qtde}
        onChangeText={setQtde}
        placeholder="Quantidade"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Estoque mínimo</Text>

      <TextInput
        style={styles.input}
        value={estoqueMin}
        onChangeText={setEstoqueMin}
        placeholder="Estoque mínimo"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Preço</Text>

      <TextInput
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        placeholder="Preço"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Descrição</Text>

      <TextInput
        style={[styles.input, styles.textarea]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Descrição do produto"
        multiline
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={salvarAlteracoes}
        disabled={salvando}
      >
        <Text style={styles.textoBotao}>
          {salvando ? "Salvando..." : "Salvar alterações"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoCancelar}
        onPress={() => router.back()}
      >
        <Text style={styles.textoCancelar}>
          Cancelar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#30364D",
    marginTop: 20,
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#30364D",
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9DCE7",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#30364D",
  },

  textarea: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  botao: {
    backgroundColor: "#126D83",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },

  textoBotao: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  botaoCancelar: {
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },

  textoCancelar: {
    color: "#6A7395",
    fontWeight: "600",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});