// MUDAR PARA PÁGINA TABELA
const botao = document.getElementById("Entrar");

if (botao) {
    botao.addEventListener("click", () => {
        console.log("teste");
        window.location.href = "/tabela";
    });
}

// ADICIONAR E RETIRAR ITENS
window.addEventListener("DOMContentLoaded", () => {

    console.log("JS carregou com sucesso");

    const btnEntrada = document.getElementById("btnEntrada");
    const btnSaida = document.getElementById("btnSaida");
    const btnRegistrar = document.getElementById("btnRegistrar");
    const btnUpload = document.getElementById("btnUpload");

    let tipoMovimentacao = "";

    // FUNÇÃO: limpar seleção
    function limparSelecao() {
        if (btnEntrada) btnEntrada.classList.remove("btn-selecionado");
        if (btnSaida) btnSaida.classList.remove("btn-selecionado");
    }

    // BOTÃO ENTRADA
    if (btnEntrada) {
        btnEntrada.addEventListener("click", () => {
            tipoMovimentacao = "entrada";

            limparSelecao();
            btnEntrada.classList.add("btn-selecionado");

            console.log("Entrada selecionada");
        });
    }

    // BOTÃO SAÍDA
    if (btnSaida) {
        btnSaida.addEventListener("click", () => {
            tipoMovimentacao = "saida";

            limparSelecao();
            btnSaida.classList.add("btn-selecionado");

            console.log("Saída selecionada");
        });
    }


// EXCLUIR LINHA
window.excluirItem = async function(id) {

    const confirmacao = confirm("Tem certeza que deseja excluir este item?");
    if (!confirmacao) return;

    const resposta = await fetch(`/excluir/${id}`, {
        method: "DELETE"
    });

    const data = await resposta.json();

    if (data.success) {
        alert("Item excluído com sucesso!");
        location.reload();
    } else {
        alert("Erro ao excluir");
    }
}

// ATUALIZAR A TABELA
    if (btnRegistrar) {
        btnRegistrar.addEventListener("click", async () => {

            if (tipoMovimentacao === "") {
                alert("Selecione Entrada ou Saída.");
                return;
            }

            const item = document.getElementById("item").value;
            const quantidade = document.getElementById("quantidade").value;
            const responsavel = document.getElementById("responsavel").value;
            const imagem = document.getElementById("fileInput").files[0];

            const formData = new FormData();

            formData.append("nome", item);
            formData.append("qtde", quantidade);
            formData.append("responsavel", responsavel);

            if (imagem) {
                formData.append("imagem", imagem);
            }

            formData.append("tipo", tipoMovimentacao);

            const resposta = await fetch("/entrada", {
                method: "POST",
                body: formData
            });

            const data = await resposta.json();

            if (data.success) {
                alert("Registro salvo com sucesso!");
                window.location.href = "/tabela";
            } else {
                alert("Erro ao salvar");
            }
        });
    }

    if (btnUpload) {
        btnUpload.addEventListener("click", () => {
            document.getElementById("fileInput").click();
        });
    }

});