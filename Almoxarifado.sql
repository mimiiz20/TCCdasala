CREATE DATABASE almoxarifado;

USE almoxarifado;

CREATE TABLE estoque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    responsavel VARCHAR(100),
    nome VARCHAR(255),
    qtde INT,
    imagem VARCHAR(255)
);

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'usuario'
);

INSERT INTO estoque (responsavel, nome, qtde, imagem)
VALUES ("Róger", "Chave Fenda", 12, "/static/chave_fenda.jpg");
INSERT INTO estoque (responsavel, nome, qtde, imagem)
VALUES ("Viviane", "Alicate", 8, "/static/alicate.jpg");

INSERT INTO usuarios (user, email, senha, tipo)
VALUES ('Administrador', 'admin@empresa.com', '123456', 'admin');
INSERT INTO usuarios (user, email, senha, tipo)
VALUES ('João', 'joao@empresa.com', '123456', 'usuário');	

SELECT * FROM estoque;
SELECT * FROM usuarios;

TRUNCATE TABLE estoque;
TRUNCATE TABLE usuarios;git