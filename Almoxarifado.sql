CREATE DATABASE almoxarifado;

USE almoxarifado;

CREATE TABLE estoque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    responsavel VARCHAR(100),
    nome VARCHAR(255),
    qtde INT,
    estoque_min INT,
    descricao VARCHAR (500),
    preco DECIMAL (10,2),
    imagem VARCHAR(255)
);

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'usuario'
);

INSERT INTO estoque (responsavel, nome, qtde, estoque_min, descricao, preco, imagem)
VALUES ("Róger", "Chave Fenda", 12, 24, "Chave de fenda pequena", 25.00, "/static/chave_fenda.jpg");
INSERT INTO estoque (responsavel, nome, qtde, estoque_min, descricao, preco, imagem)
VALUES ("Viviane", "Alicate", 8, 28, "Alicate da marca Tramontina", 28.00, "/static/alicate.jpg");

INSERT INTO usuarios (user, email, senha, tipo)
VALUES ('Administrador', 'admin@empresa.com', '123456', 'admin');
INSERT INTO usuarios (user, email, senha, tipo)
VALUES ('João', 'joao@empresa.com', '123456', 'usuário');	

SELECT * FROM estoque;
SELECT * FROM usuarios;

DROP TABLE estoque;
TRUNCATE TABLE estoque;
TRUNCATE TABLE usuarios;