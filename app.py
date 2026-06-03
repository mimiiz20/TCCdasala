from flask import Flask, render_template, request, jsonify
import mysql.connector
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# MUDAR ROTA DA PÁGINA
@app.route('/')
def home():
    return render_template('index.html')

# ENTRADA E SAÍDA
@app.route('/tabela')
def tabela():
    conexao = mysql.connector.connect(
        host= 'localhost',
        port = 3306,    
        user = 'root',
        password = '',
        database = 'almoxarifado'
    )
    cursor = conexao.cursor()
    cursor.execute("SELECT * FROM estoque")

    resultado = cursor.fetchall()

    return render_template('tabela.html', resultado=resultado)

@app.route('/editar')
def movimentar():
    return render_template('editar.html')

@app.route('/entrada', methods=['POST'])
def entrada():

    nome = request.form.get('nome')
    qtde = int(request.form.get('qtde'))
    responsavel = request.form.get('responsavel')
    tipo = request.form.get('tipo')
    imagem = request.files.get("imagem")

    conexao = mysql.connector.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='almoxarifado'
    )

    cursor = conexao.cursor()

    # =========================
    # 1. SALVAR IMAGEM PRIMEIRO
    # =========================
    if imagem:
        nome_arquivo = secure_filename(imagem.filename)

        pasta = "static/uploads"
        os.makedirs(pasta, exist_ok=True)

        caminho_salvar = os.path.join(pasta, nome_arquivo)
        imagem.save(caminho_salvar)

        caminho_imagem = "/" + caminho_salvar.replace("\\", "/")
    else:
        caminho_imagem = None

    # =========================
    # 2. ENTRADA
    # =========================
    if tipo == "entrada":

        sql = """
        INSERT INTO estoque (responsavel, nome, qtde, imagem)
        VALUES (%s, %s, %s, %s)
        """

        cursor.execute(sql, (responsavel, nome, qtde, caminho_imagem))

    # =========================
    # 3. SAÍDA
    # =========================
    elif tipo == "saida":

        sql = """
        UPDATE estoque
        SET qtde = qtde - %s
        WHERE nome = %s
        """

        cursor.execute(sql, (qtde, nome))

    conexao.commit()
    cursor.close()
    conexao.close()

    return jsonify({"success": True})

# EXCLUIR LINHA
@app.route('/excluir/<int:id>', methods=['DELETE'])
def excluir(id):

    conexao = mysql.connector.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='almoxarifado'
    )

    cursor = conexao.cursor()

    cursor.execute(
        "DELETE FROM estoque WHERE id = %s",
        (id,)
    )

    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)

