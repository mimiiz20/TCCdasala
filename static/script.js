// MUDAR PARA TABELA
const botao = document.getElementById("btn-entrar");

botao?.addEventListener("click", () => {
    window.location.href = "/tabela";
});


// SALVAR + CARREGAR RASCUNHO DA TELA EDITAR
function salvarRascunho() {
    const nome = document.getElementById("nome")?.value;
    const qtde = document.getElementById("qtde")?.value;
    const responsavel = document.getElementById("responsavel")?.value;

    const dados = {
        nome,
        qtde,
        responsavel
    };

    localStorage.setItem("rascunho_editar", JSON.stringify(dados));
}


// JS PRINCIPAL
window.addEventListener("DOMContentLoaded", () => {

    console.log("JS carregou com sucesso");

    const btnEntrada = document.getElementById("btnEntrada");
    const btnSaida = document.getElementById("btnSaida");
    const btnRegistrar = document.getElementById("btnRegistrar");
    const btnUpload = document.getElementById("btnUpload");
    const fileInput = document.getElementById("fileInput");

    let tipoMovimentacao = "";

    function limparSelecao() {
        btnEntrada?.classList.remove("btn-selecionado");
        btnSaida?.classList.remove("btn-selecionado");
    }


    // CARREGAR RASCUNHO
    const rascunho = JSON.parse(localStorage.getItem("rascunho_editar"));

    if (rascunho) {
        if (document.getElementById("nome"))
            document.getElementById("nome").value = rascunho.nome || "";

        if (document.getElementById("qtde"))
            document.getElementById("qtde").value = rascunho.qtde || "";

        if (document.getElementById("responsavel"))
            document.getElementById("responsavel").value = rascunho.responsavel || "";
    }


    // SALVAR ENQUANTO DIGITA
    document.addEventListener("input", salvarRascunho);


    // ENTRADA
    btnEntrada?.addEventListener("click", () => {
        tipoMovimentacao = "entrada";
        limparSelecao();
        btnEntrada.classList.add("btn-selecionado");
    });


    // SAÍDA
    btnSaida?.addEventListener("click", () => {
        tipoMovimentacao = "saida";
        limparSelecao();
        btnSaida.classList.add("btn-selecionado");
    });


    // REGISTRAR
    btnRegistrar?.addEventListener("click", async () => {

        if (!tipoMovimentacao) {
            alert("Selecione Entrada ou Saída.");
            return;
        }

        const nome = document.getElementById("nome").value;
        const qtde = document.getElementById("qtde").value;
        const responsavel = document.getElementById("responsavel").value;
        const preco = document.getElementById("preco").value;
        const estoque_min = document.getElementById("estoque_min").value;
        const descricao = document.getElementById("descricao").value;
        const categoria = document.getElementById("categoria").value;
        const imagem = fileInput?.files[0];

        const formData = new FormData();

        formData.append("nome", nome);
        formData.append("qtde", qtde);
        formData.append("responsavel", responsavel);
        formData.append("preco", preco);
        formData.append("estoque_min", estoque_min);
        formData.append("descricao", descricao);
        formData.append("categoria", categoria);
        formData.append("tipo", tipoMovimentacao);

        if (imagem) {
            formData.append("imagem", imagem);
        }

        try {

            const resposta = await fetch("/entrada", {
                method: "POST",
                body: formData
            });

            const data = await resposta.json();

            const msg = document.getElementById("mensagem");

            if (data.success) {

                localStorage.removeItem("rascunho_editar");

                msg.innerText = "Registro salvo com sucesso ✔";
                msg.style.color = "green";

                setTimeout(() => {
                    window.location.href = "/tabela";
                }, 1000);

            } else {

                msg.innerText = data.erro || "Erro ao salvar";
                msg.style.color = "red";
            }

        } catch (erro) {

            console.error(erro);

            const msg = document.getElementById("mensagem");
            msg.innerText = "Erro ao conectar com o servidor.";
            msg.style.color = "red";
        }
    });


    // UPLOAD (ABRIR INPUT)
    btnUpload?.addEventListener("click", () => {
        fileInput?.click();
    });


    // MENSAGEM QUANDO ESCOLHE IMAGEM 
    fileInput?.addEventListener("change", () => {

        const msg = document.getElementById("mensagem");

        if (fileInput.files.length > 0) {
            msg.innerText = "Imagem adicionada com sucesso ✔";
            msg.style.color = "green";
        }
    });


    // EXCLUIR ITEM
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
    };


    // EXCLUIR USUÁRIO
    window.excluirUsuario = async function(id) {

        const confirmacao = confirm("Tem certeza que deseja excluir este usuário?");
        if (!confirmacao) return;

        const resposta = await fetch(`/excluirUsuario/${id}`, {
            method: "DELETE"
        });

        const data = await resposta.json();

        if (data.success) {
            alert("Usuário excluído com sucesso!");
            location.reload();
        } else {
            alert("Erro ao excluir usuário");
        }
    };

});