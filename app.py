from flask import Flask, render_template, request, jsonify, redirect, session, url_for
import mysql.connector
import os
import bcrypt
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "brasil"

import bcrypt

def gerar_hash(senha_texto):
    senha_bytes = senha_texto.encode('utf-8')
    salt = bcrypt.gensalt()
    senha_hash = bcrypt.hashpw(senha_bytes, salt)
    return senha_hash.decode('utf-8')  

def verificar_senha(senha_digitada, hash_armazenado):
    if not hash_armazenado:
        return False
    senha_bytes = senha_digitada.encode('utf-8')
    hash_bytes = hash_armazenado.encode('utf-8')
    return bcrypt.checkpw(senha_bytes, hash_bytes)

# CONEXÃO
def get_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        user='root',
        password='',
        database='almoxarifado',
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
        WHERE email = %s
    """, (email,))

    user = cursor.fetchone()
    print(user)

    cursor.close()
    conexao.close()

    if user and verificar_senha(senha, user[4]):
        session['usuario'] = user[1]
        session['email'] = user[2]
        session['tipo'] = user[3]
        return redirect('/tabela')

    return render_template ('login_erro.html', erro=True)

# LOGIN INCORRETO
@app.route('/login_erro.html')
def login_erro():
    return render_template('login_erro.html')

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

# ENTRADA / SAÍDA ESTOQUE

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

    if imagem:
        nome_arquivo = secure_filename(imagem.filename)

        pasta = os.path.join("static", "uploads")
        os.makedirs(pasta, exist_ok=True)

        caminho_salvar = os.path.join(pasta, nome_arquivo)
        imagem.save(caminho_salvar)

        caminho_imagem = url_for('static', filename=f'uploads/{nome_arquivo}')
    else:
        conexao = get_db()
        cursor = conexao.cursor()

        cursor.execute("SELECT imagem FROM estoque WHERE nome = %s", (nome,))
        foto = cursor.fetchone()
        caminho_imagem = foto[0]
        cursor.close()
        conexao.close()

    if not nome or not qtde or not responsavel or not tipo:
        return jsonify({"success": False, "erro": "Campos obrigatórios"}), 400
    qtde = int(qtde)

    conexao = get_db()
    cursor = conexao.cursor()

    cursor.execute("SELECT qtde, preco FROM estoque WHERE nome = %s", (nome,))
    item = cursor.fetchone()


    if item:

        cursor.execute("""
            SELECT categoria, estoque_min, descricao, preco
            FROM estoque
            WHERE nome = %s
        """, (nome,))

        dados = cursor.fetchone()

        categoria_atual, estoque_min_atual, descricao_atual, preco_atual = dados

        categoria = categoria if categoria else categoria_atual

        estoque_min = (
            int(estoque_min)
            if estoque_min
            else estoque_min_atual
        )

        descricao = descricao if descricao else descricao_atual

        if preco:
            preco = float(preco)
        else:
            preco = 0

# ENTRADA (SOMA)
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
                    descricao = %s,
                    imagem = %s
                WHERE nome = %s
            """, (nova_qtde, estoque_min, categoria, novo_preco, descricao, caminho_imagem, nome))
            conexao.commit()
        else:
            cursor.execute("""
                INSERT INTO estoque
                (responsavel, nome, categoria, qtde, estoque_min, descricao, preco, imagem)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (responsavel, nome, categoria, qtde, estoque_min, descricao, preco, caminho_imagem))

        conexao.commit()

# SAÍDA (SUBTRAI)
    elif tipo == "saida":

        cursor.execute(
            "SELECT qtde, preco FROM estoque WHERE nome = %s",
            (nome,)
        )

        produto = cursor.fetchone()

        if not produto:
            return jsonify({
                "success": False,
                "erro": "Produto não encontrado"
            }), 404

        qtde_atual, preco_atual = produto

        if qtde_atual < qtde:
            return jsonify({
                "success": False,
                "erro": "Estoque insuficiente"
            }), 400

        nova_qtde = qtde_atual - qtde
        novo_preco = float(preco_atual) - float(preco)

        if novo_preco < 0:
            novo_preco = 0

        cursor.execute("""
            UPDATE estoque
            SET qtde = %s,
                estoque_min = %s,
                categoria = %s,
                preco = %s,
                descricao = %s,
                imagem = %s
            WHERE nome = %s
        """, (
            nova_qtde,
            estoque_min,
            categoria,
            novo_preco,
            descricao,
            caminho_imagem,
            nome
        ))

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

    senha_criptografada = gerar_hash(senha)

    conexao = get_db()
    cursor = conexao.cursor()

    cursor.execute("""
        INSERT INTO usuarios (user, email, senha, tipo)
        VALUES (%s, %s, %s, %s)
    """, (usuario, email, senha_criptografada, perfil))

    conexao.commit()
    cursor.close()
    conexao.close()

    return redirect('/acesso')

# RODAR
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)