from flask import Flask, render_template, request, jsonify, redirect, session, url_for
import mysql.connector
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "chave_secreta_123"

# CONEXÃO

def get_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        user='root',
        password='',
        database='almoxarifado',
        port=3306
    )

# AUTORIZAÇÃO

def login_required():
    return 'usuario' in session

def admin_required():
    return session.get('tipo') == 'admin'

# HOME 

@app.route('/')
def home():
    return render_template('index.html')


# Login da tela do index.html

@app.route('/login', methods=['POST'])
def login():

    email = request.form.get('email')
    senha = request.form.get('senha')

    conexao = get_db()
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
        session['email'] = user[2]
        return redirect('/tabela')

    return "Email ou senha inválidos"

# LOGOUT (Ao clicar no botão de logout)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

# TELA TABELA 

@app.route('/tabela')
def tabela():

    if not login_required():
        return redirect('/')

    conexao = get_db()
    cursor = conexao.cursor()

    cursor.execute("SELECT * FROM estoque")
    resultado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return render_template('tabela.html', resultado=resultado)

# ENTRADA / SAÍDA ESTOQUE 

@app.route('/entrada', methods=['POST'])
def entrada():

    nome = request.form.get('nome')
    qtde = request.form.get('qtde')
    responsavel = request.form.get('responsavel')
    tipo = request.form.get('tipo')
    imagem = request.files.get("imagem")

    if not nome or not qtde or not responsavel or not tipo:
        return jsonify({"success": False, "erro": "Campos obrigatórios"}), 400

    qtde = int(qtde)

    caminho_imagem = None

    if imagem:
        nome_arquivo = secure_filename(imagem.filename)

        pasta = os.path.join("static", "uploads")
        os.makedirs(pasta, exist_ok=True)

        caminho_salvar = os.path.join(pasta, nome_arquivo)
        imagem.save(caminho_salvar)

        caminho_imagem = url_for('static', filename=f'uploads/{nome_arquivo}')

    conexao = get_db()
    cursor = conexao.cursor()

    cursor.execute("SELECT id FROM estoque WHERE nome = %s", (nome,))
    item = cursor.fetchone()

    if tipo == "entrada":

        if item:
            cursor.execute("""
                UPDATE estoque
                SET qtde = qtde + %s
                WHERE nome = %s
            """, (qtde, nome))
        else:
            cursor.execute("""
                INSERT INTO estoque (responsavel, nome, qtde, imagem)
                VALUES (%s, %s, %s, %s)
            """, (responsavel, nome, qtde, caminho_imagem))

    elif tipo == "saida":

        cursor.execute("""
            UPDATE estoque
            SET qtde = qtde - %s
            WHERE nome = %s
        """, (qtde, nome))

    conexao.commit()
    cursor.close()
    conexao.close()

    return jsonify({"success": True})

# Excluir item do estoque

@app.route('/excluir/<int:id>', methods=['DELETE'])
def excluir(id):

    conexao = get_db()
    cursor = conexao.cursor()

    cursor.execute("DELETE FROM estoque WHERE id = %s", (id,))
    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({"success": True})

# TELA EDITAR

@app.route('/editar')
def editar():

    if not login_required():
        return redirect('/')

    return render_template('editar.html')

# TELA ACESSO (Apenas para admin)

@app.route('/acesso')
def acesso():

    if not login_required():
        return redirect('/')

    if not admin_required():
        return "Acesso negado"

    conexao = get_db()
    cursor = conexao.cursor()

    cursor.execute("SELECT * FROM usuarios")
    resultado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return render_template('acesso.html', resultado=resultado)

# Função de excluir usuário (Apenas para admin)

@app.route('/excluirUsuario/<int:id>', methods=['DELETE'])
def excluir_usuario(id):

    conexao = get_db()
    cursor = conexao.cursor()

    cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({"success": True})

# TELA CADASTRO DE USUÁRIOS (Apenas para admin)

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():

    if not login_required():
        return redirect('/')

    if not admin_required():
        return "Acesso negado"

    if request.method == 'GET':
        return render_template('cadastro.html')

    usuario = request.form.get('user')
    email = request.form.get('email')
    senha = request.form.get('senha')
    perfil = request.form.get('perfil')

    conexao = get_db()
    cursor = conexao.cursor()

    cursor.execute("""
        INSERT INTO usuarios (user, email, senha, tipo)
        VALUES (%s, %s, %s, %s)
    """, (usuario, email, senha, perfil))

    conexao.commit()
    cursor.close()
    conexao.close()

    return redirect('/acesso')

# RODAR A APLICAÇÃO

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)