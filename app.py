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

# LOGIN
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

# LOGOUT
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

# TABELA
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

# -----------------------------
# ENTRADA / SAÍDA ESTOQUE
# -----------------------------
@app.route('/entrada', methods=['POST'])
def entrada():

    nome = request.form.get('nome')
    categoria = request.form.get('categoria')
    qtde = request.form.get('qtde')
    responsavel = request.form.get('responsavel')
    estoque_min = request.form.get('estoque_min')
    preco = request.form.get('preco')
    descricao = request.form.get('descricao')
    tipo = request.form.get('tipo')
    imagem = request.files.get("imagem")

    # validação básica
    if not nome or not qtde or not responsavel or not tipo:
        return jsonify({"success": False, "erro": "Campos obrigatórios"}), 400

    qtde = int(qtde)
    estoque_min = int(estoque_min) if estoque_min else 0
    preco = float(preco) if preco else 0

    conexao = get_db()
    cursor = conexao.cursor()

    cursor.execute("SELECT qtde, preco FROM estoque WHERE nome = %s", (nome,))
    item = cursor.fetchone()

    # -----------------------------
    # ENTRADA (SOMA)
    # -----------------------------
    if tipo == "entrada":

        if item:
            qtde_atual, preco_atual = item

            nova_qtde = qtde_atual + qtde
            novo_preco = float(preco_atual) + float(preco)

            cursor.execute("""
                UPDATE estoque
                SET qtde = %s,
                    estoque_min = %s,
                    categoria = %s,
                    preco = %s,
                    descricao = %s
                WHERE nome = %s
            """, (nova_qtde, estoque_min, categoria, novo_preco, descricao, nome))

        else:
            cursor.execute("""
                INSERT INTO estoque
                (responsavel, nome, categoria, qtde, estoque_min, descricao, preco, imagem)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (responsavel, nome, categoria, qtde, estoque_min, descricao, preco, None))

        conexao.commit()

    # -----------------------------
    # SAÍDA (SUBTRAI)
    # -----------------------------
    elif tipo == "saida":

        cursor.execute("SELECT qtde FROM estoque WHERE nome = %s", (nome,))
        produto = cursor.fetchone()

        if not produto:
            return jsonify({"success": False, "erro": "Produto não encontrado"}), 404

        qtde_atual = produto[0]

        if qtde_atual < qtde:
            return jsonify({"success": False, "erro": "Estoque insuficiente"}), 400

        nova_qtde = qtde_atual - qtde

        cursor.execute("""
            UPDATE estoque
            SET qtde = %s
            WHERE nome = %s
        """, (nova_qtde, nome))

        conexao.commit()

    else:
        return jsonify({"success": False, "erro": "Tipo inválido"}), 400

    cursor.close()
    conexao.close()

    return jsonify({"success": True}), 200

# EXCLUIR ITEM
@app.route('/excluir/<int:id>', methods=['DELETE'])
def excluir(id):

    conexao = get_db()
    cursor = conexao.cursor()

    cursor.execute("DELETE FROM estoque WHERE id = %s", (id,))
    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({"success": True})

# EDITAR
@app.route('/editar')
def editar():
    if not login_required():
        return redirect('/')

    return render_template('editar.html')

# ACESSO
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

# EXCLUIR USUÁRIO
@app.route('/excluirUsuario/<int:id>', methods=['DELETE'])
def excluir_usuario(id):

    conexao = get_db()
    cursor = conexao.cursor()

    cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({"success": True})

# CADASTRO
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

# RODAR
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)