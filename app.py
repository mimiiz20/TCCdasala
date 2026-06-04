from flask import Flask, render_template, request, jsonify, redirect, session
import mysql.connector
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# PÁGINA INICIAL DE LOGIN
app.secret_key = "chave_secreta_123"

# FUNÇÕES DE AUTORIZAÇÃO
def login_required():
    return 'usuario' in session


def admin_required():
    return session.get('tipo') == 'admin'

# DO LOGIN PARA TABELA

# Define a rota inicial
@app.route('/')
def home():
    return render_template('index.html')

# Rota de como o usurário e o admin vão logar
@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    senha = request.form.get('senha')

    conexao = mysql.connector.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='almoxarifado'
    )

    cursor = conexao.cursor()

    cursor.execute("""
        SELECT * FROM usuarios
        WHERE email = %s AND senha = %s
    """, (email, senha))

    user = cursor.fetchone()

    cursor.close()
    conexao.close()

    if user:
        session['usuario'] = user[1]   
        session['tipo'] = user[4]      
        return redirect('/tabela')
    else:
        return "Email ou senha inválidos"

# ROTAS ADMIN + USUÁRIO

# Tabela.html: Página para visualizar estoque
@app.route('/tabela')
def tabela():
    if not login_required():
        return redirect('/')

    conexao = mysql.connector.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='almoxarifado'
    )

    cursor = conexao.cursor()
    cursor.execute("SELECT * FROM estoque")
    resultado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return render_template('tabela.html', resultado=resultado)

# Editar.html: Página para editar o estoque
@app.route('/editar')
def editar():
    if not login_required():
        return redirect('/')

    return render_template('editar.html')

# ROTAS (SOMENTE ADMIN)

# Acesso.html: Página para visualizar contas de usuários
@app.route('/acesso')
def acesso():
    if not login_required():
        return redirect('/')

    if not admin_required():
        return "Acesso negado (somente admin)"

    conexao = mysql.connector.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='almoxarifado'
    )

    cursor = conexao.cursor()

    cursor.execute("SELECT * FROM usuarios")
    resultado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return render_template('acesso.html', resultado=resultado)

# Excluir usuários
@app.route('/excluirUsuario/<int:id>', methods=['DELETE'])
def excluir_usuario(id):

    conexao = mysql.connector.connect(
        host='localhost',
        port=3306,
        user='root',
        password='',
        database='almoxarifado'
    )

    cursor = conexao.cursor()

    cursor.execute(
        "DELETE FROM usuarios WHERE id = %s",
        (id,)
    )

    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({"success": True})

# Cadastrar.html: Página para adicionar e monitorar contas de usuários
@app.route('/cadastro')
def cadastro():
    if not login_required():
        return redirect('/')

    if not admin_required():
        return "Acesso negado (somente admin)"

    return render_template('cadastro.html')

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

 # SALVAR IMAGEM 

    if imagem:
        nome_arquivo = secure_filename(imagem.filename)

        pasta = "static/uploads"
        os.makedirs(pasta, exist_ok=True)

        caminho_salvar = os.path.join(pasta, nome_arquivo)
        imagem.save(caminho_salvar)

        caminho_imagem = "/" + caminho_salvar.replace("\\", "/")
    else:
        caminho_imagem = None

# ENTRADA  E SAÍDA DE NOVOS VALORES
    if tipo == "entrada":

        sql = """
        INSERT INTO estoque (responsavel, nome, qtde, imagem)
        VALUES (%s, %s, %s, %s)
        """

        cursor.execute(sql, (responsavel, nome, qtde, caminho_imagem))

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

